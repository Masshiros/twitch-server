export type ConfirmEmailCommandParams = {
  otp: string
}
export class ConfirmEmailCommand {
  otp: string
  constructor(params: ConfirmEmailCommandParams) {
    this.otp = params.otp
  }
}
