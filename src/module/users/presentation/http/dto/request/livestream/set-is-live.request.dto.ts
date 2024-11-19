import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsString } from "class-validator"

export class SetIsLiveRequestDTO {
  @ApiProperty({
    description: "Flag indicating whether the livestream is active",
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  isLive: boolean
}
