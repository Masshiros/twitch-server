import { Expose } from "class-transformer"

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
  avatar?: string

  @Expose()
  bio?: string

  @Expose()
  thumbnail?: string

  @Expose()
  isLive: boolean
}
