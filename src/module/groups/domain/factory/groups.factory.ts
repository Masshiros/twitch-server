import { GroupInvitation } from "../entity/group-invitations.entity"
import { GroupInviteLink } from "../entity/group-invite-links.entity"
import { GroupMember } from "../entity/group-members.entity"
import { GroupPost } from "../entity/group-posts.entity"
import { GroupRule } from "../entity/group-rule.entity"
import { Group } from "../entity/groups.entity"
import { MemberRequest } from "../entity/member-requests.entity"
import { EInvitationStatus } from "../enum/group-invitation-status.enum"
import { EGroupPostStatus } from "../enum/group-post-status.enum"
import { EGroupPrivacy } from "../enum/group-privacy.enum"
import { EGroupRequestStatus } from "../enum/group-request-status.enum"
import { EGroupRole } from "../enum/group-role.enum"
import { EGroupVisibility } from "../enum/group-visibility.enum"

interface GroupPostCreationsProps {
  groupId: string
  userId: string
  content: string
  totalViewCount?: number
  status?: EGroupPostStatus
}
interface GroupCreationsProps {
  ownerId: string
  name: string
  description?: string
  visibility: EGroupVisibility
  privacy?: EGroupPrivacy
}
interface GroupInviteLinkCreationsProps {
  groupId: string
  link: string
  expiresAt: Date
  maxUses: number
  currentUses?: number
}
interface MemberRequestCreationsProps {
  groupId: string
  userId: string
  status: EGroupRequestStatus
  reviewedAt?: Date
  comment?: string
}
interface GroupMemberCreationsProps {
  groupId: string
  memberId: string
  joinedAt?: Date
  role: EGroupRole
}
interface GroupRuleCreationsProps {
  groupId: string
  content: string
  title: string
}
interface GroupInvitationCreationsProps {
  groupId: string
  invitedUserId: string
  inviterId: string
  status: EInvitationStatus
  expiredAt: Date
}
export class GroupFactory {
  static createGroupPost(props: GroupPostCreationsProps): GroupPost {
    return new GroupPost({
      groupId: props.groupId,
      userId: props.userId,
      content: props.content,
      totalViewCount: props.totalViewCount ?? 0,
      status: props.status ?? EGroupPostStatus.PENDING,
      createdAt: new Date(),
    })
  }
  static createGroup(props: GroupCreationsProps): Group {
    return new Group({
      ownerId: props.ownerId,
      name: props.name,
      description: props.description,
      visibility: props.visibility,
      privacy: props.privacy,
      createdAt: new Date(),
    })
  }
  static createGroupInviteLink(
    props: GroupInviteLinkCreationsProps,
  ): GroupInviteLink {
    return new GroupInviteLink({
      groupId: props.groupId,
      link: props.link,
      expiresAt: props.expiresAt,
      maxUses: props.maxUses ?? 20,
      currentUses: props.currentUses,
      createdAt: new Date(),
    })
  }
  static createMemberRequest(props: MemberRequestCreationsProps) {
    return new MemberRequest({
      groupId: props.groupId,
      comment: props.comment,
      userId: props.userId,
      status: props.status ?? EGroupRequestStatus.PENDING,
      requestedAt: new Date(),
      reviewedAt: props.reviewedAt,
    })
  }
  static createGroupMember(props: GroupMemberCreationsProps): GroupMember {
    return new GroupMember({
      groupId: props.groupId,
      memberId: props.memberId,
      joinedAt: props.joinedAt,
      role: props.role,
      createdAt: new Date(),
    })
  }
  static createGroupRule(props: GroupRuleCreationsProps): GroupRule {
    return new GroupRule({
      title: props.title,
      groupId: props.groupId,
      content: props.content,
      createdAt: new Date(),
    })
  }
  static createGroupInvitation(
    props: GroupInvitationCreationsProps,
  ): GroupInvitation {
    return new GroupInvitation({
      groupId: props.groupId,
      invitedUserId: props.invitedUserId,
      inviterId: props.inviterId,
      status: props.status,
      expiredAt: props.expiredAt,
      createdAt: new Date(),
    })
  }
}
