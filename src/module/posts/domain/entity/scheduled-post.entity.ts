import { randomUUID } from "crypto"
import { BaseEntity } from "src/common/entity"

interface ScheduledPostProps {
  id?: string

  userId: string
  postId: string
  scheduledAt: Date
  createdAt?: Date
  updatedAt?: Date
}

export class ScheduledPost extends BaseEntity {
  private _userId: string
  private _postId: string
  private _scheduledAt: Date

  constructor(props: ScheduledPostProps) {
    super()
    this._id = props.id ?? randomUUID()
    this._createdAt = props.createdAt ?? new Date()
    this._updatedAt = props.updatedAt

    this._userId = props.userId
    this._postId = props.postId
    this._scheduledAt = props.scheduledAt
  }

  public get userId(): string {
    return this._userId
  }

  public set userId(value: string) {
    this._userId = value
  }

  public get postId(): string {
    return this._postId
  }

  public set postId(value: string) {
    this._postId = value
  }

  public get scheduledAt(): Date {
    return this._scheduledAt
  }

  public set scheduledAt(value: Date) {
    this._scheduledAt = value
  }
}
