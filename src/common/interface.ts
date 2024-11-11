import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsBoolean, IsOptional } from "class-validator"
import { JwtPayload } from "jsonwebtoken"
import { tokenType } from "libs/constants/enum"
import { EUserStatus } from "src/module/users/domain/enum/user-status.enum"

export class UserFilters {
  @ApiPropertyOptional({
    description: "Whether the user is live or not",
    example: true,
    nullable: true,
  })
  @IsOptional()
  @IsBoolean()
  isLive?: boolean | null
  @ApiPropertyOptional({
    description: "Whether the user is active or not",
    example: true,
    nullable: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean | null
}
export interface TokenPayload extends JwtPayload {
  sub?: string
  email?: string
  username?: string
  deviceId?: string
  userAgent?: string
  role?: string[]
  permission?: string[]
  tokenType: tokenType
  status?: EUserStatus
}
