type ToggleActivateCommandParams = {
  id: string
}

export class ToggleActivateCommand {
  id: string
  constructor(params: ToggleActivateCommandParams) {
    this.id = params.id
  }
}
