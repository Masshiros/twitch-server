import { EUserPostVisibility } from "src/module/posts/domain/enum/posts.enum"

type CreateUserPostCommandParams = {
  userId: string
  content: string
  visibility?: EUserPostVisibility | null
  images?: Express.Multer.File[] | null
  taggedUserIds?: string[] | null
  listUserViewIds?: string[] | null
}
export class CreateUserPostCommand {
  userId: string
  content: string
  visibility: EUserPostVisibility
  images: Express.Multer.File[]
  taggedUserIds: string[]
  listUserViewIds: string[]
  constructor(params: CreateUserPostCommandParams) {
    this.userId = params.userId
    this.content = params.content
    this.visibility = params.visibility ?? EUserPostVisibility.PUBLIC
    this.images = params.images ?? []
    this.taggedUserIds = params.taggedUserIds ?? []
    this.listUserViewIds = params.listUserViewIds ?? []
  }
}
