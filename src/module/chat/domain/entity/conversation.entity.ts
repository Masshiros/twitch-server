import { randomUUID } from "crypto"

interface ConversationProps {
  id?: string
  creatorId: string
  receiverId: string
  lastMessageId?: string
  createdAt?: Date
  deletedAt?: Date
}

export class Conversation {
  private _id: string
  private _creatorId: string
  private _receiverId: string
  private _lastMessageId: string
  private _createdAt: Date
  private _deletedAt: Date
  constructor(props: ConversationProps) {
    this._id = props.id ?? randomUUID()
    this._creatorId = props.creatorId
    this._lastMessageId = props.lastMessageId
    this._receiverId = props.receiverId
    this._createdAt = props.createdAt ?? new Date()
    this._deletedAt = props.deletedAt
  }

  public get id(): string {
    return this._id
  }

  public get creatorId(): string {
    return this._creatorId
  }

  public get receiverId(): string {
    return this._receiverId
  }
  public get lastMessageId(): string {
    return this._lastMessageId
  }
  public set lastMessageId(value: string) {
    this._lastMessageId = value
  }

  public get createdAt(): Date {
    return this._createdAt
  }
  public get deletedAt(): Date {
    return this._deletedAt
  }
  public set deletedAt(value: Date) {
    this._deletedAt = value
  }
  public set creatorId(value: string) {
    this._creatorId = value
  }

  public set receiverId(value: string) {
    this._receiverId = value
  }
}
