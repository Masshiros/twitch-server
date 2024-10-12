import { randomUUID } from "crypto"
import { BaseEntity } from "src/common/entity"
import { ECategory } from "../enum/categories.enum"
import { Tag } from "./tags.entity"

interface CategoryProps {
  currentTotalView?: number
  numberOfFollowers?: number
  name?: string
  slug?: string
  image?: string
  applicableTo?: ECategory
  tags?: Tag[]
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}
export class Category extends BaseEntity {
  private _currentTotalView: number
  private _numberOfFollowers: number
  private _name: string
  private _slug: string
  private _image: string
  private _tagId: string
  private _applicableTo: ECategory
  private _tags: Tag[]

  constructor(props: CategoryProps, id?: string) {
    super()
    this._id = id || randomUUID()
    this._currentTotalView = props.currentTotalView ?? 0
    this._numberOfFollowers = props.numberOfFollowers ?? 0
    this._name = props.name ?? ""
    this._slug = props.slug ?? ""
    ;(this._image = props.image ?? ""),
      (this._applicableTo = props.applicableTo ?? ECategory.USER)
    this._tags = props.tags
    this._createdAt = props.createdAt || new Date()
    this._updatedAt = props.updatedAt || new Date()
    this._deletedAt = props.deletedAt
  }
  get currentTotalView(): number {
    return this._currentTotalView
  }
  set currentTotalView(value: number) {
    this._currentTotalView = value
  }
  get numberOfFollowers(): number {
    return this._numberOfFollowers
  }
  set numberOfFollowers(value: number) {
    this._numberOfFollowers = value
  }
  get tagId(): string {
    return this._tagId
  }
  set tagId(value: string) {
    this._tagId = value
  }
  get name(): string {
    return this._name
  }
  set name(value: string) {
    this._name = value
  }
  get slug(): string {
    return this._slug
  }
  set slug(value: string) {
    this._slug = value
  }
  get image(): string {
    return this._image
  }
  set image(value: string) {
    this._image = value
  }
  get applicableTo(): ECategory {
    return this._applicableTo
  }
  set applicableTo(value: ECategory) {
    this._applicableTo = value
  }
  get tags(): Tag[] {
    return this._tags
  }
  addTag(tag: Tag) {
    if (!this._tags.find((t) => t.id === tag.id)) {
      this.tags.push(tag)
    }
  }
  removeTag(tag: Tag) {}
}
