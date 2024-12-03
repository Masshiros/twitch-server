type GetUserByUserNameQueryParams = {
  username: string
}
export class GetUserByUserNameQuery {
  username: string
  constructor(params: GetUserByUserNameQueryParams) {
    this.username = params.username
  }
}
