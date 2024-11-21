import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { PrismaService } from "prisma/prisma.service"
import { GroupInvitation } from "src/module/groups/domain/entity/group-invitations.entity"
import { GroupInviteLink } from "src/module/groups/domain/entity/group-invite-links.entity"
import { GroupMember } from "src/module/groups/domain/entity/group-members.entity"
import { GroupPost } from "src/module/groups/domain/entity/group-posts.entity"
import { GroupRule } from "src/module/groups/domain/entity/group-rule.entity"
import { Group } from "src/module/groups/domain/entity/groups.entity"
import { MemberRequest } from "src/module/groups/domain/entity/member-requests.entity"
import { ScheduledGroupPost } from "src/module/groups/domain/entity/scheduled-posts.entity"
import { IGroupRepository } from "src/module/groups/domain/repository/group.interface.repository"
import { handlePrismaError } from "utils/prisma-error"
import { v4 as uuidv4 } from "uuid"
import { GroupInvitationMapper } from "../mapper/group-invitation.prisma.mapper"
import { GroupInviteLinkMapper } from "../mapper/group-invite-link.prisma.mapper"
import { MemberRequestMapper } from "../mapper/group-member-request.mapper"
import { GroupMemberMapper } from "../mapper/group-member.prisma.mapper"
import { GroupPostMapper } from "../mapper/group-post.prisma.mapper"
import { GroupRuleMapper } from "../mapper/group-rule.mapper"
import { GroupMapper } from "../mapper/group.prisma.mapper"
import { ScheduledPostMapper } from "../mapper/scheduled-post.prisma.mapper"

@Injectable()
export class GroupPrismaRepository implements IGroupRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async addGroup(group: Group): Promise<void> {
    try {
      const data = GroupMapper.toPersistence(group)
      const existGroup = await this.prismaService.group.findUnique({
        where: { id: data.id },
      })
      if (existGroup) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
          message: "Already exist this data",
        })
      }
      await this.prismaService.group.create({ data })
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

  async findGroupById(groupId: string): Promise<Group | null> {
    try {
      const group = await this.prismaService.group.findUnique({
        where: { id: groupId },
      })
      if (!group) {
        return null
      }
      const result = GroupMapper.toDomain(group)
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

  async updateGroup(group: Group): Promise<void> {
    try {
      let foundGroup = await this.prismaService.group.findUnique({
        where: { id: group.id },
      })
      if (!foundGroup) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.NOT_FOUND,
          message: "Group not found",
        })
      }
      foundGroup = GroupMapper.toPersistence(group)
      const updatedGroup = await this.prismaService.group.update({
        where: { id: foundGroup.id },
        data: foundGroup,
      })
      if (!updatedGroup) {
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

  async deleteGroup(group: Group): Promise<void> {
    try {
      const foundGroup = await this.prismaService.group.findUnique({
        where: { id: group.id },
      })
      if (!foundGroup) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.NOT_FOUND,
          message: "Group not found",
        })
      }
      await this.prismaService.group.update({
        where: { id: group.id },
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
  async getAllUserGroups(
    userId: string,
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
  ): Promise<Group[]> {
    try {
      const groups = await this.prismaService.groupMember.findMany({
        where: { deletedAt: null, memberId: userId },
        ...(offset !== null ? { skip: offset } : {}),
        ...(limit !== null ? { take: limit } : {}),
        select: {
          groupId: true,
        },
      })
      if (!groups) {
        return []
      }
      const ids = groups.map((group) => group.groupId)
      const queryGroup = await this.prismaService.group.findMany({
        where: { id: { in: ids } },
        ...(orderBy !== null ? { orderBy: { [orderBy]: order } } : {}),
      })
      if (!queryGroup) {
        return []
      }
      const result = queryGroup.map((e) => {
        const group = GroupMapper.toDomain(e)
        return group
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
  async getCommonGroupBetweenUsers(
    userId1: string,
    userId2: string,
  ): Promise<Group[]> {
    try {
      const commonGroupIds = await this.prismaService.$queryRaw<
        Array<{ groupId: string }>
      >`SELECT gm1."groupId" as groupId
      FROM twitch."groupMembers" gm1
      JOIN twitch."groupMembers" gm2 ON gm1."groupId" = gm2."groupId"
      WHERE gm1."memberId" = '${userId1}'
        AND gm2."memberId" = '${userId2}'
        AND gm1."deletedAt" IS NULL 
        AND gm2."deletedAt" IS NULL
      `

      if (!commonGroupIds || commonGroupIds.length === 0) {
        return []
      }
      const groupIds = commonGroupIds.map((i) => i.groupId)
      const groups = await this.prismaService.group.findMany({
        where: { id: { in: groupIds } },
      })
      if (!groups || groups.length === 0) {
        return []
      }
      return groups.map((g) => GroupMapper.toDomain(g)) ?? []
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }
  async addPost(
    post: GroupPost,
    taggedUserIds?: string[] | null,
    taggedGroup?: Group[] | null,
  ): Promise<void> {
    try {
      const data = GroupPostMapper.toPersistence(post)
      const existPost = await this.prismaService.groupPost.findUnique({
        where: { id: data.id },
      })
      if (existPost) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
          message: "Already exist this data",
        })
      }
      await this.prismaService.$transaction(async (prisma) => {
        await this.prismaService.groupPost.create({ data })
        if (taggedUserIds && taggedUserIds.length > 0) {
          const taggedUsersData = taggedUserIds.map((taggedUserId) => ({
            postId: post.id,
            taggedUserId,
          }))

          await prisma.postTaggedUser.createMany({ data: taggedUsersData })
        }
        if (taggedGroup && taggedGroup.length > 0) {
          await Promise.all(
            taggedGroup.map(async (e) => {
              await prisma.groupPost.createMany({
                data: {
                  ...data,
                  id: uuidv4(),
                  groupId: e.id,
                  tagByGroupPostId: post.id,
                },
              })
            }),
          )
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

  async findPostById(postId: string): Promise<GroupPost | null> {
    try {
      const post = await this.prismaService.groupPost.findUnique({
        where: { id: postId },
      })
      if (!post) {
        return null
      }
      const result = GroupPostMapper.toDomain(post)
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

  async updatePost(
    post: GroupPost,
    taggedUserIds?: string[] | null,
    taggedGroup?: Group[] | null,
  ): Promise<void> {
    try {
      let foundPost = await this.prismaService.groupPost.findUnique({
        where: { id: post.id },
      })
      if (!foundPost) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.NOT_FOUND,
          message: "Post not found",
        })
      }
      foundPost = GroupPostMapper.toPersistence(post)

      await this.prismaService.$transaction(async (prisma) => {
        await this.prismaService.groupPost.update({
          where: { id: post.id },
          data: foundPost,
        })
        if (taggedUserIds && taggedUserIds.length > 0) {
          const taggedUsersData = taggedUserIds.map((taggedUserId) => ({
            postId: post.id,
            groupId: post.groupId,
            taggedUserId,
          }))

          await prisma.groupPostTaggedUser.createMany({ data: taggedUsersData })
        }
        if (taggedGroup && taggedGroup.length > 0) {
          taggedGroup.map(async (e) => {
            await prisma.groupPost.createMany({
              data: {
                ...foundPost,
                groupId: e.id,
              },
            })
          })
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

  async deletePost(post: GroupPost): Promise<void> {
    try {
      const foundPost = await this.prismaService.groupPost.findUnique({
        where: { id: post.id },
      })
      if (!foundPost) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.NOT_FOUND,
          message: "Post not found",
        })
      }
      await this.prismaService.groupPost.update({
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
  async getGroupPosts(
    group: Group,
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
  ): Promise<GroupPost[]> {
    try {
      const posts = await this.prismaService.groupPost.findMany({
        where: { deletedAt: null, groupId: group.id },
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
      const queryPost = await this.prismaService.groupPost.findMany({
        where: { id: { in: ids } },
        ...(orderBy !== null ? { orderBy: { [orderBy]: order } } : {}),
      })
      if (!queryPost) {
        return []
      }
      const result = queryPost.map((e) => {
        const post = GroupPostMapper.toDomain(e)
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
  async addRequest(request: MemberRequest): Promise<void> {
    try {
      const existingRequest = await this.prismaService.memberRequest.findUnique(
        {
          where: {
            id: request.id,
          },
        },
      )
      if (existingRequest) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
          message: "Already exist this data",
        })
      }
      await this.prismaService.memberRequest.create({
        data: MemberRequestMapper.toPersistence(request),
      })
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }

  async findRequestById(requestId: string): Promise<MemberRequest | null> {
    try {
      const request = await this.prismaService.memberRequest.findUnique({
        where: { id: requestId },
      })
      return request ? MemberRequestMapper.toDomain(request) : null
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }

  async updateRequest(request: MemberRequest): Promise<void> {
    try {
      let foundRequest = await this.prismaService.memberRequest.findUnique({
        where: { id: request.id },
      })
      if (!foundRequest) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.NOT_FOUND,
          message: "Request not found",
        })
      }
      foundRequest = MemberRequestMapper.toPersistence(request)
      const updatedRequest = await this.prismaService.memberRequest.update({
        where: { id: request.id },
        data: foundRequest,
      })
      if (!updatedRequest) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.BAD_REQUEST,
          message: "Update operation not work",
        })
      }
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }

  async deleteRequest(request: MemberRequest): Promise<void> {
    try {
      const foundRequest = await this.prismaService.memberRequest.findUnique({
        where: { id: request.id },
      })
      if (!foundRequest) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.NOT_FOUND,
          message: "Request not found",
        })
      }
      await this.prismaService.memberRequest.delete({
        where: { id: request.id },
      })
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }
  async getGroupMemberRequest(
    group: Group,
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
  ): Promise<MemberRequest[]> {
    try {
      const requests = await this.prismaService.memberRequest.findMany({
        where: { groupId: group.id },
        ...(offset !== null ? { skip: offset } : {}),
        ...(limit !== null ? { take: limit } : {}),
        select: {
          id: true,
        },
      })
      if (!requests) {
        return []
      }
      const ids = requests.map((e) => e.id)
      const queryRequests = await this.prismaService.memberRequest.findMany({
        where: { id: { in: ids } },
        ...(orderBy !== null ? { orderBy: { [orderBy]: order } } : {}),
      })
      if (!queryRequests) {
        return []
      }
      const result = queryRequests.map((e) => {
        const request = MemberRequestMapper.toDomain(e)
        return request
      })
      return result ?? []
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }
  async getLatestMemberRequest(
    group: Group,
    userId: string,
  ): Promise<MemberRequest> {
    try {
      const memberRequest = await this.prismaService.memberRequest.findFirst({
        where: { userId: userId, groupId: group.id },
        orderBy: { requestedAt: "desc" },
      })

      if (!memberRequest) return null
      return MemberRequestMapper.toDomain(memberRequest) ?? null
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }
  async addMember(member: GroupMember): Promise<void> {
    try {
      const data = GroupMemberMapper.toPersistence(member)
      const existMember = await this.prismaService.groupMember.findUnique({
        where: {
          groupId_memberId: {
            groupId: member.groupId,
            memberId: member.memberId,
          },
        },
      })
      if (existMember) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
          message: "Already exist this data",
        })
      }
      await this.prismaService.groupMember.create({ data })
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }

  async findMemberById(
    groupId: string,
    memberId: string,
  ): Promise<GroupMember | null> {
    try {
      const member = await this.prismaService.groupMember.findUnique({
        where: { groupId_memberId: { groupId, memberId } },
      })
      return member ? GroupMemberMapper.toDomain(member) : null
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }

  async updateMember(member: GroupMember): Promise<void> {
    try {
      let foundMember = await this.prismaService.groupMember.findUnique({
        where: {
          groupId_memberId: {
            groupId: member.groupId,
            memberId: member.memberId,
          },
        },
      })
      if (!foundMember) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.NOT_FOUND,
          message: "Member not found",
        })
      }
      foundMember = GroupMemberMapper.toPersistence(member)
      const updatedMember = await this.prismaService.groupMember.update({
        where: {
          groupId_memberId: {
            groupId: member.groupId,
            memberId: member.memberId,
          },
        },
        data: foundMember,
      })
      if (!updatedMember) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.BAD_REQUEST,
          message: "Update operation not work",
        })
      }
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }

  async deleteMember(member: GroupMember): Promise<void> {
    try {
      const foundMember = await this.prismaService.groupMember.findUnique({
        where: {
          groupId_memberId: {
            groupId: member.groupId,
            memberId: member.memberId,
          },
        },
      })
      if (!foundMember) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.NOT_FOUND,
          message: "Member not found",
        })
      }
      await this.prismaService.groupMember.update({
        where: {
          groupId_memberId: {
            groupId: member.groupId,
            memberId: member.memberId,
          },
        },
        data: { deletedAt: new Date() },
      })
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }

  async getGroupMembers(
    group: Group,
    {
      limit = 10,
      offset = 0,
      orderBy = "createdAt",
      order = "asc" as "asc" | "desc",
    },
  ): Promise<GroupMember[]> {
    try {
      const members = await this.prismaService.groupMember.findMany({
        where: { groupId: group.id, deletedAt: null },
        ...(offset !== null ? { skip: offset } : {}),
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy: { [orderBy]: order } } : {}),
      })
      if (!members) {
        return []
      }

      const result = members.map((e) => {
        const member = GroupMemberMapper.toDomain(e)
        return member
      })
      return result ?? []
      return members.map(GroupMemberMapper.toDomain)
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }
  async addInviteLink(inviteLink: GroupInviteLink): Promise<void> {
    try {
      const data = GroupInviteLinkMapper.toPersistence(inviteLink)
      const existingLink = await this.prismaService.groupInviteLink.findUnique({
        where: { link: inviteLink.link },
      })
      if (existingLink) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
          message: "Link already exists",
        })
      }
      await this.prismaService.groupInviteLink.create({ data })
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }

  async findInviteLinkById(linkId: string): Promise<GroupInviteLink | null> {
    try {
      const link = await this.prismaService.groupInviteLink.findUnique({
        where: { id: linkId },
      })
      return link ? GroupInviteLinkMapper.toDomain(link) : null
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }

  async updateInviteLink(inviteLink: GroupInviteLink): Promise<void> {
    try {
      const data = GroupInviteLinkMapper.toPersistence(inviteLink)
      const foundLink = await this.prismaService.groupInviteLink.findUnique({
        where: { id: inviteLink.id },
      })
      if (!foundLink) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.NOT_FOUND,
          message: "Invite link not found",
        })
      }
      const updatedLink = await this.prismaService.groupInviteLink.update({
        where: { id: inviteLink.id },
        data: data,
      })
      if (!updatedLink) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.BAD_REQUEST,
          message: "Update operation not work",
        })
      }
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }

  async addRule(rule: GroupRule): Promise<void> {
    try {
      const data = GroupRuleMapper.toPersistence(rule)
      const existData = await this.prismaService.groupRule.findUnique({
        where: { id: data.id },
      })
      if (existData) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
          message: "Already exist this data",
        })
      }
      await this.prismaService.groupRule.create({ data })
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }

  async findRuleById(ruleId: string): Promise<GroupRule | null> {
    try {
      const rule = await this.prismaService.groupRule.findUnique({
        where: { id: ruleId },
      })
      return rule ? GroupRuleMapper.toDomain(rule) : null
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }

  async updateRule(rule: GroupRule): Promise<void> {
    try {
      const existingRule = await this.prismaService.groupRule.findUnique({
        where: { id: rule.id },
      })
      if (!existingRule) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.NOT_FOUND,
          message: "Rule not found",
        })
      }
      const data = GroupRuleMapper.toPersistence(rule)
      const updatedRule = await this.prismaService.groupRule.update({
        where: { id: rule.id },
        data,
      })
      if (!updatedRule) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.BAD_REQUEST,
          message: "Update operation not work",
        })
      }
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }

  async deleteRule(rule: GroupRule): Promise<void> {
    try {
      const existingRule = await this.prismaService.groupRule.findUnique({
        where: { id: rule.id },
      })
      if (!existingRule) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.NOT_FOUND,
          message: "Rule not found",
        })
      }
      await this.prismaService.groupRule.update({
        where: { id: rule.id },
        data: { deletedAt: new Date() },
      })
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }

  async getGroupRules(
    group: Group,
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
  ): Promise<GroupRule[]> {
    try {
      const rules = await this.prismaService.groupRule.findMany({
        where: { deletedAt: null, groupId: group.id },
        ...(offset !== null ? { skip: offset } : {}),
        ...(limit !== null ? { take: limit } : {}),
        select: {
          id: true,
        },
      })
      if (!rules) {
        return []
      }
      const ids = rules.map((e) => e.id)
      const queryRule = await this.prismaService.groupRule.findMany({
        where: { id: { in: ids } },
        ...(orderBy !== null ? { orderBy: { [orderBy]: order } } : {}),
      })
      if (!queryRule) {
        return []
      }
      const result = queryRule.map((e) => {
        const rule = GroupRuleMapper.toDomain(e)
        return rule
      })
      return result ?? []
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }
  async addInvitation(invitation: GroupInvitation): Promise<void> {
    try {
      const existData = await this.prismaService.groupInvitation.findUnique({
        where: { id: invitation.id },
      })
      if (existData) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
          message: "Already exist this data",
        })
      }
      await this.prismaService.groupInvitation.create({
        data: GroupInvitationMapper.toPersistence(invitation),
      })
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }
  async getInvitationById(id: string): Promise<GroupInvitation | null> {
    try {
      const invitation = await this.prismaService.groupInvitation.findUnique({
        where: { id },
      })
      return invitation ? GroupInvitationMapper.toDomain(invitation) : null
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }
  async getGroupInvitation(
    group: Group,
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
  ): Promise<GroupInvitation[]> {
    try {
      const invitations = await this.prismaService.groupInvitation.findMany({
        where: { deletedAt: null, groupId: group.id },
        ...(offset !== null ? { skip: offset } : {}),
        ...(limit !== null ? { take: limit } : {}),
        select: {
          id: true,
        },
      })
      if (!invitations) {
        return []
      }
      const ids = invitations.map((e) => e.id)
      const queryInvitation = await this.prismaService.groupInvitation.findMany(
        {
          where: { id: { in: ids } },
          orderBy: { [orderBy]: order },
        },
      )
      if (!queryInvitation) {
        return []
      }
      const result = queryInvitation.map((e) => {
        return GroupInvitationMapper.toDomain(e)
      })
      return result ?? []
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }
  async getLatestInvitationByUserAndGroup(
    userId: string,
    groupId: string,
  ): Promise<GroupInvitation | null> {
    try {
      const invitation = await this.prismaService.groupInvitation.findFirst({
        where: { invitedUserId: userId, groupId },
        orderBy: { createdAt: "desc" },
      })
      if (!invitation) {
        return null
      }
      return GroupInvitationMapper.toDomain(invitation)
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }
  async updateInvitation(invitation: GroupInvitation): Promise<void> {
    try {
      const existingInvitation =
        await this.prismaService.groupInvitation.findUnique({
          where: { id: invitation.id },
        })
      if (!existingInvitation) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.NOT_FOUND,
          message: "Invitation not found",
        })
      }
      const data = GroupInvitationMapper.toPersistence(invitation)
      const updatedInvitation = await this.prismaService.groupInvitation.update(
        {
          where: { id: invitation.id },
          data,
        },
      )
      if (!updatedInvitation) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.BAD_REQUEST,
          message: "Update operation not work",
        })
      }
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }
  async findDuePosts(currentTime: Date): Promise<ScheduledGroupPost[]> {
    try {
      const scheduledPost =
        await this.prismaService.scheduledGroupPost.findMany({
          where: {
            scheduledAt: {
              lte: currentTime,
            },
          },
        })
      if (!scheduledPost) {
        return []
      }
      return scheduledPost.map((e) => ScheduledPostMapper.toDomain(e))
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }
  async createScheduledPost(schedulePost: ScheduledGroupPost): Promise<void> {
    try {
      const data = ScheduledPostMapper.toPersistence(schedulePost)
      await this.prismaService.scheduledGroupPost.create({
        data,
      })
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }
  async deleteScheduledPost(data: ScheduledGroupPost): Promise<void> {
    try {
      console.log(data.id)
      await this.prismaService.scheduledGroupPost.delete({
        where: {
          id: data.id,
        },
      })
    } catch (error) {
      this.handleDatabaseError(error)
    }
  }
  private handleDatabaseError(error: any) {
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
