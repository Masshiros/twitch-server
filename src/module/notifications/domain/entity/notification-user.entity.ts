import { randomUUID } from "crypto"
import { BaseEntity } from "src/common/entity"

interface NotificationUserProps {
  receiverId: string
  notificationId: string
  hasRead: boolean
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}
export class NotificationUser extends BaseEntity {
  private _receiverId: string
  private _notificationId: string
  private _hasRead: boolean
  constructor(props: NotificationUserProps, id?: string) {
    super()
    this._id = id || randomUUID()
    this._receiverId = props.receiverId
    this._notificationId = props.notificationId
    this._hasRead = props.hasRead
    this._createdAt = props.createdAt || new Date()
    this._updatedAt = props.updatedAt || null
    this._deletedAt = props.deletedAt || null
  }
  get receiverId(): string {
    return this._receiverId
  }
  set receiverId(value: string) {
    this._receiverId = value
  }
  get notificationId(): string {
    return this._notificationId
  }
  set notificationId(value: string) {
    this._notificationId = value
  }
  get hasRead(): boolean {
    return this._hasRead
  }
  set hasRead(value: boolean) {
    this._hasRead = value
  }
}
