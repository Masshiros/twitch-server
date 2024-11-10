import { randomUUID } from "crypto"
import { BaseEntity } from "src/common/entity"

interface GroupInviteLinkProps {
  id?: string
  groupId: string
  link: string
  expiresAt: Date
  maxUses: number
  currentUses?: number
  createdAt?: Date
}

export class GroupInviteLink extends BaseEntity {
  private _groupId: string
  private _link: string
  private _expiresAt: Date
  private _maxUses: number
  private _currentUses: number

  constructor(props: GroupInviteLinkProps) {
    super()
    this._id = props.id ?? randomUUID()
    this._createdAt = props.createdAt ?? new Date()
    this._groupId = props.groupId
    this._link = props.link
    this._expiresAt = props.expiresAt
    this._maxUses = props.maxUses
    this._currentUses = props.currentUses ?? 0
  }

  public get groupId(): string {
    return this._groupId
  }

  public get link(): string {
    return this._link
  }

  public get expiresAt(): Date {
    return this._expiresAt
  }

  public get maxUses(): number {
    return this._maxUses
  }

  public get currentUses(): number {
    return this._currentUses
  }

  public set groupId(value: string) {
    this._groupId = value
  }

  public set link(value: string) {
    this._link = value
  }

  public set expiresAt(value: Date) {
    this._expiresAt = value
  }

  public set maxUses(value: number) {
    this._maxUses = value
  }

  public set currentUses(value: number) {
    this._currentUses = value
  }
}
