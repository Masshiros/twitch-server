import { ImageResult } from "./image.result"
import { UserResult } from "./user.result"

export interface GroupPostResult {
  user: UserResult
  createdAt: string
  content: string
  images: ImageResult[]
  id: string
  isShared?: boolean
  isTagged?: boolean
}
