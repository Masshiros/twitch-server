import { randomUUID } from "crypto"
import { BaseEntity } from "src/common/entity"
import { Category } from "./categories.entity"
import { Tag } from "./tags.entity"

interface TagsCategoriesProps {
  tagId: string
  categoryId: string
  tag: Tag
  category: Category
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class TagsCategories extends BaseEntity {
  private _tagId: string
  private _categoryId: string
  private _tag: Tag
  private _category: Category

  constructor(props: TagsCategoriesProps, id?: string) {
    super()
    this._id = id || randomUUID()
    this._tagId = props.tagId
    this._categoryId = props.categoryId
    this._tag = props.tag
    this._category = props.category
    this._createdAt = props.createdAt || new Date()
    this._updatedAt = props.updatedAt || new Date()
    this._deletedAt = props.deletedAt
  }

  // Getters and Setters
  get tag(): Tag {
    return this._tag
  }

  set tag(value: Tag) {
    this._tag = value
  }

  get category(): Category {
    return this._category
  }

  set category(value: Category) {
    this._category = value
  }
}
