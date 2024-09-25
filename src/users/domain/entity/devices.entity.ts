import { randomUUID } from "crypto"
import { BaseEntity } from "src/common/entity"
import { type EDeviceType } from "../enum/device_type.enum"
import { type LoginHistory } from "./login-histories.entity"
import { type Token } from "./tokens.entity"

export class Device extends BaseEntity {
  private props: {
    userId: string
    type: EDeviceType
    name: string
    lastUsed: Date
    tokens: Token[]
    loginHistories: LoginHistory[]
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
  }

  constructor(
    props: {
      userId: string
      type: EDeviceType
      name: string
      lastUsed: Date
      tokens: Token[]
      loginHistories: LoginHistory[]
      createdAt?: Date
      updatedAt?: Date
      deletedAt?: Date
    },
    id?: string,
  ) {
    super()
    this._id = id
    this.props = props
  }

  get userId(): string {
    return this.props.userId
  }

  get type(): EDeviceType {
    return this.props.type
  }

  get name(): string {
    return this.props.name
  }

  get lastUsed(): Date {
    return this.props.lastUsed
  }

  set lastUsed(dateTime: Date) {
    this.props.lastUsed = dateTime
  }
  get tokens(): Token[] {
    return this.props.tokens
  }

  get loginHistories(): LoginHistory[] {
    return this.props.loginHistories
  }
}
