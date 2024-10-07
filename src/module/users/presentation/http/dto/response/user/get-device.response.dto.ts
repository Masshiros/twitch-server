import { Expose } from "class-transformer"

export class GetDeviceResponseDto {
  @Expose()
  id: string
  @Expose()
  userId: string
  @Expose()
  type: string
  @Expose()
  name: string
  @Expose()
  lastUsed: Date
  @Expose()
  userAgent: string
  @Expose()
  ipAddress: string
}
