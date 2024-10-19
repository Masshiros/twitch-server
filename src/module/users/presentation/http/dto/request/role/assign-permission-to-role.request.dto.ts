import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, IsString } from "class-validator"

export class AssignPermissionsToRoleRequestDto {
  @ApiProperty({
    description: "The unique identifier of role",
    example: "e5b1c6d0-a7b6-4f7e-8fa7-923f8bcdb8c7",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  roleId: string
  @ApiProperty({
    description: "List of permission IDs to associate with the user",
    example: ["permissionId1", "permissionId2", "permission3Id"],
    isArray: true,
    type: String,
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  permissionsId: string[]
}
