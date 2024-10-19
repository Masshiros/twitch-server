import { randomUUID } from "crypto"
import { DomainError, DomainErrorCode } from "libs/exception/domain"
import { generateSlug } from "utils/string-format"
import { Category } from "../entity/categories.entity"
import { Tag } from "../entity/tags.entity"
import { ECategory } from "../enum/categories.enum"
import { ETag } from "../enum/tags.enum"

interface CreateCategoryProps {
  id?: string
  name: string
  slug?: string
  image?: string
  currentTotalView?: number
  numberOfFollowers?: number
  applicableTo?: ECategory
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  tags?: Tag[]
}
interface CreateTagProps {
  id?: string
  name: string
  slug?: string
  image?: string
  applicableTo?: ETag
  categories?: Category[]
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}
export class CategoriesFactory {
  static createCategory(params: CreateCategoryProps): Category {
    const category = new Category(
      {
        name: params.name,
        slug: generateSlug(params.name),
        image: params.image,
        applicableTo: params.applicableTo,
        currentTotalView: params.currentTotalView ?? 0,
        numberOfFollowers: params.numberOfFollowers ?? 0,
        tags: params.tags ?? [],
        createdAt: params.createdAt ?? new Date(),
        updatedAt: params.createdAt ?? null,
        deletedAt: params.deletedAt ?? null,
      },
      params.id ?? randomUUID(),
    )
    return category
  }

  static createTag(params: CreateTagProps): Tag {
    console.log(params)
    const tag = new Tag(
      {
        name: params.name,
        slug: generateSlug(params.name),
        applicableTo: params.applicableTo,
      },
      params.id ?? randomUUID(),
    )

    return tag
  }
}
