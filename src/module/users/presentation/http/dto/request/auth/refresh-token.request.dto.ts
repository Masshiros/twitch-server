import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class RefreshTokenRequestDto {
  @ApiProperty({
    description: "The refresh token provided to the user during login",
    example: "some-refresh-token",
  })
  @IsString()
  @IsNotEmpty()
  readonly refreshToken: string
}
