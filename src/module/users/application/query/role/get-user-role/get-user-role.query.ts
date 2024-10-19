type GetUserRoleQueryParams = {
  userId: string
}
export class GetUserRoleQuery {
  userId: string
  constructor(params: GetUserRoleQueryParams) {
    this.userId = params.userId
  }
}
