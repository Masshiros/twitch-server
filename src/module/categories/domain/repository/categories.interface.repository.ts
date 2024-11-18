import { Category } from "../entity/categories.entity"
import { Tag } from "../entity/tags.entity"

export abstract class ICategoriesRepository {
  // tag
  getAllTags: ({
    limit,
    offset,
    orderBy,
    order,
  }: {
    limit: number
    offset: number
    orderBy: string
    order: "asc" | "desc"
  }) => Promise<Tag[] | null>
  addTag: (tag: Tag) => Promise<void>
  removeTag: (tag: Tag) => Promise<void>
  updateTag: (data: Tag) => Promise<void>
  getTagBySlug: (slug: string) => Promise<Tag | null>
  getTagById: (id: string) => Promise<Tag | null>
  getTagsByCategory: (category: Category) => Promise<Tag[] | null>
  assignTagsToCategory: (tags: Tag[], category: Category) => Promise<void>
  // category
  getAllCategories: ({
    limit,
    offset,
    orderBy,
    order,
  }: {
    limit: number
    offset: number
    orderBy: string
    order: "asc" | "desc"
  }) => Promise<Category[] | null>
  addCategory: (category: Category) => Promise<void>
  removeCategory: (category: Category) => Promise<void>
  updateCategory: (data: Category) => Promise<void>
  getCategoryBySlug: (slug: string) => Promise<Category | null>
  getCategoryById: (id: string) => Promise<Category | null>
  getCategoriesByTag: (tag: Tag) => Promise<Category[] | null>
  // categories
  // getUserCategories: (userId: string) => Promise<Category[]>
}
