import { ApiProperty } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { PostInfoResponseDto } from "./common/post-info.response.dto"
import { UserResponseDto } from "./common/user.response.dto"

export class SearchPostsResponseDto {
  @ApiProperty({ type: UserResponseDto, description: "User details" })
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto

  @ApiProperty({ type: [PostInfoResponseDto], description: "List of posts" })
  @Expose()
  @Type(() => PostInfoResponseDto)
  info: PostInfoResponseDto[]
}
