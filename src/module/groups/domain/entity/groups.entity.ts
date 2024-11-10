import { randomUUID } from "crypto"
import { BaseEntity } from "src/common/entity"
import { EGroupPrivacy } from "../enum/group-privacy.enum"
import { EGroupVisibility } from "../enum/group-visibility.enum"

interface GroupProps {
  id?: string
  ownerId: string
  name: string
  description: string
  visibility: EGroupVisibility
  privacy: EGroupPrivacy
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}
export class Group extends BaseEntity {
  private _ownerId: string
  private _name: string
  private _description: string
  private _visibility: EGroupVisibility
  private _privacy: EGroupPrivacy
  constructor(props: GroupProps) {
    super()
    this._id = props.id ?? randomUUID()
    this._createdAt = props.createdAt ?? new Date()
    this._updatedAt = props.updatedAt
    this._deletedAt = props.deletedAt
    this._ownerId = props.ownerId
    this._name = props.name
    this._description = props.description
    this._visibility = props.visibility ?? EGroupVisibility.PUBLIC
    this._privacy = props.privacy ?? EGroupPrivacy.VISIBLE
  }
  public get ownerId(): string {
    return this._ownerId
  }

  public get name(): string {
    return this._name
  }

  public get description(): string {
    return this._description
  }

  public get visibility(): EGroupVisibility {
    return this._visibility
  }

  public get privacy(): EGroupPrivacy {
    return this._privacy
  }

  public set ownerId(value: string) {
    this._ownerId = value
  }

  public set name(value: string) {
    this._name = value
  }

  public set description(value: string) {
    this._description = value
  }

  public set visibility(value: EGroupVisibility) {
    this._visibility = value
  }

  public set privacy(value: EGroupPrivacy) {
    this._privacy = value
  }
}
