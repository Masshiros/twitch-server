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
        categoryId: prismaLivestream.categoryId || undefined,
        tagId: prismaLivestream.tagId || undefined,
        tagName: prismaLivestream.tagName || undefined,
        tagSlug: prismaLivestream.tagSlug || undefined,
        userName: prismaLivestream.userName || undefined,
        userImage: prismaLivestream.userImage || undefined,
        userSlug: prismaLivestream.userSlug || undefined,
        title: prismaLivestream.title || undefined,
        slug: prismaLivestream.slug || undefined,
        totalView: prismaLivestream.totalView,
        isLive: prismaLivestream.isLive,
        isChatEnabled: prismaLivestream.isChatEnabled,
        isChatDelayed: prismaLivestream.isChatDelayed,
        delayedSeconds: prismaLivestream.delayedSeconds || undefined,
        isChatFollowersOnly: prismaLivestream.isChatFollowersOnly,
        thumbnailPreviewImage:
          prismaLivestream.thumbnailPreviewImage || undefined,
        themeColor: prismaLivestream.themeColor || undefined,
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
      categoryId: domainLivestream.categoryId || null,
      tagId: domainLivestream.tagId || null,
      tagName: domainLivestream.tagName || null,
      tagSlug: domainLivestream.tagSlug || null,
      userName: domainLivestream.userName || null,
      userImage: domainLivestream.userImage || null,
      userSlug: domainLivestream.userSlug || null,
      title: domainLivestream.title || null,
      slug: domainLivestream.slug || null,
      totalView: domainLivestream.totalView || 0,
      isLive: domainLivestream.isLive || false,
      isChatEnabled: domainLivestream.isChatEnabled || false,
      isChatDelayed: domainLivestream.isChatDelayed || false,
      delayedSeconds: domainLivestream.delayedSeconds || null,
      isChatFollowersOnly: domainLivestream.isChatFollowersOnly || false,
      thumbnailPreviewImage: domainLivestream.thumbnailPreviewImage || null,
      themeColor: domainLivestream.themeColor || null,
      createdAt: domainLivestream.createdAt || new Date(),
      updatedAt: domainLivestream.updatedAt || new Date(),
      deletedAt: domainLivestream.deletedAt || null,
    }
  }
}
