import { randomUUID } from "crypto"
import { EGroupRole } from "@prisma/client"
import { BaseEntity } from "src/common/entity"

interface GroupMemberProps {
  groupId: string
  memberId: string
  joinedAt?: Date
  role: EGroupRole
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}
export class GroupMember {
  private _groupId: string
  private _memberId: string
  private _joinedAt: Date
  private _role: EGroupRole
  private _createdAt: Date
  private _updatedAt: Date
  private _deletedAt: Date

  constructor(props: GroupMemberProps) {
    this._createdAt = props.createdAt ?? new Date()
    this._updatedAt = props.updatedAt
    this._deletedAt = props.deletedAt
    this._groupId = props.groupId
    this._memberId = props.memberId
    this._joinedAt = props.joinedAt ?? new Date()
    this._role = props.role
  }

  // Getters
  public get groupId(): string {
    return this._groupId
  }

  public get memberId(): string {
    return this._memberId
  }

  public get joinedAt(): Date {
    return this._joinedAt
  }

  public get role(): EGroupRole {
    return this._role
  }

  // Setters
  public set groupId(value: string) {
    this._groupId = value
  }

  public set memberId(value: string) {
    this._memberId = value
  }

  public set joinedAt(value: Date) {
    this._joinedAt = value
  }

  public set role(value: EGroupRole) {
    this._role = value
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
