type GetListDeviceQueryParams = {
  userId: string
}
export class GetListDeviceQuery {
  userId: string
  constructor(params: GetListDeviceQueryParams) {
    this.userId = params.userId
  }
}
