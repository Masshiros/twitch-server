import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export class DeleteUserRequestDto {
  @ApiProperty({
    description: "The unique identifier of the user to delete",
    example: "e5b1c6d0-a7b6-4f7e-8fa7-923f8bcdb8c7",
  })
  @IsUUID()
  id: string
}
