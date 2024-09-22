import { BaseEntity } from "src/common/entity"

export class ExternalLink extends BaseEntity {
  private props: {
    title: string
    url: string
  }
  constructor(props: { title: string; url: string }) {
    super()
    this.props = props
  }
}
