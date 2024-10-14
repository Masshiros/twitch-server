import { ApiProperty } from "@nestjs/swagger"

export class UpdateTagRequestDto {
  @ApiProperty({
    description: "The name of the tag",
    example: "Gaming",
  })
  name: string
}
