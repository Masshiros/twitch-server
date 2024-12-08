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
import { ListFriendRequestEvent } from "src/module/friends/domain/event/list-friend-request.event"
import { SendFriendRequestEvent } from "src/module/friends/domain/event/send-friend-request.event"
import { FriendFactory } from "src/module/friends/domain/factory/friend.factory"
import { IFriendRepository } from "src/module/friends/domain/repository/friend.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { SendFriendRequestCommand } from "./send-friend-request.command"

@CommandHandler(SendFriendRequestCommand)
export class SendFriendRequestHandler {
  constructor(
    private readonly friendRepository: IFriendRepository,
    private readonly userRepository: IUserRepository,
    private readonly emitter: EventEmitter2,
  ) {}
  async execute(command: SendFriendRequestCommand) {
    const { senderId, receiverId } = command
    try {
      if (!senderId || senderId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Sender id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "senderId",
          },
        })
      }
      if (!receiverId || receiverId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Receiver id can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "receiverId",
          },
        })
      }
      if (receiverId === senderId) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "You can not send friend request to yourself",
        })
      }
      const [sender, receiver] = await Promise.all([
        this.userRepository.findById(senderId),
        this.userRepository.findById(receiverId),
      ])
      if (!sender) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Sender not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      if (!receiver) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "Receiver not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      // check is friend
      const isFriend = await this.friendRepository.isFriend(sender, receiver)
      if (isFriend) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Already friend",
          info: {
            errorCode: CommandErrorDetailCode.ALREADY_EXIST,
          },
        })
      }
      const friendRequest = FriendFactory.createFriendRequest({
        senderId: sender.id,
        receiverId: receiver.id,
      })
      if (!friendRequest) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Cannot send request",
          info: {
            errorCode: CommandErrorDetailCode.SOMETHING_WRONG_HAPPEN,
          },
        })
      }

      await this.friendRepository.sendFriendRequest(friendRequest)

      //TODO(notify): Send notification
      this.emitter.emit(
        Events.friend_request.send,
        new SendFriendRequestEvent(friendRequest),
      )
      this.emitter.emit(
        Events.friend_request.list,
        new ListFriendRequestEvent(friendRequest.receiverId),
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
