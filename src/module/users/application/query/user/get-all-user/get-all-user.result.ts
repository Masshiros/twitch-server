import { UserAggregate } from "src/module/users/domain/aggregate"

export class GetAllUsersQueryResult {
  result:
    | {
        user: UserAggregate
        roles: string[]
        image: {
          url: string
          publicId: string
        } | null
      }[]
    | null
}
