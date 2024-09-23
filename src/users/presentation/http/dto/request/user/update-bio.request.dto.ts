import { IsString, IsUUID } from "class-validator"

export class UpdateBioRequestDto {
  @IsString()
  readonly displayName?: string
  @IsString()
  readonly bio?: string
}
