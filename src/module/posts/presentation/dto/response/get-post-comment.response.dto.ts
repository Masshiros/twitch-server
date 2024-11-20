import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { UserResponseDto } from "./common/user.response.dto"

export class GetPostCommentResponseDto {
  @ApiProperty({
    type: () => UserResponseDto,
    description: "User details who made the comment",
  })
  @Type(() => UserResponseDto)
  user: UserResponseDto

  @ApiProperty({
    example: "This is a great post!",
    description: "The content of the comment",
  })
  comment: string

  @ApiPropertyOptional({
    type: () => [GetPostCommentResponseDto],
    description: "List of replies to this comment",
    isArray: true,
  })
  @Type(() => GetPostCommentResponseDto)
  replies: GetPostCommentResponseDto[]
}
