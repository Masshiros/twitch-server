import { UserAggregate } from "src/module/users/domain/aggregate"

export class GetUserQueryResult {
  user: UserAggregate
  categoryNames: string[]
  image: {
    url: string
    publicId: string
  }
}
