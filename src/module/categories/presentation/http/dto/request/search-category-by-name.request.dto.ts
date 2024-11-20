import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class SearchCategoryByNameRequestDto {
  @ApiProperty({ description: "Content of the post", type: String })
  @IsNotEmpty()
  @IsString()
  keyword: string
}
