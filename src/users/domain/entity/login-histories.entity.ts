import { randomUUID } from "crypto"

export class LoginHistory {
  private _id: string
  private props: {
    userId: string
    deviceId: string
    loginAt: Date
    ipAddress: string
    loginStatus: boolean
    reason?: string
  }

  constructor(
    props: {
      userId: string
      deviceId: string
      loginAt: Date
      ipAddress: string
      loginStatus: boolean
      reason?: string
    },
    id?: string,
  ) {
    this._id = id || randomUUID()
    this.props = props
  }

  get id(): string {
    return this._id
  }

  get userId(): string {
    return this.props.userId
  }

  get deviceId(): string {
    return this.props.deviceId
  }

  get loginAt(): Date {
    return this.props.loginAt
  }

  get ipAddress(): string {
    return this.props.ipAddress
  }

  get loginStatus(): boolean {
    return this.props.loginStatus
  }

  get reason(): string | undefined {
    return this.props.reason
  }
  // Additional methods to manage login history specifics
}
