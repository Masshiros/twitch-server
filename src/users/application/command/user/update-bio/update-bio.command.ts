type UpdateBioCommandParams = {
  id?: string
  displayName?: string
  bio?: string
}
export class UpdateBioCommand {
  id: string
  readonly displayName: string
  readonly bio: string
  constructor(params: UpdateBioCommandParams) {
    this.id = params.id
    this.displayName = params.displayName
    this.bio = params.bio
  }
}
