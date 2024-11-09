import { randomUUID } from "crypto"
import { BaseEntity } from "src/common/entity"
import { EUserPostVisibility } from "../enum/posts.enum"
import { PostReactions } from "./post-reactions.entity"

interface PostProps {
  id?: string
  userId: string
  // groupId?: string
  content: string
  visibility: EUserPostVisibility
  totalViewCount?: number
  postReactions?: PostReactions[]
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}
export class Post extends BaseEntity {
  private _userId: string
  // private _groupId: string
  private _content: string
  private _visibility: EUserPostVisibility
  private _totalViewCount?: number
  private _postReactions?: PostReactions[]
  constructor(props: PostProps) {
    super()
    this._id = props.id ?? randomUUID()
    this._userId = props.userId
    // this._groupId = props.groupId
    this._content = props.content
    this._visibility = props.visibility ?? EUserPostVisibility.PUBLIC
    this._totalViewCount = props.totalViewCount ?? 0
    this._postReactions = props.postReactions ?? []
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
  // get groupId(): string {
  //   return this._groupId
  // }
  // set groupId(value: string) {
  //   this._groupId = value
  // }
  get content(): string {
    return this._content
  }
  set content(value: string) {
    this._content = value
  }
  get totalViewCount(): number {
    return this._totalViewCount
  }
  set totalViewCount(value: number) {
    this._totalViewCount = value
  }
  get postReactions(): PostReactions[] {
    return this._postReactions
  }
  set postReactions(value: PostReactions[]) {
    this._postReactions = value
  }

  get visibility(): EUserPostVisibility {
    return this._visibility
  }
  set visibility(value: EUserPostVisibility) {
    this._visibility = value || EUserPostVisibility.PUBLIC
  }
}
