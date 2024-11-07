import { CommandHandler } from "@nestjs/cqrs"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { FriendFactory } from "../../domain/factory/friend.factory"
import { IFriendRepository } from "../../domain/repository/friend.interface.repository"
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
