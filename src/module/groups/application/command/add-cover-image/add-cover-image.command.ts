type AddCoverImageCommandParams = {
  userId: string
  groupId: string
  image: Express.Multer.File
}
export class AddCoverImageCommand {
  userId: string
  groupId: string
  image: Express.Multer.File
  constructor(params: AddCoverImageCommandParams) {
    this.userId = params.userId
    this.groupId = params.groupId
    this.image = params.image
  }
}
