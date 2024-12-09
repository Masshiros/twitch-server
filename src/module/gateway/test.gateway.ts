import { Server } from "http"
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter"
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets"
import config from "libs/config"
import { Events } from "libs/constants/events"
import { AuthenticatedSocket } from "libs/constants/interface"
import { SocketEvents } from "libs/constants/socket-events"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { Socket } from "socket.io"
import { IGatewaySessionManager } from "src/gateway/gateway.session"
import { ImageService } from "src/module/image/application/image.service"
import { EImageType } from "src/module/image/domain/enum/image-type.enum"
import { AllNotificationEvent } from "src/module/notifications/domain/events/all-notification.event"
import { NotificationEmittedEvent } from "src/module/notifications/domain/events/notification-emitted.events"
import { INotificationRepository } from "src/module/notifications/domain/repositories/notification.interface.repository"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { ConversationCreateEvent } from "../chat/domain/events/conversation/conversation-create.event"
import { MessageCreateEvent } from "../chat/domain/events/message/message-create.event"
import { MessageDeleteEvent } from "../chat/domain/events/message/message-delete.event"
import { MessageUpdateEvent } from "../chat/domain/events/message/message-update.event"
import { IChatRepository } from "../chat/domain/repository/chat.interface.repository"
import { EFriendRequestStatus } from "../friends/domain/enum/friend-request-status.enum"
import { AcceptFriendRequestEvent } from "../friends/domain/event/accept-friend-request.event"
import { ListFriendRequestEvent } from "../friends/domain/event/list-friend-request.event"
import { ListFriendEvent } from "../friends/domain/event/list-friend.event"
import { RejectFriendRequestEvent } from "../friends/domain/event/reject-friend-request.event"
import { SendFriendRequestEvent } from "../friends/domain/event/send-friend-request.event"
import { IFriendRepository } from "../friends/domain/repository/friend.interface.repository"

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "test",
})
export class TestGateway implements OnGatewayConnection {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly userRepository: IUserRepository,
    private readonly chatRepository: IChatRepository,
    private readonly sessions: IGatewaySessionManager,
    private readonly imageService: ImageService,
    private readonly friendRepository: IFriendRepository,
    private readonly emitter: EventEmitter2,
  ) {}
  async handleConnection(client: AuthenticatedSocket, ...args: any[]) {
    try {
      // const token = client.handshake.auth.token.split(" ")[1]
      // // console.log(token)
      // // console.log(token)
      // if (!token) {
      //   client.disconnect()
      //   return "Authorization token missing"
      // }

      // const decoded = await this.userRepository.decodeToken(token, {
      //   secret: config.JWT_SECRET_ACCESS_TOKEN,
      // })

      // if (!decoded) {
      //   client.disconnect()
      //   return "jwt expired"
      // }

      // const user = await this.userRepository.findById(decoded.sub)

      // if (!user) {
      //   client.disconnect()
      //   return "User not found"
      // }
      const user = client?.user
      user.isOnline = true
      user.offlineAt = null
      this.sessions.setUserSocket(user.id, client)
      await this.userRepository.update(user)
      const friends = await this.friendRepository.getFriends(user)
      if (friends && friends.length !== 0) {
        const friendIds = friends.map((e) => e.friendId)
        this.emitter.emit(Events.friend.list, new ListFriendEvent(friendIds))
      }

      // console.log(this.sessions)
      if (user) {
        console.log(`${user.name} connected`)
        this.emitter.emit(
          Events.notification_all,
          new AllNotificationEvent(user.id),
        )
        this.emitter.emit(
          Events.friend_request.list,
          new ListFriendRequestEvent(user.id),
        )
      }
    } catch (error) {
      client.disconnect()
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async handleDisconnect(client: AuthenticatedSocket) {
    try {
      const user = client?.user
      user.isOnline = false
      user.offlineAt = new Date()
      this.sessions.removeUserSocket(user.id)
      await this.userRepository.update(user)
      const friends = await this.friendRepository.getFriends(user)
      if (friends && friends.length !== 0) {
        const friendIds = friends.map((e) => e.friendId)
        this.emitter.emit(Events.friend.list, new ListFriendEvent(friendIds))
      }

      // const userId = client.user?.id
      console.log(`User disconnected.`)
    } catch (error) {
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  @WebSocketServer()
  server: Server

  // friend request
  @OnEvent(Events.friend_request.send)
  async onFriendRequestSend(event: SendFriendRequestEvent) {
    const { request } = event
    const { senderId, receiverId, createdAt } = request
    const sender = await this.userRepository.findById(senderId)
    if (!sender || sender === undefined) {
      return
    }
    const senderImages = await this.imageService.getImageByApplicableId(
      sender?.id,
    )
    const senderAvatar = senderImages.find(
      (e) => e.imageType === EImageType.AVATAR,
    )
    const receiverSocket = this.sessions.getUserSocket(receiverId)
    if (receiverSocket)
      receiverSocket.emit("friendRequestReceived", {
        name: sender.name,
        createdAt,
        avatar: senderAvatar?.url ?? "",
        type: "FRIEND",
      })
  }
  @OnEvent(Events.friend_request.accept)
  async onFriendRequestAccept(event: AcceptFriendRequestEvent) {
    const { request } = event
    const { senderId, receiverId, createdAt } = request
    const receiver = await this.userRepository.findById(receiverId)
    if (!receiver || receiver === undefined) {
      return
    }
    const receiverImages = await this.imageService.getImageByApplicableId(
      receiver?.id,
    )
    const receiverAvatar = receiverImages.find(
      (e) => e.imageType === EImageType.AVATAR,
    )
    const senderSocket = this.sessions.getUserSocket(senderId)
    if (senderSocket)
      senderSocket.emit("friendRequestAccepted", {
        message: "Your friend request has been accepted",
        name: receiver.name,
        createdAt,
        avatar: receiverAvatar?.url ?? "",
        type: "FRIEND",
      })
  }
  @OnEvent(Events.friend_request.reject)
  async onFriendRequestReject(event: RejectFriendRequestEvent) {
    const { request } = event
    const { senderId, receiverId, createdAt } = request
    const sender = await this.userRepository.findById(senderId)
    if (!sender || sender === undefined) {
      return
    }
    const senderImages = await this.imageService.getImageByApplicableId(
      sender?.id,
    )
    const senderAvatar = senderImages.find(
      (e) => e.imageType === EImageType.AVATAR,
    )
    const senderSocket = this.sessions.getUserSocket(senderId)
    if (senderSocket)
      senderSocket.emit("friendRequestRejected", {
        message: "Your friend request has been rejected",
        name: sender.name,
        createdAt,
        avatar: senderAvatar?.url ?? "",
        type: "FRIEND",
      })
  }
  @OnEvent(Events.friend.list)
  async onGetOnlineFriends(event: ListFriendEvent) {
    const { userIds } = event
    await Promise.all(
      userIds.map(async (userId) => {
        const userSocket = this.sessions.getUserSocket(userId)
        const user = await this.userRepository.findById(userId)
        const friends = await this.friendRepository.getFriends(user)

        if (friends.length === 0) {
          userSocket.emit("onlineFriendsReceived", [])
        }
        const result = await Promise.all(
          friends.map(async (e) => {
            const friend = await this.userRepository.findById(e.friendId)
            const friendImages = await this.imageService.getImageByApplicableId(
              friend.id,
            )
            const friendAvatar = friendImages.find(
              (e) => e.imageType === EImageType.AVATAR,
            )
            return {
              friendId: friend?.id ?? "",
              friendName: friend?.name ?? "",
              friendDisplayname: friend?.displayName ?? "",
              friendAvatar: friendAvatar?.url ?? "",
              isOnline: friend?.isOnline,
              offlineAt: friend?.offlineAt,
            }
          }),
        )
        // console.log("usersocket", userSocket?.client)
        if (userSocket)
          userSocket?.emit("onlineFriendsReceived", { friendLists: result })
      }),
    )
  }
  @OnEvent(Events.friend_request.list)
  async onFriendRequestList(event: ListFriendRequestEvent) {
    const { receiverId } = event
    if (!receiverId || receiverId === undefined) {
      return
    }
    const receiver = await this.userRepository.findById(receiverId)
    if (!receiver) {
      return
    }
    const pendingFriendRequests =
      await this.friendRepository.getListFriendRequest(receiver)

    const result = await Promise.all(
      pendingFriendRequests.map(async (e) => {
        const sender = await this.userRepository.findById(e.senderId)
        const senderImages = await this.imageService.getImageByApplicableId(
          sender.id,
        )
        const senderAvatar = senderImages.find(
          (e) => e.imageType === EImageType.AVATAR,
        )
        return {
          id: sender.id,
          displayName: sender.displayName,
          name: sender.name,
          avatar: senderAvatar?.url ?? "",
          status: e.status,
          createdAt: e.createdAt,
        }
      }),
    )
    const receiverSocket = this.sessions.getUserSocket(receiverId)

    if (receiverSocket)
      receiverSocket.emit("friendRequestsList", {
        friends: result,
      })
  }
  // chat
  @OnEvent(Events.conversation.create)
  async onCreateConversation(event: ConversationCreateEvent) {
    const { conversation } = event
    const { receiverId } = conversation
    const receiverSocket = this.sessions.getUserSocket(receiverId)
    if (receiverSocket) receiverSocket.emit("newConversation", conversation)
  }
  @OnEvent(Events.message.create)
  async onCreateMessage(event: MessageCreateEvent) {
    const { message } = event
    const { conversationId, authorId } = message
    const conversation =
      await this.chatRepository.findConversationById(conversationId)
    if (!conversation) {
      return
    }
    const authorSocket = this.sessions.getUserSocket(authorId)
    const recipientId = conversation.receiverId
    const creatorId = conversation.creatorId
    const recipientSocket =
      authorId === creatorId
        ? this.sessions.getUserSocket(recipientId)
        : this.sessions.getUserSocket(authorId)
    if (authorSocket) authorSocket.emit("onMessage", message)
    if (recipientSocket) recipientSocket.emit("onMessage", message)
  }
  @OnEvent(Events.message.update)
  async onMessageUpdate(event: MessageUpdateEvent) {
    const { message } = event
    const { conversationId, authorId } = message
    const conversation =
      await this.chatRepository.findConversationById(conversationId)
    if (!conversation) {
      return
    }
    const authorSocket = this.sessions.getUserSocket(authorId)
    const recipientId = conversation.receiverId
    const creatorId = conversation.creatorId
    const recipientSocket =
      authorId === creatorId
        ? this.sessions.getUserSocket(recipientId)
        : this.sessions.getUserSocket(authorId)
    if (authorSocket) authorSocket?.emit("onMessageUpdate", message)
    if (recipientSocket) recipientSocket?.emit("onMessageUpdate", message)
  }
  @OnEvent(Events.message.delete)
  async onMessageDelete(event: MessageDeleteEvent) {
    const { message } = event
    const { conversationId, authorId } = message
    const conversation =
      await this.chatRepository.findConversationById(conversationId)
    if (!conversation) {
      return
    }
    const authorSocket = this.sessions.getUserSocket(authorId)
    const recipientId = conversation.receiverId
    const creatorId = conversation.creatorId
    const recipientSocket =
      authorId === creatorId
        ? this.sessions.getUserSocket(recipientId)
        : this.sessions.getUserSocket(authorId)
    if (authorSocket) authorSocket?.emit("onMessageDelete", message)
    if (recipientSocket) recipientSocket?.emit("onMessageDelete", message)
  }
  @SubscribeMessage("conversationJoin")
  onConversationJoin(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    const { conversationId } = data
    if (!conversationId || conversationId.length === 0) {
      socket.emit("error", { message: "Conversation not found" })
      return
    }
    socket.join(conversationId)
    socket.to(conversationId).emit("userJoin")
  }
  @SubscribeMessage("conversationLeave")
  onConversationLeave(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    const { conversationId } = data
    if (!conversationId || conversationId.length === 0) {
      socket.emit("error", { message: "Conversation not found" })
      return
    }
    socket.leave(conversationId)
    socket.to(conversationId).emit("userLeft")
  }
  @SubscribeMessage("typingStart")
  handleTypingStart(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { conversationId } = data
    if (!conversationId || conversationId.length === 0) {
      socket.emit("error", { message: "Conversation not found" })
      return
    }
    socket.to(conversationId).emit("typingStart")
  }
  @SubscribeMessage("typingEnd")
  handleTypingEnd(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { conversationId } = data
    if (!conversationId || conversationId.length === 0) {
      socket.emit("error", { message: "Conversation not found" })
      return
    }
    socket.to(conversationId).emit("typingEnd")
  }
}
