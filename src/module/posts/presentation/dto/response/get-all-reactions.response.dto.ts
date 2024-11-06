import { ApiProperty } from "@nestjs/swagger"
import { EReactionType } from "@prisma/client"

export class ReactionUserDto {
  @ApiProperty({ description: "ID of the user" })
  id: string

  @ApiProperty({ description: "Username of the user" })
  username: string

  @ApiProperty({ description: "Avatar URL of the user", required: false })
  avatar?: string

  @ApiProperty({
    description: "Type of reaction by the user",
    enum: EReactionType,
  })
  reactionType: EReactionType
}

export class GetAllReactionsResponseDto {
  @ApiProperty({ description: "Total count of reactions on the post" })
  reactionCount: number

  @ApiProperty({
    description: "List of users with their reactions",
    type: [ReactionUserDto],
  })
  users: ReactionUserDto[]
}
