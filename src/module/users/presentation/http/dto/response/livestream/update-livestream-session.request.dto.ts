import { ApiProperty } from "@nestjs/swagger"
import {
  IsBoolean,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsString,
  Min,
} from "class-validator"

export class UpdateLivestreamSessionRequestDTO {
  @ApiProperty({
    description: "Unique identifier for the user",
    example: "user123",
  })
  @IsString()
  userId: string

  @ApiProperty({
    description: "The end date and time of the livestream",
    example: "2023-01-01T14:00:00Z",
    type: String,
  })
  @IsISO8601()
  @IsNotEmpty()
  endStreamAt: Date

  @ApiProperty({
    description: "Total number of views for the livestream session",
    example: 500,
    type: Number,
  })
  @IsInt()
  @Min(0)
  totalView: number

  @ApiProperty({
    description: "Flag indicating whether the livestream is currently active",
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  isLive: boolean
}
