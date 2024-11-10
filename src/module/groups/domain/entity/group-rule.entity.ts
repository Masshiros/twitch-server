import { randomUUID } from "crypto"
import { StreamingProfiles } from "cloudinary"
import { StringMaskOptions } from "maskdata"
import { BaseEntity } from "src/common/entity"

interface GroupRuleProps {
  id?: string
  groupId: string
  title: StreamingProfiles
  content: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class GroupRule extends BaseEntity {
  private _groupId: string
  private _title: string
  private _content: string

  constructor(props: GroupRuleProps) {
    super()
    this._id = props.id ?? randomUUID()
    this._groupId = props.groupId
    this._title = props.title
    this._content = props.content
    this._createdAt = props.createdAt ?? new Date()
    this._updatedAt = props.updatedAt
    this._deletedAt = props.deletedAt
  }

  // Getters
  public get groupId(): string {
    return this._groupId
  }

  public get content(): string {
    return this._content
  }
  public get title(): string {
    return this._title
  }

  // Setters
  public set groupId(value: string) {
    this._groupId = value
  }

  public set content(value: string) {
    this._content = value
  }
  public set title(value: string) {
    this._title = value
  }
}
