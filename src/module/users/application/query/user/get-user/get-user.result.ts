import { UserAggregate } from "src/module/users/domain/aggregate"

export class GetUserQueryResult {
  user: UserAggregate
  image: {
    url: string
    publicId: string
  }
}
