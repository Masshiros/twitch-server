import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDate, IsInt, IsString, Min } from "class-validator"

export class UpdateLivestreamSessionRequestDTO {
  @ApiProperty({
    description:
      "Unique identifier for the ingress related to the livestream session",
    example: "ingress123",
  })
  @IsString()
  ingressId: string

  @ApiProperty({
    description: "The start date and time of the livestream",
    example: "2023-01-01T12:00:00Z",
    type: String,
  })
  @IsDate()
  streamAt: Date

  @ApiProperty({
    description: "The end date and time of the livestream",
    example: "2023-01-01T14:00:00Z",
    type: String,
  })
  @IsDate()
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
