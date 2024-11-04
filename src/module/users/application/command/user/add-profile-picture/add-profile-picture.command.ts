type AddProfilePictureCommandParams = {
  userId: string
  picture: Express.Multer.File
}
export class AddProfilePictureCommand {
  userId: string
  picture: Express.Multer.File
  constructor(params: AddProfilePictureCommandParams) {
    this.picture = params.picture
    this.userId = params.userId
  }
}
