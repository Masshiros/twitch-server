import { UserAggregate } from "src/users/domain/aggregate"

export class GetAllUsersQueryResult {
  result: UserAggregate[] | null
}
