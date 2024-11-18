import { randomUUID } from "crypto"
import { BaseEntity } from "src/common/entity"

interface CommentProps {
  id?: string
  postId: string
  userId: string
  parentId: string
  content: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class Comment extends BaseEntity {
  private _postId: string
  private _userId: string
  private _content: string
  private _parentId?: string

  constructor(props: CommentProps) {
    super()
    this._id = props.id ?? randomUUID()
    this._postId = props.postId
    this._userId = props.userId
    this._parentId = props.parentId
    this._content = props.content
    this._createdAt = props.createdAt ?? new Date()
    this._updatedAt = props.updatedAt
    this._deletedAt = props.deletedAt
  }

  get postId(): string {
    return this._postId
  }

  get userId(): string {
    return this._userId
  }

  get content(): string {
    return this._content
  }
  get parentId(): string {
    return this._parentId
  }
  set postId(value: string) {
    this._postId = value
  }

  set userId(value: string) {
    this._userId = value
  }

  set content(value: string) {
    this.content = value
  }
  set parentId(value: string) {
    this._parentId = value
  }
}
