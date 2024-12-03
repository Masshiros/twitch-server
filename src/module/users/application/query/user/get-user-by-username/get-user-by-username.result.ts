import { UserAggregate } from "src/module/users/domain/aggregate"

export class GetUserByUsernameResult {
  user: UserAggregate
  numberOfFollowers: number
  numberOfFollowings: number

  image: {
    url: string
    publicId: string
  }
}
