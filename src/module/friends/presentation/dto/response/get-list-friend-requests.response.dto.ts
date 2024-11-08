import { ApiProperty } from "@nestjs/swagger"

export class FriendRequestSenderDto {
  @ApiProperty({
    description: "ID of the sender",
    example: "e5b1c6d0-a7b6-4f7e-8fa7-923f8bcdb8c7",
  })
  senderId: string

  @ApiProperty({ description: "Username of the sender", example: "john_doe" })
  username: string

  @ApiProperty({
    description: "Avatar URL of the sender",
    example: "http://example.com/avatar.jpg",
  })
  avatar: string
}
export class FriendRequestDto {
  @ApiProperty({ description: "Sender details" })
  sender: FriendRequestSenderDto

  @ApiProperty({
    description: "Date when the friend request was sent",
    example: "2023-05-18",
  })
  sentAt: string
}

export class GetListFriendRequestsResponseDto {
  @ApiProperty({
    description: "List of friend requests",
    type: [FriendRequestDto],
  })
  friendRequests: FriendRequestDto[]
}
