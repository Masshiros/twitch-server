import { DomainError, DomainErrorCode } from "libs/exception/domain"
import { Follower } from "../entity/followers.entity"

interface CreateFollowerParams {
  sourceUserId: string
  destinationUserId: string
}

export class FollowerFactory {
  create(params: CreateFollowerParams): Follower {
    FollowerFactory.validateFollowerId(params.sourceUserId)
    FollowerFactory.validateFollowingId(params.destinationUserId)

    return new Follower(params.sourceUserId, params.destinationUserId)
  }

  private static validateFollowerId(sourceUserId: string): void {
    if (!sourceUserId) {
      throw new DomainError({
        code: DomainErrorCode.BAD_REQUEST,
        message: "SourceUserId must not be empty",
      })
    }
  }

  private static validateFollowingId(destinationUserId: string): void {
    if (!destinationUserId) {
      throw new DomainError({
        code: DomainErrorCode.BAD_REQUEST,
        message: "DestinationUserId must not be empty",
      })
    }
  }
}
