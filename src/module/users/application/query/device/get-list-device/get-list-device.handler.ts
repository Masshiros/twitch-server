import { QueryHandler } from "@nestjs/cqrs"
import { QueryError, QueryErrorCode } from "libs/exception/application/query"
import { InfrastructureError } from "libs/exception/infrastructure"
import { Device } from "src/module/users/domain/entity/devices.entity"
import { IUserRepository } from "src/module/users/domain/repository/user"
import { GetListDeviceQuery } from "./get-list-device.query"

@QueryHandler(GetListDeviceQuery)
export class GetListDeviceQueryHandler {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(query: GetListDeviceQuery): Promise<Device[] | null> {
    const { userId } = query
    try {
      return await this.userRepository.getAllDevices(userId)
    } catch (err) {
      console.error(err.stack)
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
