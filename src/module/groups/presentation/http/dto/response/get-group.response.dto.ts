import { ApiProperty } from "@nestjs/swagger"
import { EGroupPrivacy } from "src/module/groups/domain/enum/group-privacy.enum"
import { EGroupVisibility } from "src/module/groups/domain/enum/group-visibility.enum"
import { PostResponseDto } from "./common/post.response.dto"
import { RuleResponseDto } from "./common/rule.response.dto"

export class GetGroupResponseDto {
  @ApiProperty({
    description: "Unique identifier of the group",
    example: "e5b1c6d0-a7b6-4f7e-8fa7-923f8bcdb8c7",
  })
  id: string

  @ApiProperty({
    description: "Name of the group",
    example: "Tech Enthusiasts",
  })
  name: string

  @ApiProperty({
    description: "Description of the group",
    example:
      "A group for technology enthusiasts to share and discuss the latest in tech.",
    nullable: true,
  })
  description?: string | null

  @ApiProperty({
    description: "URL of the cover image for the group",
    example: "https://example.com/path/to/cover-image.jpg",
    nullable: true,
  })
  coverImage?: string

  @ApiProperty({
    description: "Privacy level of the group",
    example: EGroupPrivacy.VISIBLE,
    enum: EGroupPrivacy,
  })
  privacy: EGroupPrivacy

  @ApiProperty({
    description: "Visibility level of the group",
    example: EGroupVisibility.PRIVATE,
    enum: EGroupVisibility,
  })
  visibility: EGroupVisibility

  @ApiProperty({
    description: "Indicates if the current user is an admin of the group",
    example: true,
  })
  isAdmin: boolean

  @ApiProperty({
    description: "Indicates if the current user is a member of the group",
    example: false,
  })
  isMember: boolean

  @ApiProperty({
    description: "List of group rules",
    type: [RuleResponseDto],
    nullable: true,
    example: [
      {
        title: "Respect others",
        content: "Be kind and respectful to other members.",
      },
      { title: "No spam", content: "Avoid posting spam content." },
    ],
  })
  rules?: RuleResponseDto[] | null

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
