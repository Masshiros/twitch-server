import { BaseAggregate } from 'src/common/aggregate';
import {
  IsUUID,
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsDate,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
export class UserAggregate extends BaseAggregate {
  @IsUUID()
  private _categoryId: string;

  @IsString()
  private _name: string;

  @IsString()
  private _slug: string;

  @IsEmail()
  private _email: string;
  @IsString()
  private _password: string;

  @IsString()
  private _phoneNumber: string;

  @Type(() => Date)
  @IsDate()
  private _dob: Date;

  @IsBoolean()
  private _emailVerified: boolean = false;

  @IsBoolean()
  private _phoneVerified: boolean = false;

  @IsBoolean()
  private _isLive: boolean = false;

  @IsInt()
  @Min(0)
  private _view: number = 0;

  @IsString()
  @IsOptional()
  private _bio?: string;

  @IsString()
  @IsOptional()
  private _avatar?: string;

  @IsString()
  @IsOptional()
  private _thumbnail?: string;

  // Getters and Setters

  get categoryId(): string {
    return this._categoryId;
  }

  set categoryId(value: string) {
    this._categoryId = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get slug(): string {
    return this._slug;
  }

  set slug(value: string) {
    this._slug = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get phoneNumber(): string {
    return this._phoneNumber;
  }

  set phoneNumber(value: string) {
    this._phoneNumber = value;
  }

  get dob(): Date {
    return this._dob;
  }

  set dob(value: Date) {
    this._dob = value;
  }

  get emailVerified(): boolean {
    return this._emailVerified;
  }

  set emailVerified(value: boolean) {
    this._emailVerified = value;
  }

  get phoneVerified(): boolean {
    return this._phoneVerified;
  }

  set phoneVerified(value: boolean) {
    this._phoneVerified = value;
  }

  get isLive(): boolean {
    return this._isLive;
  }

  set isLive(value: boolean) {
    this._isLive = value;
  }

  get view(): number {
    return this._view;
  }

  set view(value: number) {
    this._view = value;
  }

  get bio(): string | undefined {
    return this._bio;
  }

  set bio(value: string | undefined) {
    this._bio = value;
  }

  get avatar(): string | undefined {
    return this._avatar;
  }

  set avatar(value: string | undefined) {
    this._avatar = value;
  }

  get thumbnail(): string | undefined {
    return this._thumbnail;
  }

  set thumbnail(value: string | undefined) {
    this._thumbnail = value;
  }
}
