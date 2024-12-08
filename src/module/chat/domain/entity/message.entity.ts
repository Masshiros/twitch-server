import { randomUUID } from "crypto"
import { BaseEntity } from "src/common/entity"

interface MessageProps {
  id?: string
  content: string
  authorId: string
  conversationId: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class Message extends BaseEntity {
  private _content: string
  private _authorId: string
  private _conversationId: string

  constructor(props: MessageProps) {
    super()
    this._id = props.id ?? randomUUID()
    this._content = props.content
    this._authorId = props.authorId
    this._conversationId = props.conversationId
    this._createdAt = props.createdAt ?? new Date()
    this._updatedAt = props.updatedAt
    this._deletedAt = props.deletedAt
  }

  public get content(): string {
    return this._content
  }

  public get authorId(): string {
    return this._authorId
  }

  public get conversationId(): string {
    return this._conversationId
  }

  public set content(value: string) {
    this._content = value
  }

  public set authorId(value: string) {
    this._authorId = value
  }

  public set conversationId(value: string) {
    this._conversationId = value
  }
}
