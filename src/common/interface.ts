import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsBoolean, IsOptional, IsString } from "class-validator"
import { JwtPayload } from "jsonwebtoken"
import { tokenType } from "libs/constants/enum"

export class UserFilters {
  @ApiPropertyOptional({
    description: "The ID of the category to filter users by",
    example: "category123",
  })
  @IsString()
  @IsOptional()
  categoryId?: string

  @ApiPropertyOptional({
    description: "Whether the user is active or not",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean
}
export interface TokenPayload extends JwtPayload {
  sub: string
  email: string
  username: string
  deviceId: string
  tokenType: tokenType
}
