type GetCategoryByIdQueryParams = {
  id: string
}

export class GetCategoryByIdQuery {
  id: string
  constructor(params: GetCategoryByIdQueryParams) {
    this.id = params.id
  }
}
