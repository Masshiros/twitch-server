import { ApiProperty } from "@nestjs/swagger"
import { Expose } from "class-transformer"

export class UserResponseDto {
  @ApiProperty({ description: "User ID" })
  @Expose()
  id: string

  @ApiProperty({ description: "Username" })
  @Expose()
  username: string

  @ApiProperty({ description: "Avatar URL of the user" })
  @Expose()
  avatar: string
}
