type SetStreamKeyCommandParams = {
  userId: string
  streamKey: string
  serverUrl: string
}
export class SetStreamKeyCommand {
  streamKey: string
  serverUrl: string
  userId: string
  constructor(params: SetStreamKeyCommandParams) {
    this.streamKey = params.streamKey
    this.serverUrl = params.serverUrl
    this.userId = params.userId
  }
}
