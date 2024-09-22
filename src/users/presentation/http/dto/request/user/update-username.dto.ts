import { IsString } from "class-validator"

export class UpdateUsernameDto {
  @IsString()
  readonly username?: string
}
