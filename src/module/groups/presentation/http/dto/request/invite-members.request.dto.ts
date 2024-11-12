import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, IsString } from "class-validator"

export class InviteMembersRequestDto {
  @ApiProperty({
    description: "List of friend IDs to associate with the user",
    example: ["friendId1", "friendId2", "friend3Id"],
    isArray: true,
    type: String,
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  friendIds: string[]
}
