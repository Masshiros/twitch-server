type IsValidUserNameQueryParams = {
  username: string
}
export class IsValidUserNameQuery {
  username: string
  constructor(params: IsValidUserNameQueryParams) {
    this.username = params.username
  }
}
