export class LiveStreamInfo {
  private _id: string
  private _userId: string
  private _userName: string | null
  private _userImage: string | null
  private _userSlug: string | null
  private _title: string | null
  private _isLive: boolean | null
  private _thumbnailPreviewImage: string | null
  private _themeColor: string | null

  constructor({
    id,
    userId,
    userName,
    userImage,
    userSlug,
    title,
    isLive,
    thumbnailPreviewImage,
    themeColor,
  }: {
    id: string
    userId: string
    userName?: string
    userImage?: string
    userSlug?: string
    title?: string
    isLive?: boolean
    thumbnailPreviewImage?: string
    themeColor?: string
  }) {
    this._id = id
    this._userId = userId
    this._userName = userName ?? null
    this._userImage = userImage ?? null
    this._userSlug = userSlug ?? null
    this._title = title ?? null
    this._isLive = isLive ?? null
    this._thumbnailPreviewImage = thumbnailPreviewImage ?? null
    this._themeColor = themeColor ?? null
  }

  get id(): string {
    return this._id
  }
  get userId(): string {
    return this._userId
  }
  get userName(): string | null {
    return this._userName
  }
  set userName(value: string | null) {
    this._userName = value
  }
  get userImage(): string | null {
    return this._userImage
  }
  set userImage(value: string | null) {
    this._userImage = value
  }
  get userSlug(): string | null {
    return this._userSlug
  }
  set userSlug(value: string | null) {
    this._userSlug = value
  }
  get title(): string | null {
    return this._title
  }
  set title(value: string | null) {
    this._title = value
  }
  get isLive(): boolean | null {
    return this._isLive
  }
  set isLive(value: boolean | null) {
    this._isLive = value
  }
  get thumbnailPreviewImage(): string | null {
    return this._thumbnailPreviewImage
  }
  set thumbnailPreviewImage(value: string | null) {
    this._thumbnailPreviewImage = value
  }
  get themeColor(): string | null {
    return this._themeColor
  }
  set themeColor(value: string | null) {
    this._themeColor = value
  }
}
