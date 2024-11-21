import { EUserPostVisibility } from "src/module/posts/domain/enum/posts.enum"

type CreateScheduleUserPostCommandParams = {
  userId: string
  content: string
  images?: Express.Multer.File[] | null
  taggedUserIds?: string[] | null
  scheduledAt: Date
  visibility?: EUserPostVisibility | null
  listUserViewIds?: string[] | null
}
export class CreateScheduleUserPostCommand {
  userId: string
  content: string
  images?: Express.Multer.File[] | null
  taggedUserIds?: string[] | null
  scheduledAt: Date
  visibility?: EUserPostVisibility | null
  listUserViewIds?: string[] | null

  constructor(params: CreateScheduleUserPostCommandParams) {
    this.userId = params.userId
    this.content = params.content
    this.images = params.images ?? []
    this.taggedUserIds = params.taggedUserIds ?? []
    this.visibility = params.visibility ?? EUserPostVisibility.PUBLIC
    this.listUserViewIds = params.listUserViewIds ?? []
    this.scheduledAt = params.scheduledAt
  }
}
