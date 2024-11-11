import { randomUUID } from "crypto"
import { BaseEntity } from "src/common/entity"
import { EInvitationStatus } from "../enum/group-invitation-status.enum"

interface GroupInvitationProps {
  id?: string
  groupId: string
  invitedUserId: string
  inviterId: string
  status: EInvitationStatus
  expiredAt: Date
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}
export class GroupInvitation extends BaseEntity {
  private _groupId: string
  private _invitedUserId: string
  private _inviterId: string
  private _status: EInvitationStatus
  private _expiredAt: Date

  constructor(props: GroupInvitationProps) {
    super()
    this._id = props.id ?? randomUUID()
    this._groupId = props.groupId
    this._invitedUserId = props.invitedUserId
    this._inviterId = props.inviterId
    this._status = props.status
    this._createdAt = props.createdAt ?? new Date()
    this._updatedAt = props.updatedAt
    this._deletedAt = props.deletedAt
    this._expiredAt = props.expiredAt
  }

  // Getters
  public get groupId(): string {
    return this._groupId
  }

  public get invitedUserId(): string {
    return this._invitedUserId
  }

  public get inviterId(): string {
    return this._inviterId
  }

  public get status(): EInvitationStatus {
    return this._status
  }

  public get createdAt(): Date {
    return this._createdAt
  }

  public get expiredAt(): Date {
    return this._expiredAt
  }

  // Setters
  public set groupId(value: string) {
    this._groupId = value
  }

  public set invitedUserId(value: string) {
    this._invitedUserId = value
  }

  public set inviterId(value: string) {
    this._inviterId = value
  }

  public set status(value: EInvitationStatus) {
    this._status = value
  }

  public set createdAt(value: Date) {
    this._createdAt = value
  }

  public set expiredAt(value: Date) {
    this._expiredAt = value
  }
}
