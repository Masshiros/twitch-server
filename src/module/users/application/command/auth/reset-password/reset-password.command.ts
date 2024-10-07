type ResetPasswordCommandParams = {
  password: string
  confirmPassword: string
  token?: string
}
export class ResetPasswordCommand {
  password: string
  confirmPassword: string
  token: string
  constructor(params: ResetPasswordCommandParams) {
    this.password = params.password
    this.confirmPassword = params.confirmPassword
    this.token = params.token
  }
}
