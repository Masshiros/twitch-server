import { randomUUID } from "crypto"
import { EReactionType } from "libs/constants/enum"
import { BaseEntity } from "src/common/entity"

interface PostReactionsProps {
  id?: string
  userId: string
  postId?: string
  groupPostId?: string
  type: EReactionType
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}
export class PostReactions extends BaseEntity {
  private _userId: string
  private _postId?: string
  private _groupPostId?: string
  private _type: EReactionType
  constructor(props: PostReactionsProps) {
    super()
    this._id = randomUUID()
    this._userId = props.userId
    this._postId = props.postId
    this._groupPostId = props.groupPostId
    this._type = props.type
    this._createdAt = props.createdAt || new Date()
    this._updatedAt = props.updatedAt
    this._deletedAt = props.deletedAt
  }
  get userId(): string {
    return this._userId
  }
  set userId(value: string) {
    this._userId = this.userId
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
  get groupPostId(): string {
    return this._groupPostId
  }
  set groupPostId(value: string) {
    this._groupPostId = value
  }
}
