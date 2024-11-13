import { ApiProperty } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { PostInfoResponseDto } from "./post-info.response.dto"
import { UserResponseDto } from "./user.response.dto"

export class PostResponseDto {
  @ApiProperty({ type: UserResponseDto, description: "User details" })
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto

  @ApiProperty({ type: PostInfoResponseDto, description: "Post information" })
  @Expose()
  @Type(() => PostInfoResponseDto)
  info: PostInfoResponseDto
}
