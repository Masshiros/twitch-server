import { IsString } from "class-validator"

export class ToggleActivateRequestDto {
  @IsString()
  readonly id: string
}
