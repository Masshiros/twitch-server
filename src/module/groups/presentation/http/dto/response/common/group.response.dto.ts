import { ApiProperty } from "@nestjs/swagger"
import { Expose } from "class-transformer"

export class GroupResponseDto {
  @ApiProperty({ description: "Id of group" })
  @Expose()
  id: string
  @ApiProperty({ description: "Name of group" })
  @Expose()
  name: string
  @ApiProperty({ description: "Group's cover image" })
  @Expose()
  coverImage?: string
}
