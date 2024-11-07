import { Injectable } from "@nestjs/common"
import { Prisma, User } from "@prisma/client"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { PrismaService } from "prisma/prisma.service"
import { PostReactions } from "src/module/posts/domain/entity/post-reactions.entity"
import { Post } from "src/module/posts/domain/entity/posts.entity"
import { EUserPostVisibility } from "src/module/posts/domain/enum/posts.enum"
import { IPostsRepository } from "src/module/posts/domain/repository/posts.interface.repository"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { handlePrismaError } from "utils/prisma-error"
import { PostReactionMapper } from "../mapper/post-reactions.prisma.mapper"
import { PostMapper } from "../mapper/posts.prisma.mapper"

@Injectable()
export class PostsRepository implements IPostsRepository {
  constructor(private readonly prismaService: PrismaService) {}
  // user post
  async createPost(post: Post, taggedUserIds?: string[] | null): Promise<void> {
    try {
      const data = PostMapper.toPersistence(post)
      const existPost = await this.prismaService.post.findUnique({
        where: { id: data.id },
      })
      if (existPost) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
          message: "Already exist this data",
        })
      }
      await this.prismaService.$transaction(async (prisma) => {
        await this.prismaService.post.create({ data })
        if (taggedUserIds && taggedUserIds.length > 0) {
          const taggedUsersData = taggedUserIds.map((taggedUserId) => ({
            postId: post.id,
            taggedUserId,
          }))

          await prisma.postTaggedUser.createMany({ data: taggedUsersData })
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async findPostById(postId: string): Promise<Post | null> {
    try {
      const post = await this.prismaService.post.findUnique({
        where: { id: postId },
      })
      if (!post) {
        return null
      }
      const result = PostMapper.toDomain(post)
      return result ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async updatePost(data: Post, taggedUserIds?: string[] | null): Promise<void> {
    try {
      const { id } = data
      let foundPost = await this.prismaService.post.findUnique({
        where: { id },
      })
      if (!foundPost) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.NOT_FOUND,
          message: "Post not found",
        })
      }
      foundPost = PostMapper.toPersistence(data)
      await this.prismaService.$transaction(async (prisma) => {
        const updatedPost = await this.prismaService.post.update({
          where: { id },
          data: foundPost,
        })
        if (!updatedPost) {
          throw new InfrastructureError({
            code: InfrastructureErrorCode.BAD_REQUEST,
            message: "Update operation not work",
          })
        }
        if (taggedUserIds && taggedUserIds.length > 0) {
          await prisma.postTaggedUser.deleteMany({
            where: { postId: id },
          })
          const taggedUsersData = taggedUserIds.map((taggedUserId) => ({
            postId: foundPost.id,
            taggedUserId,
          }))

          await prisma.postTaggedUser.createMany({ data: taggedUsersData })
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async deletePost(post: Post): Promise<void> {
    try {
      const id = post.id
      const foundPost = await this.prismaService.post.findUnique({
        where: { id },
      })
      if (!foundPost) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.NOT_FOUND,
          message: "Post not found",
        })
      }
      await this.prismaService.post.update({
        where: { id: post.id },
        data: { deletedAt: new Date() },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getUserPost(
    userId: string,
    {
      limit = 1,
      offset = 0,
      orderBy = "createdAt",
      order = "desc",
    }: {
      limit?: number
      offset?: number
      orderBy?: string
      order?: "asc" | "desc"
    },
  ): Promise<Post[]> {
    try {
      const posts = await this.prismaService.post.findMany({
        where: { deletedAt: null, userId },
        ...(offset !== null ? { skip: offset } : {}),
        ...(limit !== null ? { take: limit } : {}),
        select: {
          id: true,
        },
      })
      if (!posts) {
        return null
      }
      const ids = posts.map((post) => post.id)
      const queryPost = await this.prismaService.post.findMany({
        where: { id: { in: ids } },
        orderBy: { [orderBy]: order },
      })
      if (!queryPost) {
        return null
      }
      const result = queryPost.map((e) => {
        const post = PostMapper.toDomain(e)
        return post
      })
      return result ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getPostsByVisibility(
    userId: string,
    visibility: EUserPostVisibility,
  ): Promise<Post[]> {
    try {
      let posts
      let result
      switch (visibility) {
        case EUserPostVisibility.PUBLIC:
          posts = await this.prismaService.post.findMany({
            where: {
              visibility: EUserPostVisibility.PUBLIC,
            },
          })
          result = posts.map((e) => {
            const post = PostMapper.toDomain(e)
            return post
          })
          return result ?? null

        case EUserPostVisibility.FRIENDS_ONLY:
          posts = await this.prismaService.post.findMany({
            where: {
              visibility: EUserPostVisibility.FRIENDS_ONLY,
            },
          })
          result = posts.map((e) => {
            const post = PostMapper.toDomain(e)
            return post
          })
          return result ?? null

        case EUserPostVisibility.SPECIFIC:
          posts = await this.prismaService.post.findMany({
            where: {
              visibility: EUserPostVisibility.SPECIFIC,
              viewPermissions: {
                some: { viewerId: userId },
              },
            },
          })
          result = posts.map((e) => {
            const post = PostMapper.toDomain(e)
            return post
          })
          return result ?? null

        case EUserPostVisibility.ONLY_ME:
          posts = await this.prismaService.post.findMany({
            where: {
              visibility: EUserPostVisibility.ONLY_ME,
              userId: userId,
            },
          })
          result = posts.map((e) => {
            const post = PostMapper.toDomain(e)
            return post
          })
          return result ?? null

        default:
          throw new InfrastructureError({
            code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
            message: `Unknown visibility type: ${visibility}`,
          })
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async isUserHidden(
    user: UserAggregate,
    hiddenUser: UserAggregate,
  ): Promise<boolean> {
    try {
      const existingHiddenUser = await this.prismaService.hiddenUser.findUnique(
        {
          where: {
            userId_hiddenUserId: {
              userId: user.id,
              hiddenUserId: hiddenUser.id,
            },
          },
        },
      )
      return !!existingHiddenUser
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async hidePostsFromUser(userId: string, hiddenUserId: string): Promise<void> {
    try {
      const existingHiddenUser = await this.prismaService.hiddenUser.findUnique(
        {
          where: { userId_hiddenUserId: { userId, hiddenUserId } },
        },
      )
      if (!existingHiddenUser) {
        await this.prismaService.hiddenUser.create({
          data: {
            userId,
            hiddenUserId,
          },
        })
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async unhidePostsFromUser(
    userId: string,
    hiddenUserId: string,
  ): Promise<void> {
    try {
      const existingHiddenUser = await this.prismaService.hiddenUser.findUnique(
        {
          where: { userId_hiddenUserId: { userId, hiddenUserId } },
        },
      )
      if (existingHiddenUser) {
        await this.prismaService.hiddenUser.delete({
          where: { userId_hiddenUserId: { userId, hiddenUserId } },
        })
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async isPostHiddenFromUser(
    user: UserAggregate,
    post: Post,
  ): Promise<boolean> {
    try {
      const hiddenUser = await this.prismaService.hiddenUser.findUnique({
        where: {
          userId_hiddenUserId: {
            userId: user.id,
            hiddenUserId: post.userId,
          },
        },
      })
      return !!hiddenUser
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async addOrUpdateReactionToPost(reaction: PostReactions): Promise<void> {
    try {
      const existReact = await this.prismaService.postReaction.findUnique({
        where: {
          userId_postId: {
            userId: reaction.userId,
            postId: reaction.postId,
          },
        },
      })
      const data = PostReactionMapper.toPersistence(reaction)
      if (existReact) {
        await this.prismaService.postReaction.update({
          where: {
            userId_postId: {
              userId: reaction.userId,
              postId: reaction.postId,
            },
          },
          data,
        })
      } else {
        await this.prismaService.postReaction.create({
          data,
        })
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async removeReactionFromPost(reaction: PostReactions): Promise<void> {
    try {
      const existReact = await this.prismaService.postReaction.findUnique({
        where: {
          userId_postId: {
            userId: reaction.userId,
            postId: reaction.postId,
          },
        },
      })
      if (existReact) {
        await this.prismaService.postReaction.delete({
          where: {
            userId_postId: {
              userId: reaction.userId,
              postId: reaction.postId,
            },
          },
        })
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getPostReactions(post: Post): Promise<PostReactions[]> {
    try {
      const reactions = await this.prismaService.postReaction.findMany({
        where: {
          postId: post.id,
        },
      })
      if (!reactions) {
        return null
      }
      const result = reactions.map((r) => PostReactionMapper.toDomain(r))
      return result ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async addTagUser(user: UserAggregate, post: Post): Promise<void> {
    try {
      await this.prismaService.postTaggedUser.create({
        data: {
          postId: post.id,
          taggedUserId: user.id,
        },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async addTagUsers(users: UserAggregate[], post: Post): Promise<void> {
    try {
      const taggedUsersData = users.map((user) => ({
        postId: post.id,
        taggedUserId: user.id,
      }))

      await this.prismaService.postTaggedUser.createMany({
        data: taggedUsersData,
        skipDuplicates: true, // Ensures no duplicate entries are created if some users are already tagged
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }

  async removeTagUser(user: UserAggregate, post: Post): Promise<void> {
    try {
      await this.prismaService.postTaggedUser.delete({
        where: {
          postId_taggedUserId: {
            postId: post.id,
            taggedUserId: user.id,
          },
        },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async removeAllTagUser(post: Post): Promise<void> {
    try {
      await this.prismaService.postTaggedUser.deleteMany({
        where: {
          postId: post.id,
        },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getAllTagUserId(post: Post): Promise<string[] | null> {
    try {
      const taggedUsers = await this.prismaService.postTaggedUser.findMany({
        where: { postId: post.id },
      })
      if (!taggedUsers) {
        return null
      }
      const result = taggedUsers.map((e) => e.taggedUserId)
      return result ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getAllTagPost(user: UserAggregate): Promise<Post[] | null> {
    try {
      const taggedPosts = await this.prismaService.postTaggedUser.findMany({
        where: { taggedUserId: user.id },
      })
      if (!taggedPosts) {
        return null
      }
      const posts = await Promise.all(
        taggedPosts.map((e) => {
          return (
            this.prismaService.post.findUnique({ where: { id: e.postId } }) ??
            null
          )
        }),
      )
      const result = posts.map((p) => PostMapper.toDomain(p))
      return result ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async addUserView(user: UserAggregate, post: Post) {
    try {
      const existedData =
        await this.prismaService.userPostViewPermission.findUnique({
          where: {
            postId_viewerId: {
              postId: post.id,
              viewerId: user.id,
            },
          },
        })
      if (existedData) {
        return
      }
      await this.prismaService.userPostViewPermission.create({
        data: {
          postId: post.id,
          viewerId: user.id,
        },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async addUserViews(user: UserAggregate[], post: Post): Promise<void> {
    try {
      await Promise.all(
        user.map(async (u) => {
          const existedData =
            await this.prismaService.userPostViewPermission.findUnique({
              where: {
                postId_viewerId: {
                  postId: post.id,
                  viewerId: u.id,
                },
              },
            })
          if (existedData) {
            return
          }
          await this.prismaService.userPostViewPermission.create({
            data: {
              postId: post.id,
              viewerId: u.id,
            },
          })
        }),
      )
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async removeUserView(user: UserAggregate, post: Post): Promise<void> {
    try {
      const existedData =
        await this.prismaService.userPostViewPermission.findUnique({
          where: {
            postId_viewerId: {
              postId: post.id,
              viewerId: user.id,
            },
          },
        })
      if (!existedData) {
        return
      }
      await this.prismaService.userPostViewPermission.delete({
        where: {
          postId_viewerId: {
            postId: post.id,
            viewerId: user.id,
          },
        },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async removeUserViews(user: UserAggregate[], post: Post): Promise<void> {
    try {
      await Promise.all(
        user.map(async (u) => {
          const existedData =
            await this.prismaService.userPostViewPermission.findUnique({
              where: {
                postId_viewerId: {
                  postId: post.id,
                  viewerId: u.id,
                },
              },
            })
          if (!existedData) {
            return
          }
          await this.prismaService.userPostViewPermission.delete({
            where: {
              postId_viewerId: {
                postId: post.id,
                viewerId: u.id,
              },
            },
          })
        }),
      )
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async removePostUserViews(post: Post): Promise<void> {
    try {
      const existedDatas =
        await this.prismaService.userPostViewPermission.findMany({
          where: {
            postId: post.id,
          },
        })
      if (!existedDatas || existedDatas.length === 0) {
        return
      }
      await this.prismaService.userPostViewPermission.deleteMany({
        where: {
          postId: post.id,
        },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async hasUserViewPermission(
    post: Post,
    currentUser: UserAggregate,
  ): Promise<boolean> {
    try {
      switch (post.visibility) {
        case EUserPostVisibility.PUBLIC:
          return true

        case EUserPostVisibility.FRIENDS_ONLY:
          // TODO(friend): will implement this when have friend table
          break
        case EUserPostVisibility.SPECIFIC:
          const permission =
            await this.prismaService.userPostViewPermission.findUnique({
              where: {
                postId_viewerId: {
                  postId: post.id,
                  viewerId: currentUser.id,
                },
              },
            })
          return !!permission
        case EUserPostVisibility.ONLY_ME:
          return post.userId === currentUser.id
        default:
          return true
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async isSharedPost(post: Post): Promise<boolean> {
    try {
      const sharedPost = await this.prismaService.sharedPost.findFirst({
        where: { postId: post.id },
      })
      return !!sharedPost
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getUserSharedPost(
    sharedFromUser: UserAggregate,
  ): Promise<Post[] | null> {
    try {
      const sharedPost = await this.prismaService.sharedPost.findMany({
        where: {
          sharedToId: sharedFromUser.id,
          // add esharetype later
        },
      })
      const posts = await Promise.all(
        sharedPost.map((p) => {
          return (
            this.prismaService.post.findUnique({ where: { id: p.postId } }) ??
            null
          )
        }),
      )
      const result = posts.map((p) => PostMapper.toDomain(p))
      return result ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
}
