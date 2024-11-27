import { randomUUID } from "crypto"
import { BaseEntity } from "src/common/entity"

export class Livestream extends BaseEntity {
  private props: {
    userId: string
    slug?: string
    totalView?: number
    isChatEnabled?: boolean
    isChatDelayed?: boolean
    delayedSeconds?: string
    isChatFollowersOnly?: boolean
    ingressId?: string
    startStreamAt?: Date
    endStreamAt?: Date
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
  }

  constructor(
    props: {
      userId: string
      slug: string
      totalView: number
      isChatEnabled: boolean
      isChatDelayed: boolean
      delayedSeconds: string
      isChatFollowersOnly: boolean
      ingressId?: string
      startStreamAt?: Date
      endStreamAt?: Date
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
  get startStreamAt(): Date {
    return this.props.startStreamAt
  }
  get endStreamAt(): Date {
    return this.props.endStreamAt
  }
  set startStreamAt(value: Date) {
    this.props.startStreamAt = value
  }
  set endStreamAt(value: Date) {
    this.props.endStreamAt = value
  }
  get userId(): string {
    return this.props.userId
  }

  get slug(): string {
    return this.props.slug
  }
  set slug(value: string) {
    this.props.slug = value
  }

  get totalView(): number {
    return this.props.totalView
  }
  set totalView(value: number) {
    this.props.totalView = value
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
