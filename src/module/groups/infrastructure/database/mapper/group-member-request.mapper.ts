import { MemberRequest as PrismaMemberRequest } from "@prisma/client"
import { MemberRequest } from "src/module/groups/domain/entity/member-requests.entity"
import { EGroupRequestStatus } from "src/module/groups/domain/enum/group-request-status.enum"

export class MemberRequestMapper {
  // Convert Prisma MemberRequest to Domain MemberRequest
  static toDomain(prismaMemberRequest: PrismaMemberRequest): MemberRequest {
    return new MemberRequest({
      id: prismaMemberRequest.id,
      groupId: prismaMemberRequest.groupId,
      userId: prismaMemberRequest.userId,
      status: prismaMemberRequest.status as EGroupRequestStatus,
      requestedAt: prismaMemberRequest.requestedAt,
      reviewedAt: prismaMemberRequest.reviewedAt || null,
      comment: prismaMemberRequest.comment || null,
    })
  }

  // Convert Domain MemberRequest to Prisma MemberRequest
  static toPersistence(
    domainMemberRequest: MemberRequest,
  ): PrismaMemberRequest {
    return {
      id: domainMemberRequest.id,
      groupId: domainMemberRequest.groupId,
      userId: domainMemberRequest.userId,
      status: domainMemberRequest.status,
      requestedAt: domainMemberRequest.requestedAt,
      reviewedAt: domainMemberRequest.reviewedAt,
      comment: domainMemberRequest.comment,
    }
  }
}
