import { randomUUID } from "crypto"
import { DomainError, DomainErrorCode } from "libs/exception/domain"
import { generateSlug } from "utils/string-format"
import { Category } from "../entity/categories.entity"
import { Tag } from "../entity/tags.entity"
import { ECategory } from "../enum/categories.enum"
import { ETag } from "../enum/tags.enum"

interface CreateCategoryProps {
  name: string
  slug: string
  image?: string
  applicableTo?: ECategory
  tags?: Tag[]
}
interface CreateTagProps {
  name: string
  slug: string
  image?: string
  applicableTo?: ETag
  categories: Category[]
}
export class CategoriesFactory {
  static createCategory(params: CreateCategoryProps): Category {
    const category = new Category(
      {
        name: params.name,
        slug: generateSlug(params.name),
        image: params.image,
        applicableTo: params.applicableTo,
        currentTotalView: 0,
        numberOfFollowers: 0,
        tags: params.tags ?? [],
      },
      randomUUID(),
    )
    return category
  }

  static createTag(params: CreateTagProps): Tag {
    const tag = new Tag(
      {
        name: params.name,
        slug: generateSlug(params.name),
        applicableTo: params.applicableTo,
      },
      randomUUID(),
    )
    return tag
  }
}
