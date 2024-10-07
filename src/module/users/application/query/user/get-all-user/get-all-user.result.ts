import { UserAggregate } from "src/module/users/domain/aggregate"

export class GetAllUsersQueryResult {
  result: UserAggregate[] | null
}
