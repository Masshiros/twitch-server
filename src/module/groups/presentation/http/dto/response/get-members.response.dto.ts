import { ApiProperty } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { UserResponseDto } from "./common/user.response.dto"

export class GetMembersResponseDto {
  @ApiProperty({ description: "Number of admins in the group" })
  @Expose()
  numberOfAdminsInGroup: number

  @ApiProperty({
    description: "List of admins in the group",
    type: [UserResponseDto],
  })
  @Expose()
  @Type(() => UserResponseDto)
  admins: UserResponseDto[]

  @ApiProperty({ description: "Number of friends in the group" })
  @Expose()
  numberOfFriendsInGroup: number

  @ApiProperty({
    description: "List of friends in the group",
    type: [UserResponseDto],
  })
  @Expose()
  @Type(() => UserResponseDto)
  friends: UserResponseDto[]
}
