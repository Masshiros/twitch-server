import { ICommand } from "@nestjs/cqrs"

type RefreshTokenParams = {
  refreshToken: string
}
export class RefreshTokenCommand implements ICommand {
  readonly refreshToken: string
  constructor(params: RefreshTokenParams) {
    this.refreshToken = params.refreshToken
  }
}
