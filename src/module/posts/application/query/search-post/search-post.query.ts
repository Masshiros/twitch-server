type SearchPostQueryParams = {
  keyword: string
}
export class SearchPostQuery {
  keyword: string
  constructor(params: SearchPostQueryParams) {
    this.keyword = params.keyword
  }
}
