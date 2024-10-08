type LogoutFromOneDeviceParams = {
  userId: string
  deviceId: string
}
export class LogoutFromOneDeviceCommand {
  userId: string
  deviceId: string
  constructor(params: LogoutFromOneDeviceParams) {
    this.userId = params.userId
    this.deviceId = params.deviceId
  }
}
