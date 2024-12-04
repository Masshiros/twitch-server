import { ApiProperty } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { ImageResponseDto } from "./image.response.dto"

export class PostInfoResponseDto {
  @ApiProperty({ description: " Post's id", type: String })
  @Expose()
  id: string
  @ApiProperty({ description: "Post creation date", type: String })
  @Expose()
  createdAt: Date

  @ApiProperty({ description: "Post visibility" })
  @Expose()
  visibility: string

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
