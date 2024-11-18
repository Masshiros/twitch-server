import { randomUUID } from "crypto"
import { BaseEntity } from "src/common/entity"

export class Livestream extends BaseEntity {
  private props: {
    userId: string
    categoryId?: string
    tagId?: string
    tagName?: string
    tagSlug?: string
    userName?: string
    userImage?: string
    userSlug?: string
    title?: string
    slug?: string
    totalView?: number
    isLive?: boolean
    isChatEnabled?: boolean
    isChatDelayed?: boolean
    delayedSeconds?: string
    isChatFollowersOnly?: boolean
    thumbnailPreviewImage?: string
    themeColor?: string
    ingressId?: string
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
  }

  constructor(
    props: {
      userId: string
      categoryId: string
      tagId: string
      tagName: string
      tagSlug: string
      userName: string
      userImage: string
      userSlug: string
      title: string
      slug: string
      totalView: number
      isLive: boolean
      isChatEnabled: boolean
      isChatDelayed: boolean
      delayedSeconds: string
      isChatFollowersOnly: boolean
      thumbnailPreviewImage: string
      themeColor: string
      ingressId?: string
      createdAt?: Date
      updatedAt?: Date
      deletedAt?: Date
    },
    id?: string,
  ) {
    super()
    this._id = id ?? randomUUID()
    this.props = props
  }

  get userId(): string {
    return this.props.userId
  }

  get categoryId(): string {
    return this.props.categoryId
  }

  get tagId(): string {
    return this.props.tagId
  }

  get tagName(): string {
    return this.props.tagName
  }

  get tagSlug(): string {
    return this.props.tagSlug
  }

  get userName(): string {
    return this.props.userName
  }

  get userImage(): string {
    return this.props.userImage
  }

  get userSlug(): string {
    return this.props.userSlug
  }

  get title(): string {
    return this.props.title
  }

  get slug(): string {
    return this.props.slug
  }

  get totalView(): number {
    return this.props.totalView
  }

  get isLive(): boolean {
    return this.props.isLive
  }

  set isLive(value: boolean) {
    this.props.isLive = value
  }

  get isChatEnabled(): boolean {
    return this.props.isChatEnabled
  }

  set isChatEnabled(value: boolean) {
    this.props.isChatEnabled = value
  }

  get isChatDelayed(): boolean {
    return this.props.isChatDelayed
  }

  get delayedSeconds(): string {
    return this.props.delayedSeconds
  }

  get isChatFollowersOnly(): boolean {
    return this.props.isChatFollowersOnly
  }

  get thumbnailPreviewImage(): string {
    return this.props.thumbnailPreviewImage
  }

  get themeColor(): string {
    return this.props.themeColor
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt
  }

  set updatedAt(value: Date | undefined) {
    this.props.updatedAt = value
  }

  set deletedAt(value: Date | undefined) {
    this.props.deletedAt = value
  }
  get ingressId(): string {
    return this.props.ingressId
  }
  set ingressId(value: string) {
    this.props.ingressId = value
  }
}
