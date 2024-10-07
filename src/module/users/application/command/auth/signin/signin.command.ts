import { ICommand } from "@nestjs/cqrs"

export type SignInCommandParams = {
  username: string
  deviceName: string
  password: string
  userAgent: string
  ipAddress: string
  deviceType: string
}
export class SignInCommand implements ICommand {
  username: string
  password: string
  userAgent: string
  ipAddress: string
  deviceType: string

  deviceName: string

  constructor(params: SignInCommandParams) {
    this.username = params.username
    this.password = params.password
    this.userAgent = params.userAgent
    this.ipAddress = params.ipAddress
    this.deviceType = params.deviceType

    this.deviceName = params.deviceName
  }
}
