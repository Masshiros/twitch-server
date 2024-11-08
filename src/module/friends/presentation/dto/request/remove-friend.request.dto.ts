import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class RemoveFriendRequestDto {
  @ApiProperty({
    description: "The unique identifier of friend you want to remove",
    example: "e5b1c6d0-a7b6-4f7e-8fa7-923f8bcdb8c7",
  })
  @IsNotEmpty()
  @IsString()
  friendId: string
}
