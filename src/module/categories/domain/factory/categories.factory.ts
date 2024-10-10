import { DomainError, DomainErrorCode } from "libs/exception/domain"
import { generateSlug } from "utils/string-format"
import { Category } from "../entity/categories.entity"
import { Tag } from "../entity/tags.entity"
import { ECategory } from "../enum/categories.enum"

interface CreateCategoryProps {
  name: string
  image?: string
  applicableTo?: ECategory
  tag: Tag
}

export class CategoryFactory {
  static createCategory(props: CreateCategoryProps): Category {
    if (!props.tag) {
      throw new DomainError({
        code: DomainErrorCode.BAD_REQUEST,
        message: "Tag must be provided to create a category",
      })
    }

    if (!props.name || props.name.length < 3) {
      throw new DomainError({
        code: DomainErrorCode.BAD_REQUEST,
        message: "Category name must be at least 3 characters long",
      })
    }

    const slug = generateSlug(props.name)

    return new Category({
      name: props.name,
      slug,
      image: props.image ?? "",
      applicableTo: props.applicableTo ?? ECategory.USER,
      tag: props.tag,
    })
  }
}
