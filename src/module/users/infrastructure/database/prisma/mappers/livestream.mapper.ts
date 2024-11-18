import { Livestream as PrismaLivestream } from "@prisma/client"
import { Livestream } from "src/module/users/domain/entity/livestream.entity"

export class LivestreamMapper {
  /**
   * Converts a Prisma Livestream object to a domain Livestream entity.
   */
  static toDomain(prismaLivestream: PrismaLivestream): Livestream {
    return new Livestream(
      {
        userId: prismaLivestream.userId,
        slug: prismaLivestream.slug || undefined,
        totalView: prismaLivestream.totalView,
        isChatEnabled: prismaLivestream.isChatEnabled,
        isChatDelayed: prismaLivestream.isChatDelayed,
        delayedSeconds: prismaLivestream.delayedSeconds || undefined,
        isChatFollowersOnly: prismaLivestream.isChatFollowersOnly,
        ingressId: prismaLivestream.ingressId,
        createdAt: prismaLivestream.createdAt,
        updatedAt: prismaLivestream.updatedAt,
        deletedAt: prismaLivestream.deletedAt,
      },
      prismaLivestream.id,
    )
  }

  /**
   * Converts a domain Livestream entity to a Prisma Livestream object.
   */
  static toPersistence(domainLivestream: Livestream): PrismaLivestream {
    return {
      id: domainLivestream.id,
      userId: domainLivestream.userId,
      slug: domainLivestream.slug || null,
      totalView: domainLivestream.totalView || 0,
      isChatEnabled: domainLivestream.isChatEnabled || false,
      isChatDelayed: domainLivestream.isChatDelayed || false,
      delayedSeconds: domainLivestream.delayedSeconds || null,
      isChatFollowersOnly: domainLivestream.isChatFollowersOnly || false,
      ingressId: domainLivestream.ingressId,
      createdAt: domainLivestream.createdAt || new Date(),
      updatedAt: domainLivestream.updatedAt || new Date(),
      deletedAt: domainLivestream.deletedAt || null,
    }
  }
}
