type AddThumbnailCommandParams = {
  userId: string
  thumbnail: Express.Multer.File
}
export class AddThumbnailCommand {
  userId: string
  thumbnail: Express.Multer.File
  constructor(params: AddThumbnailCommandParams) {
    this.thumbnail = params.thumbnail
    this.userId = params.userId
  }
}
