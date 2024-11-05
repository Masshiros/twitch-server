import { UserAggregate } from "src/module/users/domain/aggregate"

export class GetAllUsersQueryResult {
  result:
    | {
        user: UserAggregate
        image: {
          url: string
          publicId: string
        } | null
      }[]
    | null
}
