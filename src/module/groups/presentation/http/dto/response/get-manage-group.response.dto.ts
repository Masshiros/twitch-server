import { ApiProperty } from "@nestjs/swagger"
import { GroupResponseDto } from "./common/group.response.dto"

class ManageGroupInfo {
  @ApiProperty({
    description: "Information about the group.",
    type: GroupResponseDto,
  })
  info: GroupResponseDto

  @ApiProperty({
    description: "The date the user joined the group.",
    type: String,
  })
  createdAt: string
}
export class GetManageGroupResponseDto {
  @ApiProperty({
    description:
      "List of groups the user has joined, including group info and join date.",
    type: () => [ManageGroupInfo],
  })
  groups: ManageGroupInfo[]
}
