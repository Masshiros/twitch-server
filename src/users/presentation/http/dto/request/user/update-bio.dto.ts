import { IsString, IsUUID } from "class-validator"

export class UpdateBioDto {
  @IsString()
  readonly displayName?: string
  @IsString()
  readonly bio?: string
}
