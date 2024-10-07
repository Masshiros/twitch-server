export type ResendVerifyEmailCommandParams = {
  id: string
}
export class ResendVerifyEmailCommand {
  id: string

  constructor(params: ResendVerifyEmailCommandParams) {
    this.id = params.id
  }
}
