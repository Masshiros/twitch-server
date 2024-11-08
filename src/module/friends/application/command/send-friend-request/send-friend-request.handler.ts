import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { FriendFactory } from "src/module/friends/domain/factory/friend.factory"
import { IFriendRepository } from "src/module/friends/domain/repository/friend.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { SendFriendRequestCommand } from "./send-friend-request.command"

@CommandHandler(SendFriendRequestCommand)
export class SendFriendRequestHandler {
  constructor(
    private readonly friendRepository: IFriendRepository,
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(command: SendFriendRequestCommand) {
    const { senderId, receiverId } = command
    try {
      if (!senderId || senderId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Data from client can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
            field: "senderId",
          },
        })
      }
      if (!receiverId || receiverId.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Data from client can not be empty",
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
          code: CommandErrorCode.BAD_REQUEST,
          message: "Sender not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      if (!receiver) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
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
