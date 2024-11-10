export type ResendVerifyEmailCommandParams = {
  email: string
}
export class ResendVerifyEmailCommand {
  email: string

  constructor(params: ResendVerifyEmailCommandParams) {
    this.email = params.email
  }
}
