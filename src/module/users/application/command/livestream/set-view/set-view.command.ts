type SetViewCommandParams = {
  userId: string
  view: number
}
export class SetViewCommand {
  userId: string
  view: number
  constructor(params: SetViewCommandParams) {
    this.userId = params.userId
    this.view = params.view
  }
}
