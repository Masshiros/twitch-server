import { randomUUID } from "crypto"

export class Token {
  private _id: string
  private props: {
    userId: string
    deviceId: string
    token: string
    expiresAt: Date
  }

  constructor(
    props: {
      userId: string
      deviceId: string
      token: string
      expiresAt: Date
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

  get token(): string {
    return this.props.token
  }

  get expiresAt(): Date {
    return this.props.expiresAt
  }

  // Method to check if the token is expired
  isExpired(): boolean {
    return new Date() > this.props.expiresAt
  }
}
