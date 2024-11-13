import { ApiProperty } from "@nestjs/swagger"
import { GroupResponseDto } from "./common/group.response.dto"

export class GetJoinedGroupResponseDto {
  @ApiProperty({
    description:
      "List of groups the user has joined, including group info and join date.",
    type: () => [JoinedGroupInfo],
  })
  groups: JoinedGroupInfo[]
}

class JoinedGroupInfo {
  @ApiProperty({
    description: "Information about the group.",
    type: GroupResponseDto,
  })
  info: GroupResponseDto

  @ApiProperty({
    description: "The date the user joined the group.",
    type: Date,
  })
  joinedAt: Date
}
