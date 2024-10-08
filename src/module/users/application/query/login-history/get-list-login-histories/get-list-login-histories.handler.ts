import { QueryHandler } from "@nestjs/cqrs"
import { QueryError, QueryErrorCode } from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { LoginHistory } from "src/module/users/domain/entity/login-histories.entity"
import { IUserRepository } from "src/module/users/domain/repository/user"
import { GetListDeviceQuery } from "../../device/get-list-device/get-list-device.query"

@QueryHandler(GetListDeviceQuery)
export class GetListDeviceQueryHandler {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(query: GetListDeviceQuery): Promise<LoginHistory[]> {
    const { userId } = query
    try {
      return await this.userRepository.getLoginHistories(userId)
    } catch (err) {
      if (err instanceof QueryError || err instanceof InfrastructureError) {
        throw err
      }
      throw new QueryError({
        code: QueryErrorCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      })
    }
  }
}
