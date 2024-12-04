import { EUserPostVisibility } from "src/module/posts/domain/enum/posts.enum"
import { ImageResult } from "./image.result"

export interface PostResult {
  id: string
  createdAt: string
  visibility: EUserPostVisibility
  content: string
  images: ImageResult[]
  isShared?: boolean
  isTagged?: boolean
}
