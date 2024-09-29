import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class UpdateBioRequestDto {
  @ApiPropertyOptional({
    description: "The display name of the user",
    example: "John Doe",
  })
  @IsString()
  readonly displayName?: string

  @ApiPropertyOptional({
    description: "The bio of the user",
    example: "Software engineer with a passion for open source.",
  })
  @IsString()
  readonly bio?: string
}
