import { UserAggregate } from "src/users/domain/aggregate"
import { GetUserResponseDto } from "./get-user.response.dto"

export class GetAllUsersResponseDto {
  users: GetUserResponseDto[] | null
}
