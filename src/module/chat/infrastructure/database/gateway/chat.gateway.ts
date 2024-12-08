import { Server } from "http"
import { OnEvent } from "@nestjs/event-emitter"
import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets"
import { Events } from "libs/constants/events"
import { SocketEvents } from "libs/constants/socket-events"

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "chat",
})
export class ChatGateway implements OnGatewayConnection {
  handleConnection(client: any, ...args: any[]) {
    console.log("New Incoming Connection")
    console.log(client.id)
    client.emit("connected", { status: "good" })
  }
  @WebSocketServer()
  server: Server
  @SubscribeMessage(SocketEvents.Chat.SEND_MESSAGE)
  handleCreateMessage(@MessageBody() data: any) {
    console.log("Create message")
  }
  @OnEvent(Events.message.create)
  handleMessageCreatedEvent(payload: any) {
    console.log(payload)
  }
}
