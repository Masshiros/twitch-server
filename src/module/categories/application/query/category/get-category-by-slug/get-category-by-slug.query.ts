type GetCategoryBySlugQueryParams = {
  slug: string
}
export class GetCategoryBySlugQuery {
  slug: string
  constructor(params: GetCategoryBySlugQueryParams) {
    this.slug = params.slug
  }
}
