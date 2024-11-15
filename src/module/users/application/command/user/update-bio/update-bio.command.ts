type UpdateBioCommandParams = {
  id?: string
  bio?: string
}
export class UpdateBioCommand {
  id: string
  readonly bio: string
  constructor(params: UpdateBioCommandParams) {
    this.id = params.id
    this.bio = params.bio
  }
}
