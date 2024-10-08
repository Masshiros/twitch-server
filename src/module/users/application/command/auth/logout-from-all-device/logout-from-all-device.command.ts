type LogoutFromAllDeviceCommandParams = {
  userId: string
}
export class LogoutFromAllDeviceCommand {
  userId: string
  constructor(params: LogoutFromAllDeviceCommandParams) {
    this.userId = params.userId
  }
}
