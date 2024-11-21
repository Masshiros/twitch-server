import { GroupInvitation } from "../entity/group-invitations.entity"
import { GroupInviteLink } from "../entity/group-invite-links.entity"
import { GroupMember } from "../entity/group-members.entity"
import { GroupPost } from "../entity/group-posts.entity"
import { GroupRule } from "../entity/group-rule.entity"
import { Group } from "../entity/groups.entity"
import { MemberRequest } from "../entity/member-requests.entity"
import { ScheduledGroupPost } from "../entity/scheduled-posts.entity"

export abstract class IGroupRepository {
  // groups
  addGroup: (group: Group) => Promise<void>
  findGroupById: (groupId: string) => Promise<Group | null>
  updateGroup: (group: Group) => Promise<void>
  deleteGroup: (group: Group) => Promise<void>
  getAllUserGroups: (
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
  ) => Promise<Group[]>
  getCommonGroupBetweenUsers: (
    userId1: string,
    userId2: string,
  ) => Promise<Group[]>
  // group -posts
  addPost: (
    post: GroupPost,
    taggedUserIds?: string[] | null,
    taggedGroup?: Group[] | null,
  ) => Promise<void>
  findPostById: (postId: string) => Promise<GroupPost | null>
  updatePost: (
    post: GroupPost,
    taggedUserIds?: string[] | null,
    taggedGroup?: Group[] | null,
  ) => Promise<void>
  deletePost: (post: GroupPost) => Promise<void>
  getGroupPosts: (
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
  ) => Promise<GroupPost[]>

  // group request member
  addRequest: (request: MemberRequest) => Promise<void>
  findRequestById: (requestId: string) => Promise<MemberRequest | null>
  updateRequest: (request: MemberRequest) => Promise<void>
  deleteRequest: (request: MemberRequest) => Promise<void>
  getGroupMemberRequest: (
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
  ) => Promise<MemberRequest[]>
  getLatestMemberRequest: (
    group: Group,
    userId: string,
  ) => Promise<MemberRequest>
  // group member
  addMember: (member: GroupMember) => Promise<void>
  findMemberById: (
    groupId: string,
    memberId: string,
  ) => Promise<GroupMember | null>
  updateMember: (member: GroupMember) => Promise<void>
  deleteMember: (member: GroupMember) => Promise<void>
  getGroupMembers: (
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
  ) => Promise<GroupMember[]>
  // group invite link
  addInviteLink: (inviteLink: GroupInviteLink) => Promise<void>
  findInviteLinkById: (linkId: string) => Promise<GroupInviteLink | null>
  updateInviteLink: (inviteLink: GroupInviteLink) => Promise<void>
  // group rule
  addRule: (rule: GroupRule) => Promise<void>
  findRuleById: (ruleId: string) => Promise<GroupRule | null>
  updateRule: (rule: GroupRule) => Promise<void>
  deleteRule: (rule: GroupRule) => Promise<void>
  getGroupRules: (
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
  ) => Promise<GroupRule[]>
  // invitation
  addInvitation: (invitation: GroupInvitation) => Promise<void>
  getInvitationById: (id: string) => Promise<GroupInvitation | null>
  getGroupInvitation: (
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
  ) => Promise<GroupInvitation[]>
  getLatestInvitationByUserAndGroup: (
    userId: string,
    groupId: string,
  ) => Promise<GroupInvitation | null>
  updateInvitation: (invitation: GroupInvitation) => Promise<void>
  // scheduled post
  findDuePosts: (currentTime: Date) => Promise<ScheduledGroupPost[]>
  deleteScheduledPost: (data: ScheduledGroupPost) => Promise<void>
  createScheduledPost: (schedulePost: ScheduledGroupPost) => Promise<void>
}
