type UpdateProfilePictureCommandParams = {
  userId: string
  picture: Express.Multer.File
}
export class UpdateProfilePictureCommand {
  userId: string
  picture: Express.Multer.File
  constructor(params: UpdateProfilePictureCommandParams) {
    this.picture = params.picture
    this.userId = params.userId
  }
}
