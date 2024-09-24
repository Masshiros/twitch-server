import { IsNotEmpty, IsString } from "class-validator"

export class GetUserRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string
}
