import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class IsValidUserNameRequestDto {
  @ApiProperty({ description: "user name of user" })
  @IsNotEmpty()
  @IsString()
  username: string
}
