type ToggleTwoFaCommandParams = {
  id?: string
}
export class ToggleTwoFaCommand {
  id: string
  constructor(params: ToggleTwoFaCommandParams) {
    this.id = params.id
  }
}
