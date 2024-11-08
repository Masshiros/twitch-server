import { ApiProperty } from "@nestjs/swagger"
import { FriendDto } from "./get-list-friend.response.dto"

export class GetMutualFriendResponseDto {
  @ApiProperty({
    description: "List of friends",
    type: [FriendDto],
  })
  mutualFriends: FriendDto[]
}
