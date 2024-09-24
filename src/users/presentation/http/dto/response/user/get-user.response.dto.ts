import { IsString } from "class-validator"

export class GetUserResponseDto {
  @IsString()
  readonly id: string
  @IsString()
  readonly email: string
  @IsString()
  readonly username: string
}
