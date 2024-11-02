import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"
import { EReactionType } from "libs/constants/enum"

export class ReactToPostRequestDto {
  @ApiProperty({
    description: "The unique identifier of post",
    example: "e5b1c6d0-a7b6-4f7e-8fa7-923f8bcdb8c7",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  postId: string
  @ApiProperty({
    description: "Reaction type",
    enum: EReactionType,
    example: EReactionType.LIKE,
  })
  reactionType: EReactionType
}
