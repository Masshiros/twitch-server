type CreateScheduleGroupPostCommandParams = {
  userId: string
  groupId: string
  content: string
  images?: Express.Multer.File[] | null
  taggedGroupIds?: string[] | null
  taggedUserIds?: string[] | null
  scheduledAt: Date
  isPublic?: boolean
}
export class CreateScheduleGroupPostCommand {
  userId: string
  groupId: string
  content: string
  images: Express.Multer.File[]
  taggedGroupIds: string[]
  taggedUserIds: string[]
  scheduledAt: Date
  isPublic: boolean
  constructor(params: CreateScheduleGroupPostCommandParams) {
    this.userId = params.userId
    this.content = params.content
    this.groupId = params.groupId
    this.images = params.images ?? []
    this.taggedUserIds = params.taggedUserIds ?? []
    this.taggedGroupIds = params.taggedGroupIds ?? []
    this.isPublic = params.isPublic ?? false
    this.scheduledAt = params.scheduledAt
  }
}
