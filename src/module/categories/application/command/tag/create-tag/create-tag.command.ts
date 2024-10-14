import { ETag } from "src/module/categories/domain/enum/tags.enum"

type CreateTagCommandParams = {
  name: string
  applicableTo: ETag
}
export class CreateTagCommand {
  name: string
  applicableTo: ETag
  constructor(params: CreateTagCommandParams) {
    this.name = params.name
    this.applicableTo = params.applicableTo
  }
}
