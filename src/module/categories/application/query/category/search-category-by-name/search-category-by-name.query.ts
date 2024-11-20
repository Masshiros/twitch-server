type SearchCategoryByNameQueryParams = {
  keyword: string
}
export class SearchCategoryByNameQuery {
  keyword: string
  constructor(params: SearchCategoryByNameQueryParams) {
    this.keyword = params.keyword
  }
}
