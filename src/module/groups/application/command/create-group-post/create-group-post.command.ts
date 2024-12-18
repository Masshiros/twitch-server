type CreateGroupPostCommandParams = {
  userId: string
  groupId: string
  content: string
  images?: Express.Multer.File[] | null
  taggedGroupIds?: string[] | null
  taggedUserIds?: string[] | null
  isPublic?: boolean
}
export class CreateGroupPostCommand {
  userId: string
  groupId: string
  content: string
  images: Express.Multer.File[]
  taggedGroupIds: string[]
  taggedUserIds: string[]
  isPublic: boolean
  constructor(params: CreateGroupPostCommandParams) {
    this.userId = params.userId
    this.content = params.content
    this.groupId = params.groupId
    this.images = params.images ?? []
    this.taggedUserIds = params.taggedUserIds ?? []
    this.taggedGroupIds = params.taggedGroupIds ?? []
    this.isPublic = params.isPublic ?? true
  }
}
