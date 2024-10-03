export type ConfirmEmailCommandParams = {
  id: string
  otp: string
}
export class ConfirmEmailCommand {
  id: string
  otp: string
  constructor(params: ConfirmEmailCommandParams) {
    this.otp = params.otp
    this.id = params.id
  }
}
