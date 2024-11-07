import { randomUUID } from "crypto"
import { BaseEntity } from "src/common/entity"

interface FriendProps {
  userId: string
  friendId: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class Friend {
  private _userId: string
  private _friendId: string
  private _createdAt: Date
  private _updatedAt: Date
  private _deletedAt: Date

  constructor(props: FriendProps) {
    this._userId = props.userId
    this._friendId = props.friendId
    this._createdAt = props.createdAt ?? new Date()
    this._updatedAt = props.updatedAt
    this._deletedAt = props.deletedAt
  }

  get userId(): string {
    return this._userId
  }
  set userId(value: string) {
    this._userId = value
  }

  get friendId(): string {
    return this._friendId
  }
  set friendId(value: string) {
    this._friendId = value
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
