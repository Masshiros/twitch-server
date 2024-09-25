import { UserAggregate } from "src/users/domain/aggregate"

export class GetAllUsersResponseDto {
  result: UserAggregate[] | null
}
