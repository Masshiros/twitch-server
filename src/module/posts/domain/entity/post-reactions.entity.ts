import { randomUUID } from "crypto"
import { EReactionType } from "libs/constants/enum"
import { BaseEntity } from "src/common/entity"

interface PostReactionsProps {
  userId: string
  postId: string

  type: EReactionType
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}
export class PostReactions {
  private _userId: string
  private _postId?: string

  private _type: EReactionType
  private _createdAt?: Date
  private _updatedAt?: Date
  private _deletedAt?: Date
  constructor(props: PostReactionsProps) {
    this._userId = props.userId
    this._postId = props.postId

    this._type = props.type
    this._createdAt = props.createdAt || new Date()
    this._updatedAt = props.updatedAt
    this._deletedAt = props.deletedAt
  }
  get userId(): string {
    return this._userId
  }
  set userId(value: string) {
    this._userId = value
  }
  get type(): EReactionType {
    return this._type
  }
  set type(value: EReactionType) {
    this._type = value
  }

  get postId(): string {
    return this._postId
  }
  set postId(value: string) {
    this._postId = value
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
