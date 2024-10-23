import { randomUUID } from "crypto"
import { BaseEntity } from "src/common/entity"

interface NotificationUserProps {
  receiverId: string
  notificationId: string
  hasRead: boolean
  createdAt?: Date
}
export class NotificationUser {
  private _receiverId: string
  private _notificationId: string
  private _hasRead: boolean
  private _createdAt: Date
  private _updatedAt: Date
  private _deletedAt: Date
  constructor(props: NotificationUserProps) {
    this._receiverId = props.receiverId
    this._notificationId = props.notificationId
    this._hasRead = props.hasRead
    this._createdAt = props.createdAt || new Date()
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
  get createdAt(): Date {
    return this._createdAt
  }
}
