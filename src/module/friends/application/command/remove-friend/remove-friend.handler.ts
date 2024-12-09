import { CommandHandler } from "@nestjs/cqrs"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { Events } from "libs/constants/events"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { ListFriendEvent } from "src/module/friends/domain/event/list-friend.event"
import { IFriendRepository } from "src/module/friends/domain/repository/friend.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { RemoveFriendCommand } from "./remove-friend.command"

@CommandHandler(RemoveFriendCommand)
export class RemoveFriendHandler {
  constructor(
    private readonly friendRepository: IFriendRepository,
    private readonly userRepository: IUserRepository,
    private readonly emitter: EventEmitter2,
  ) {}
  async execute(command: RemoveFriendCommand) {
    const { userId, friendId } = command
    try {
      if (!userId || userId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "User id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "userId",
          },
        })
      }
      if (!friendId || friendId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Friend id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "friendId",
          },
        })
      }
      const [user, friend] = await Promise.all([
        this.userRepository.findById(userId),
        this.userRepository.findById(friendId),
      ])
      if (!user) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "User not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      if (!friend) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Friend not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      const [isFriend, existFriend] = await Promise.all([
        this.friendRepository.isFriend(user, friend),
        this.friendRepository.getFriend(user, friend),
      ])
      if (!isFriend && !existFriend) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "You are not friend with this person",
          info: {
            errorCode: CommandErrorDetailCode.ALREADY_EXIST,
          },
        })
      }
      await this.friendRepository.removeFriend(existFriend)
      this.emitter.emit(
        Events.friend.list,
        new ListFriendEvent([user.id, friend.id]),
      )
    } catch (err) {
      if (
        err instanceof DomainError ||
        err instanceof CommandError ||
        err instanceof InfrastructureError
      ) {
        throw err
      }

      throw new CommandError({
        code: CommandErrorCode.INTERNAL_SERVER_ERROR,
        message: err.message,
      })
    }
  }
}
