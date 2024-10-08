import { Expose } from "class-transformer"

export class GetLoginHistoryResponseDto {
  @Expose()
  id: string
  @Expose()
  deviceId: string
  @Expose()
  loginAt: Date
  @Expose()
  loginStatus: boolean
  @Expose()
  reason?: string
}
