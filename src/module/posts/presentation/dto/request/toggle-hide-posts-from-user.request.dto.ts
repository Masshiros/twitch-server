import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class ToggleHidePostsFromUserRequestDto {
  @ApiProperty({
    description: "The unique identifier of user whose posts need to be hidden",
    example: "e5b1c6d0-a7b6-4f7e-8fa7-923f8bcdb8c7",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  hiddenUserId: string
}
