import { randomUUID } from "crypto"
import { BaseEntity } from "src/common/entity"
import { ENotification } from "../enum/notification.enum"

interface NotificationProps {
  receiverId: string
  title: string
  message: string
  slug: string
  type: ENotification
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}
export class Notification extends BaseEntity {
  private _title: string
  private _message: string
  private _slug: string
  private _type: ENotification

  constructor(props: NotificationProps, id?: string) {
    super()
    this._id = id || randomUUID()
    this._title = props.title ?? ""
    this._message = props.message ?? ""
    this._slug = props.slug ?? ""
    this._type = props.type ?? ENotification.USER
    this._createdAt = props.createdAt ?? new Date()
    this._updatedAt = props.updatedAt ?? null
    this._deletedAt = props.deletedAt ?? null
  }
  get title(): string {
    return this._title
  }
  set title(value: string) {
    this._title = value
  }
  get message(): string {
    return this._message
  }
  set message(value: string) {
    this._message = value
  }
  get slug(): string {
    return this._slug
  }
  set slug(value: string) {
    this._slug = value
  }
  get type(): ENotification {
    return this._type
  }
  set type(value: ENotification) {
    this._type = value
  }
}
