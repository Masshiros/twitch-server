import { IsString } from "class-validator"

export class UpdateUsernameRequestDto {
  @IsString()
  readonly username?: string
}
