import { Category } from "src/module/categories/domain/entity/categories.entity"
import { Tag } from "src/module/categories/domain/entity/tags.entity"

export class LiveStreamInfoResponseDto {
  id: string
  userId: string
  userName: string
  userSlug: string
  bio: string
  followersCount: number
  followingsCount: number
  displayName: string
  title: string
  isLive: boolean
  livestreamCategories: Category[]
  livestreamTags: Tag[]
}
