import { randomUUID } from "crypto"
import { BaseEntity } from "src/common/entity"
import { EGroupPostStatus } from "../enum/group-post-status.enum"

interface GroupPostsProps {
  id?: string
  groupId: string
  userId: string
  tagByGroupPostId?: string
  content: string
  totalViewCount?: number
  status: EGroupPostStatus
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}
export class GroupPost extends BaseEntity {
  private _groupId: string
  private _userId: string
  private _tagByGroupPostId?: string
  private _content: string
  private _status: EGroupPostStatus
  private _totalViewCount?: number

  constructor(props: GroupPostsProps) {
    super()
    this._id = props.id ?? randomUUID()
    this._userId = props.userId
    this._groupId = props.groupId
    this._tagByGroupPostId = props.tagByGroupPostId
    this._content = props.content
    this._status = props.status ?? EGroupPostStatus.PENDING
    this._totalViewCount = props.totalViewCount ?? 0
    this._createdAt = props.createdAt ?? new Date()
    this._updatedAt = props.updatedAt
    this._deletedAt = props.deletedAt
  }

  public get groupId(): string {
    return this._groupId
  }
  public get tagByGroupPostId(): string {
    return this._tagByGroupPostId
  }
  public get userId(): string {
    return this._userId
  }

  public get content(): string {
    return this._content
  }

  public get status(): EGroupPostStatus {
    return this._status
  }
  public get totalViewCount(): number {
    return this._totalViewCount
  }

  // Setters
  public set groupId(value: string) {
    this._groupId = value
  }

  public set userId(value: string) {
    this._userId = value
  }
  public set tagByGroupPostId(value: string) {
    this._tagByGroupPostId = value
  }

  public set content(value: string) {
    this._content = value
  }

  public set status(value: EGroupPostStatus) {
    this._status = value
  }
  public set totalViewCount(value: number) {
    this._totalViewCount = value
  }
}
