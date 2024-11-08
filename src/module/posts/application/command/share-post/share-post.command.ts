import { ESharedType } from "src/module/posts/domain/enum/shared-type.enum"

type SharePostCommandParams = {
  postId: string
  sharedById: string
  sharedToId: string
  shareToType: ESharedType
  customContent?: string
}
export class SharePostCommand {
  postId: string
  sharedById: string
  sharedToId: string
  shareToType: ESharedType
  customContent?: string
  constructor(params: SharePostCommandParams) {
    this.postId = params.postId
    this.sharedById = params.sharedById
    this.sharedToId = params.sharedToId
    this.shareToType = params.shareToType
    this.customContent = params.customContent
  }
}
