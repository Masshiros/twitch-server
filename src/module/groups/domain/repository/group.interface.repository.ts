import { GroupInviteLink } from "../entity/group-invite-links.entity"
import { GroupMember } from "../entity/group-members.entity"
import { GroupPost } from "../entity/group-posts.entity"
import { GroupRule } from "../entity/group-rule.entity"
import { Group } from "../entity/groups.entity"
import { MemberRequest } from "../entity/member-requests.entity"

export abstract class IGroupRepository {
  // groups
  addGroup: (group: Group) => Promise<void>
  findGroupById: (groupId: string) => Promise<Group | null>
  updateGroup: (group: Group) => Promise<void>
  deleteGroup: (group: Group) => Promise<void>
  // group -posts
  addPost: (post: GroupPost) => Promise<void>
  findPostById: (postId: string) => Promise<GroupPost | null>
  updatePost: (post: GroupPost) => Promise<void>
  deletePost: (post: GroupPost) => Promise<void>
  // group request member
  addRequest: (request: MemberRequest) => Promise<void>
  findRequestById: (requestId: string) => Promise<MemberRequest | null>
  updateRequest: (request: MemberRequest) => Promise<void>
  deleteRequest: (request: MemberRequest) => Promise<void>
  // group member
  addMember: (member: GroupMember) => Promise<void>
  findMemberById: (
    groupId: string,
    memberId: string,
  ) => Promise<GroupMember | null>
  updateMember: (member: GroupMember) => Promise<void>
  deleteMember: (member: GroupMember) => Promise<void>
  // group invite link
  addInviteLink: (inviteLink: GroupInviteLink) => Promise<void>
  findInviteLinkById: (linkId: string) => Promise<GroupInviteLink | null>
  updateInviteLink: (inviteLink: GroupInviteLink) => Promise<void>
  // group rule
  addRule: (rule: GroupRule) => Promise<void>
  findRuleById: (ruleId: string) => Promise<GroupRule | null>
  updateRule: (rule: GroupRule) => Promise<void>
  deleteRule: (rule: GroupRule) => Promise<void>
}
