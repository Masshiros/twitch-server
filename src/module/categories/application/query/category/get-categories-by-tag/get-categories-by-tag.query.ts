type GetCategoriesByTagQueryParams = {
  tagId: string
}
export class GetCategoriesByTagQuery {
  tagId: string
  constructor(params: GetCategoriesByTagQueryParams) {
    this.tagId = params.tagId
  }
}
