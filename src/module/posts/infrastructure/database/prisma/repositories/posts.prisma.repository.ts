import { Injectable } from "@nestjs/common"
import { Prisma, User } from "@prisma/client"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { PrismaService } from "prisma/prisma.service"
import { Comment } from "src/module/posts/domain/entity/comments.entity"
import { PostReactions } from "src/module/posts/domain/entity/post-reactions.entity"
import { Post } from "src/module/posts/domain/entity/posts.entity"
import { EUserPostVisibility } from "src/module/posts/domain/enum/posts.enum"
import { ESharedType } from "src/module/posts/domain/enum/shared-type.enum"
import { IPostsRepository } from "src/module/posts/domain/repository/posts.interface.repository"
import { UserAggregate } from "src/module/users/domain/aggregate"
import { handlePrismaError } from "utils/prisma-error"
import { CommentMapper } from "../mapper/comments.prisma.mapper"
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
  async searchPostsByKeyword(keyword: string): Promise<Post[]> {
    try {
      const posts = await this.prismaService.post.findMany({
        where: {
          content: {
            contains: keyword,
            mode: "insensitive",
          },
          deletedAt: null,
        },
      })
      if (!posts) {
        return []
      }
      const result = posts.map((p) => PostMapper.toDomain(p))
      return result ?? []
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
        return []
      }
      const ids = posts.map((post) => post.id)
      const queryPost = await this.prismaService.post.findMany({
        where: { id: { in: ids } },
        orderBy: { [orderBy]: order },
      })
      if (!queryPost) {
        return []
      }
      const result = queryPost.map((e) => {
        const post = PostMapper.toDomain(e)
        return post
      })
      return result ?? []
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
  async getPostOfUsers(
    userIds: string[],
    {
      limit,
      offset,
      orderBy,
      order,
    }: {
      limit?: number
      offset?: number
      orderBy?: string
      order?: "asc" | "desc"
    },
  ): Promise<Post[]> {
    try {
      const postEntries = await this.prismaService.post.findMany({
        where: {
          userId: { in: userIds },
          deletedAt: null,
        },
        ...(offset !== null ? { skip: offset } : {}),
        ...(limit !== null ? { take: limit } : {}),
        select: {
          id: true,
        },
      })
      if (postEntries.length === 0) {
        return []
      }
      const postIds = postEntries.map((e) => e.id)
      const posts = await this.prismaService.post.findMany({
        where: {
          id: {
            in: postIds,
          },
        },
        orderBy: { [orderBy]: order },
      })
      if (!posts) {
        return []
      }
      const result = posts.map((p) => PostMapper.toDomain(p))
      return result ?? []
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
  async getHiddenUserIds(user: UserAggregate): Promise<string[]> {
    try {
      const hiddenUsers = await this.prismaService.hiddenUser.findMany({
        where: { userId: user.id },
        select: { hiddenUserId: true },
      })
      if (!hiddenUsers) {
        return []
      }
      return hiddenUsers.map((e) => e.hiddenUserId)
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
          id: reaction.id,
        },
      })
      const data = PostReactionMapper.toPersistence(reaction)
      if (existReact) {
        await this.prismaService.postReaction.update({
          where: {
            id: reaction.id,
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
          id: reaction.id,
        },
      })
      if (existReact) {
        await this.prismaService.postReaction.delete({
          where: {
            id: reaction.id,
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
          const count = await this.prismaService.friend.count({
            where: {
              OR: [
                { userId: post.userId, friendId: currentUser.id },
                { userId: currentUser.id, friendId: post.userId },
              ],
            },
          })
          return count > 0
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
  async isSharedPost(post: Post, user: UserAggregate): Promise<boolean> {
    try {
      const sharedPost = await this.prismaService.sharedPost.findFirst({
        where: { postId: post.id, sharedById: user.id },
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
  async sharePost(
    post: Post,
    shareBy: UserAggregate,
    shareTo: UserAggregate,
    shareToType: ESharedType,
    customContent: string,
  ): Promise<void> {
    try {
      await this.prismaService.sharedPost.create({
        data: {
          postId: post.id,
          sharedById: shareBy.id,
          sharedToId: shareTo.id,
          sharedToType: shareToType,
          customContent: customContent,
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
  async createComment(comment: Comment): Promise<void> {
    try {
      const data = CommentMapper.toPersistence(comment)
      await this.prismaService.postComment.create({ data })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async findCommentById(commentId: string): Promise<Comment> {
    try {
      const comment = await this.prismaService.postComment.findUnique({
        where: {
          id: commentId,
        },
      })
      if (!comment) {
        return null
      }
      return CommentMapper.toDomain(comment) ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async updateComment(comment: Comment): Promise<void> {
    try {
      let foundComment = await this.prismaService.postComment.findUnique({
        where: { id: comment.id },
      })
      if (!foundComment) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.NOT_FOUND,
          message: "Comment not found",
        })
      }
      foundComment = CommentMapper.toPersistence(comment)
      const updatedComment = await this.prismaService.postComment.update({
        where: { id: comment.id },
        data: foundComment,
      })
      if (!updatedComment) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.BAD_REQUEST,
          message: "Update operation not work",
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
  async deleteComment(comment: Comment): Promise<void> {
    try {
      const id = comment.id
      const foundComment = await this.prismaService.postComment.findUnique({
        where: { id },
      })
      if (!foundComment) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.NOT_FOUND,
          message: "Comment not found",
        })
      }
      await this.prismaService.postComment.delete({
        where: { id: foundComment.id },
      })
    } catch (error) {
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getCommentByPost(post: Post): Promise<Comment[]> {
    try {
      const comments = await this.prismaService.postComment.findMany({
        where: { postId: post.id },
      })
      if (!comments) {
        return []
      }
      const result = comments.map((e) => CommentMapper.toDomain(e))
      return result ?? []
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
}
