type ForgetUsernameCommandParams = {
  email: string
}
export class ForgetUsernameCommand {
  email: string
  constructor(params: ForgetUsernameCommandParams) {
    this.email = params.email
  }
}
