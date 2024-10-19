import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, IsString } from "class-validator"

export class AssignRoleToUserRequestDto {
  @ApiProperty({
    description: "The unique identifier of user",
    example: "e5b1c6d0-a7b6-4f7e-8fa7-923f8bcdb8c7",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  userId: string
  @ApiProperty({
    description: "List of role IDs to associate with the user",
    example: ["roleId1", "roleId2", "role3Id"],
    isArray: true,
    type: String,
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  roleId: string[]
}
