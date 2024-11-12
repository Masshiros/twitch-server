import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class AddDescriptionRequestDto {
  @ApiProperty({ description: "Description of the group", type: String })
  @IsString()
  description: string
}
