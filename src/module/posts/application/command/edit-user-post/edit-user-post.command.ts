import { EUserPostVisibility } from "src/module/posts/domain/enum/posts.enum"

type EditUserPostCommandParams = {
  postId: string
  userId: string
  content?: string
  visibility?: EUserPostVisibility | null
  images?: Express.Multer.File[] | null
  taggedUserIds?: string[] | null
  listUserViewIds?: string[] | null
}
export class EditUserPostCommand {
  postId: string
  userId: string
  content?: string
  visibility?: EUserPostVisibility
  images?: Express.Multer.File[]
  taggedUserIds?: string[]
  listUserViewIds?: string[]

  constructor(params: EditUserPostCommandParams) {
    this.postId = params.postId
    this.userId = params.userId
    this.content = params.content ?? null
    this.visibility = params.visibility ?? EUserPostVisibility.PUBLIC
    this.images = params.images ?? []
    this.taggedUserIds = params.taggedUserIds ?? []
    this.listUserViewIds = params.listUserViewIds ?? []
  }
}
