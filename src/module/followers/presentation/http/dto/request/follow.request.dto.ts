import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class FollowRequestDto {
  @ApiProperty({
    description: "The unique identifier of the follower",
    example: "e5b1c6d0-a7b6-4f7e-8fa7-923f8bcdb8c7",
  })
  @IsNotEmpty()
  @IsString()
  sourceUserId: string
  @ApiProperty({
    description: "The unique identifier of the user to follow",
    example: "e5b1c6d0-a7b6-4f7e-8fa7-923f8bcdb8c7",
  })
  @IsNotEmpty()
  @IsString()
  destinationUserId: string
}
