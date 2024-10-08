export type ConfirmEmailCommandParams = {
  otp: string
  username: string
}
export class ConfirmEmailCommand {
  otp: string
  username: string
  constructor(params: ConfirmEmailCommandParams) {
    this.otp = params.otp
    this.username = params.username
  }
}
