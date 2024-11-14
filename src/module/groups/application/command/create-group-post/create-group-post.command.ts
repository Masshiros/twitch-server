type CreateGroupPostCommandParams = {
  userId: string
  groupId: string
  content: string
  images?: Express.Multer.File[] | null
  taggedGroupIds?: string[] | null
  taggedUserIds?: string[] | null
}
export class CreateGroupPostCommand {
  userId: string
  groupId: string
  content: string
  images: Express.Multer.File[]
  taggedGroupIds: string[]
  taggedUserIds: string[]
  constructor(params: CreateGroupPostCommandParams) {
    this.userId = params.userId
    this.content = params.content
    this.groupId = params.groupId
    this.images = params.images ?? []
    this.taggedUserIds = params.taggedUserIds ?? []
    this.taggedGroupIds = params.taggedGroupIds ?? []
  }
}
