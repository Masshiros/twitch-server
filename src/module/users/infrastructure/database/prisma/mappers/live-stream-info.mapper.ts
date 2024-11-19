// src/module/livestream/infrastructure/mapper/livestreamInfo.mapper.ts
import { type LiveStreamInfo as PrismaLiveStreamInfo } from "@prisma/client"
import { LiveStreamInfo } from "src/module/users/domain/entity/live-stream-info.entity"

export class LiveStreamInfoMapper {
  static toDomain(prismaLiveStreamInfo: PrismaLiveStreamInfo): LiveStreamInfo {
    return new LiveStreamInfo({
      id: prismaLiveStreamInfo.id,
      userId: prismaLiveStreamInfo.userId,
      userName: prismaLiveStreamInfo.userName,
      userImage: prismaLiveStreamInfo.userImage,
      userSlug: prismaLiveStreamInfo.userSlug,
      title: prismaLiveStreamInfo.title,
      isLive: prismaLiveStreamInfo.isLive,
      thumbnailPreviewImage: prismaLiveStreamInfo.thumbnailPreviewImage,
      themeColor: prismaLiveStreamInfo.themeColor,
    })
  }

  static toPersistence(liveStreamInfo: LiveStreamInfo): PrismaLiveStreamInfo {
    return {
      id: liveStreamInfo.id,
      userId: liveStreamInfo.userId,
      userName: liveStreamInfo.userName,
      userImage: liveStreamInfo.userImage,
      userSlug: liveStreamInfo.userSlug,
      title: liveStreamInfo.title,
      isLive: liveStreamInfo.isLive,
      thumbnailPreviewImage: liveStreamInfo.thumbnailPreviewImage,
      themeColor: liveStreamInfo.themeColor,
    }
  }
}
