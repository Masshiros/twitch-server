import { Expose, Type } from "class-transformer"
import { EUserStatus } from "src/module/users/domain/enum/user-status.enum"

export class ImageResponseDto {
  @Expose()
  url: string

  @Expose()
  publicId: string
}
export class GetUserResponseDto {
  @Expose()
  id: string
  @Expose()
  email: string
  @Expose()
  phone: string
  @Expose()
  username: string

  @Expose()
  displayName: string

  @Expose()
  @Type(() => ImageResponseDto)
  image?: ImageResponseDto
  @Expose()
  allowedChangedUsername?: boolean
  @Expose()
  changedUsernameDaysLeft?: number
  @Expose()
  numberOfFollowers?: number
  @Expose()
  numberOfFollowings?: number
  @Expose()
  bio?: string

  @Expose()
  thumbnail?: string
  @Expose()
  categoryNames?: string[]

  @Expose()
  isLive: boolean
  @Expose()
  createdAt: Date
  @Expose()
  deletedAt: Date
  @Expose()
  roles: string[]
  @Expose()
  status: EUserStatus
}
