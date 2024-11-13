import { ApiProperty } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { PostResponseDto } from "./common/post.response.dto"

export class GetUserFeedResponseDto {
  @ApiProperty({
    type: [PostResponseDto],
    description:
      "List of user posts, each with user details and post information",
  })
  @Expose()
  @Type(() => PostResponseDto)
  posts: PostResponseDto[]
}
