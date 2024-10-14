import { Tag } from "src/module/categories/domain/entity/tags.entity"

export class CategoryResponseDto {
  id: string
  name: string
  slug: string
  currentTotalView: number
  image: string
  tags: Tag[]
}
