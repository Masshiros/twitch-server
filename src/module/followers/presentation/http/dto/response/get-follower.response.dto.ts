import { Expose, Type } from "class-transformer"

export class ImageResponseDto {
  @Expose()
  url: string

  @Expose()
  publicId: string
}
export class GetFollowerResponseDto {
  @Expose()
  id: string
  @Expose()
  name: string
  @Expose()
  displayName: string
  @Expose()
  slug: string
  @Expose()
  @Type(() => ImageResponseDto)
  avatar: ImageResponseDto
  @Expose()
  isLive: boolean
  @Expose()
  followDate: Date
}
