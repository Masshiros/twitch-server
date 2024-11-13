import { ApiProperty } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { ImageResponseDto } from "./image.response.dto"
import { UserResponseDto } from "./user.response.dto"

export class PostResponseDto {
  @ApiProperty({
    type: [UserResponseDto],
    description: "User that own this post",
  })
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto
  @ApiProperty({ description: "Post creation date", type: String })
  @Expose()
  createdAt: string

  @ApiProperty({ description: "Post content" })
  @Expose()
  content: string

  @ApiProperty({
    type: [ImageResponseDto],
    description: "List of images associated with the post",
  })
  @Expose()
  @Type(() => ImageResponseDto)
  images: ImageResponseDto[]

  @ApiProperty({ description: "Indicates if the post is shared by the user" })
  @Expose()
  isShared: boolean

  @ApiProperty({ description: "Indicates if the user is tagged in this post" })
  @Expose()
  isTagged: boolean
}
