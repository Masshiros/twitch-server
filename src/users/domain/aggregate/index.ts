import { randomUUID } from "crypto"
import { Expose, Type } from "class-transformer"
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from "class-validator"
import { BaseAggregate } from "src/common/aggregate"
import { type Device } from "../entity/devices.entity"
import { ExternalLink } from "../entity/external-links.entity"
import { type LoginHistory } from "../entity/login-histories.entity"
import { type Token } from "../entity/tokens.entity"

interface UserAggregateProps {
  categoryId: string
  name: string
  displayName: string
  slug: string
  email: string
  password: string
  phoneNumber: string
  dob: Date
  emailVerified?: boolean
  phoneVerified?: boolean
  isLive?: boolean
  view?: number
  bio?: string
  avatar?: string
  lastUsernameChangeAt?: Date
  thumbnail?: string
  devices?: Device[]
  tokens?: Token[]
  loginHistories?: LoginHistory[]
  externalLinks?: ExternalLink[]
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}
export class UserAggregate extends BaseAggregate {
  @IsUUID()
  private _categoryId: string

  @IsString()
  @Expose()
  private _name: string
  @IsString()
  @Expose()
  private _displayName: string

  @IsString()
  @Expose()
  private _slug: string

  @IsEmail()
  @Expose()
  private _email: string
  @IsString()
  private _password: string

  @IsString()
  @Expose()
  private _phoneNumber: string

  @Type(() => Date)
  @IsDate()
  @Expose()
  private _dob: Date

  @IsBoolean()
  @Expose()
  private _emailVerified: boolean = false

  @IsBoolean()
  @Expose()
  private _phoneVerified: boolean = false

  @IsBoolean()
  @Expose()
  private _isLive: boolean = false

  @IsInt()
  @Min(0)
  @Expose()
  private _view: number = 0

  @IsString()
  @IsOptional()
  @Expose()
  private _bio?: string

  @IsString()
  @IsOptional()
  @Expose()
  private _avatar?: string

  @Type(() => Date)
  @IsOptional()
  @Expose()
  private _lastUsernameChangeAt: Date

  @IsString()
  @IsOptional()
  @Expose()
  private _thumbnail?: string
  @Expose()
  private _tokens: Token[]
  @Expose()
  private _devices: Device[]
  @Expose()
  private _loginHistories: LoginHistory[]
  @Expose()
  private _externalLinks: ExternalLink[]

  constructor(props: UserAggregateProps, id?: string) {
    super()
    this._id = id || randomUUID()
    this._categoryId = props.categoryId
    this._name = props.name
    this._displayName = props.displayName
    this._slug = props.slug
    this._email = props.email
    this._password = props.password
    this._phoneNumber = props.phoneNumber
    this._dob = props.dob
    this._emailVerified = props.emailVerified ?? false
    this._phoneVerified = props.phoneVerified ?? false
    this._isLive = props.isLive ?? false
    this._view = props.view ?? 0
    this._bio = props.bio
    this._avatar = props.avatar
    this._lastUsernameChangeAt = props.lastUsernameChangeAt
    this._thumbnail = props.thumbnail

    this._devices = props.devices || []
    this._tokens = props.tokens || []
    this._loginHistories = props.loginHistories || []
    this._externalLinks = props.externalLinks || []
    this._createdAt = props.createdAt || new Date()
    this._updatedAt = props.updatedAt || new Date()
    this._deletedAt = props.deletedAt
  }
  // Getters and Setters

  get categoryId(): string {
    return this._categoryId
  }

  set categoryId(value: string) {
    this._categoryId = value
  }

  get name(): string {
    return this._name
  }

  set name(value: string) {
    this._name = value
  }
  get displayName(): string {
    return this._displayName
  }
  set displayName(value: string) {
    this._displayName = value
  }

  get slug(): string {
    return this._slug
  }

  set slug(value: string) {
    this._slug = value
  }

  get email(): string {
    return this._email
  }

  set email(value: string) {
    this._email = value
  }

  get password(): string {
    return this._password
  }

  set password(value: string) {
    this._password = value
  }

  get phoneNumber(): string {
    return this._phoneNumber
  }

  set phoneNumber(value: string) {
    this._phoneNumber = value
  }

  get dob(): Date {
    return this._dob
  }

  set dob(value: Date) {
    this._dob = value
  }

  get emailVerified(): boolean {
    return this._emailVerified
  }

  set emailVerified(value: boolean) {
    this._emailVerified = value
  }

  get phoneVerified(): boolean {
    return this._phoneVerified
  }

  set phoneVerified(value: boolean) {
    this._phoneVerified = value
  }

  get isLive(): boolean {
    return this._isLive
  }

  set isLive(value: boolean) {
    this._isLive = value
  }

  get view(): number {
    return this._view
  }

  set view(value: number) {
    this._view = value
  }

  get bio(): string | undefined {
    return this._bio
  }

  set bio(value: string | undefined) {
    this._bio = value
  }

  get avatar(): string | undefined {
    return this._avatar
  }

  set avatar(value: string | undefined) {
    this._avatar = value
  }
  get lastUsernameChangeAt(): Date {
    return this._lastUsernameChangeAt
  }
  set lastUsernameChangeAt(value: Date) {
    this._lastUsernameChangeAt = value
  }
  get thumbnail(): string | undefined {
    return this._thumbnail
  }

  set thumbnail(value: string | undefined) {
    this._thumbnail = value
  }
  get devices(): Device[] {
    return this._devices
  }
  set devices(value: Device[] | undefined) {
    this._devices = value
  }
  // TODO: Update later
}
