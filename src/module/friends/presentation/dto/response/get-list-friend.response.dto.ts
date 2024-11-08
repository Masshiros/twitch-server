import { ApiProperty } from "@nestjs/swagger"

export class FriendDto {
  @ApiProperty({
    description: "ID of friend",
    example: "e5b1c6d0-a7b6-4f7e-8fa7-923f8bcdb8c7",
  })
  userId: string
  @ApiProperty({ description: "Username of friend", example: "john_doe" })
  username: string
  @ApiProperty({
    description: "Avatar URL of the sender",
    example: "http://example.com/avatar.jpg",
  })
  avatar: string
  @ApiProperty({
    description: "Is that your friend(in case you view others' friends",
    example: true,
  })
  isFriend: boolean
  @ApiProperty({
    description: "Number of mutual friends",
    example: 100,
  })
  numberOfMutualFriends: number
}
export class GetListFriendResponseDto {
  @ApiProperty({
    description: "List of friends",
    type: [FriendDto],
  })
  friends: FriendDto[]
}
