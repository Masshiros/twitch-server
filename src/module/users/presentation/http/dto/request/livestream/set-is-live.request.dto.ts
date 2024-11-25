import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsString } from "class-validator"

export class SetIsLiveRequestDTO {
  @ApiProperty({
    description: "Category ID to associate with the user",
    example: "userId1",
    type: String,
    required: false,
  })
  @IsString()
  userId: string
  @ApiProperty({
    description: "Flag indicating whether the livestream is active",
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  isLive: boolean
}
