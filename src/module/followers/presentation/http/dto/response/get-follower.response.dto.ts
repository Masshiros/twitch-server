import { Expose } from "class-transformer"

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
  avatar: string
  @Expose()
  isLive: boolean
  @Expose()
  followDate: Date
}
