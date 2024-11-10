import { randomUUID } from "crypto"
import { EGroupRequestStatus } from "@prisma/client"
import { BaseEntity } from "src/common/entity"

interface MemberRequestProps {
  id?: string
  groupId: string
  userId: string
  status: EGroupRequestStatus
  requestedAt?: Date
  reviewedAt?: Date
  comment?: string
}

export class MemberRequest extends BaseEntity {
  private _groupId: string
  private _userId: string
  private _status: EGroupRequestStatus
  private _requestedAt: Date
  private _reviewedAt: Date | null
  private _comment: string | null

  constructor(props: MemberRequestProps) {
    super()
    this._id = props.id ?? randomUUID()
    this._groupId = props.groupId
    this._userId = props.userId
    this._status = props.status
    this._requestedAt = props.requestedAt ?? new Date()
    this._reviewedAt = props.reviewedAt || null
    this._comment = props.comment || null
  }

  public get groupId(): string {
    return this._groupId
  }

  public get userId(): string {
    return this._userId
  }

  public get status(): EGroupRequestStatus {
    return this._status
  }

  public get requestedAt(): Date {
    return this._requestedAt
  }

  public get reviewedAt(): Date | null {
    return this._reviewedAt
  }

  public get comment(): string | null {
    return this._comment
  }

  public set groupId(value: string) {
    this._groupId = value
  }

  public set userId(value: string) {
    this._userId = value
  }

  public set status(value: EGroupRequestStatus) {
    this._status = value
  }

  public set reviewedAt(value: Date | null) {
    this._reviewedAt = value
  }

  public set comment(value: string | null) {
    this._comment = value
  }
}
