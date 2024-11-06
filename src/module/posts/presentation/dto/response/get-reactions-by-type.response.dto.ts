import { ApiProperty } from "@nestjs/swagger"
import { EReactionType } from "libs/constants/enum"
import { ReactionUserDto } from "./get-all-reactions.response.dto"

export class GetReactionsByTypeResponseDto {
  reactionType: EReactionType
  @ApiProperty({ description: "Total count of reactions on the post" })
  reactionCount: number

  @ApiProperty({
    description: "List of users with their reactions",
    type: [ReactionUserDto],
  })
  users: ReactionUserDto[]
}
