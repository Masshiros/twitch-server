import { ApiProperty } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { UserResponseDto } from "./common/user.response.dto"

export class RequestResponseDto {
  @ApiProperty({ type: UserResponseDto, description: "User details" })
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto

  @ApiProperty({
    example: 5,
    description: "Total number of friends of the user",
  })
  @Expose()
  numberOfFriends: number

  @ApiProperty({
    example: 3,
    description: "Total number of mutual friends with the requester",
  })
  @Expose()
  numberOfMutualFriends: number

  @ApiProperty({
    type: [String],
    example: ["Alice", "Bob"],
    description: "Names of mutual friends with the requester",
  })
  @Expose()
  mutualFriendNames: string[]

  @ApiProperty({
    example: 2,
    description: "Number of friends in the same group",
  })
  @Expose()
  numberOfFriendsInGroup: number

  @ApiProperty({
    type: [String],
    example: ["Alice", "Bob"],
    description: "Names of friends who are in the same group",
  })
  @Expose()
  friendNamesInGroup: string[]

  @ApiProperty({
    example: 4,
    description: "Number of groups in common with the requester",
  })
  @Expose()
  numberOfGroupsInCommon: number

  @ApiProperty({
    type: [String],
    example: ["Sports Club", "Coding Group"],
    description: "Names of groups in common with the requester",
  })
  @Expose()
  groupsInCommonName: string[]

  @ApiProperty({
    example: "2023-12-01T00:00:00.000Z",
    description: "Date when the request was created",
  })
  @Expose()
  createdAt: string
}

export class GetPendingRequestsResponseDto {
  @ApiProperty({
    type: [RequestResponseDto],
    description: "List of pending friend requests",
  })
  @Expose()
  @Type(() => RequestResponseDto)
  requests: RequestResponseDto[]
}
