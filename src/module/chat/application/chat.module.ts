import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { ImageModule } from "src/module/image/application/image.module"
import { ImageService } from "src/module/image/application/image.service"
import { UserDatabaseModule } from "src/module/users/infrastructure/database/user.database.module"
import { ChatDatabaseModule } from "../infrastructure/database/chat.database.module"
import { ChatController } from "../presentation/chat.controller"
import { ChatService } from "./chat.service"
import { CreateConversationHandler } from "./command/create-conversation/create-conversation.handler"
import { CreateMessageHandler } from "./command/create-message/create-message.handler"
import { GetConversationsHandler } from "./query/get-conversations/get-conversations.handler"

const commandHandlers = [CreateConversationHandler, CreateMessageHandler]
const queryHandlers = [GetConversationsHandler]
@Module({
  controllers: [ChatController],
  imports: [CqrsModule, UserDatabaseModule, ChatDatabaseModule, ImageModule],

  providers: [ChatService, ...commandHandlers, ...queryHandlers],
})
export class ChatModule {}
