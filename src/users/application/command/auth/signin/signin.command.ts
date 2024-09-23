import { ICommand } from "@nestjs/cqrs"

export type SignInCommandParams = {
  username: string
  password: string
}
export class SignInCommand implements ICommand {
  username: string
  password: string
  constructor(params: SignInCommandParams) {
    this.username = params.username
    this.password = params.password
  }
}
