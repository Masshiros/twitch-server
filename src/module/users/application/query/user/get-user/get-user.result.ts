import { UserAggregate } from "src/module/users/domain/aggregate"

export class GetUserQueryResult {
  user: UserAggregate
  roleNames: string[]
  categoryNames: string[]
  numberOfFollowers: number
  numberOfFollowings: number
  image: {
    url: string
    publicId: string
  }
}
