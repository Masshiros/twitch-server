type ForgotPasswordCommandParams = {
  emailOrPhone: string
}
export class ForgotPasswordCommand {
  emailOrPhone: string
  constructor(params: ForgotPasswordCommandParams) {
    this.emailOrPhone = params.emailOrPhone
  }
}
