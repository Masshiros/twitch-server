import { EFriendRequestStatus } from "../enum/friend-request-status.enum"

interface FriendRequestProps {
  senderId: string
  receiverId: string
  status: EFriendRequestStatus
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class FriendRequest {
  private _senderId: string
  private _receiverId: string
  private _status: EFriendRequestStatus
  private _createdAt: Date
  private _updatedAt: Date
  private _deletedAt: Date

  constructor(props: FriendRequestProps) {
    this._senderId = props.senderId
    this._receiverId = props.receiverId
    this._status = props.status
    this._createdAt = props.createdAt ?? new Date()
    this._updatedAt = props.updatedAt
    this._deletedAt = props.deletedAt
  }

  get senderId(): string {
    return this._senderId
  }
  set senderId(value: string) {
    this._senderId = value
  }

  get receiverId(): string {
    return this._receiverId
  }
  set receiverId(value: string) {
    this._receiverId = value
  }

  get status(): EFriendRequestStatus {
    return this._status
  }
  set status(value: EFriendRequestStatus) {
    this._status = value
  }
  get createdAt(): Date {
    return this._createdAt
  }
  get updatedAt(): Date {
    return this._updatedAt
  }
  set updatedAt(value: Date) {
    this._updatedAt = value
  }
  get deletedAt(): Date {
    return this._deletedAt
  }
  set deletedAt(value: Date) {
    this._deletedAt = value
  }
}
