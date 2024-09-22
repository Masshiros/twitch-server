type UpdateUsernameCommandParams = {
  id: string
  username: string
}
export class UpdateUsernameCommand {
  id: string
  readonly username: string
  constructor(params: UpdateUsernameCommandParams) {
    this.id = params.id
    this.username = params.username
  }
}
