import { ApiProperty } from "@nestjs/swagger";
import { PostResponseDto } from "./common/post.response.dto";

export class GetPendingPostsResponseDto {
  @ApiProperty({
    description: "List of posts in the group",
    type: [PostResponseDto],
    nullable: true,
    example: [
      {
        id: "1",
        content: "Welcome to the group!",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        content: "Latest updates on tech.",
        createdAt: new Date().toISOString(),
      },
    ],
  })
  posts?: PostResponseDto[] | null
}
