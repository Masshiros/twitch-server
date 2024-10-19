type GetUserPermissionsQueryParams = {
  userId: string
}
export class GetUserPermissionsQuery {
  userId: string
  constructor(params: GetUserPermissionsQueryParams) {
    this.userId = params.userId
  }
}
