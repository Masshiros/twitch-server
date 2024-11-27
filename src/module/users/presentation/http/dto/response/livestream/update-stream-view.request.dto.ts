import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsString, Min } from "class-validator"

export class UpdateStreamViewRequestDto {
  @ApiProperty({
    description: "Unique identifier for the user",
    example: "user123",
  })
  @IsString()
  userId: string
  @ApiProperty({
    description: "Total number of views for the livestream session",
    example: 500,
    type: Number,
  })
  @IsInt()
  @Min(0)
  view: number
}
