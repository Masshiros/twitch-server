type IsValidUserNameQueryParams = {
  userId: string
  username: string
}
export class IsValidUserNameQuery {
  userId: string
  username: string
  constructor(params: IsValidUserNameQueryParams) {
    this.userId = params.userId
    this.username = params.username
  }
}
