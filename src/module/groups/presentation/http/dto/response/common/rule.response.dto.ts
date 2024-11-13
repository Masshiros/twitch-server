import { ApiProperty } from "@nestjs/swagger"
import { Expose } from "class-transformer"

export class RuleResponseDto {
  @ApiProperty({ description: "Rule's title" })
  @Expose()
  title: string
  @ApiProperty({ description: "Rule's content" })
  @Expose()
  content: string
}
