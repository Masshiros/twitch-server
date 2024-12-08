import { CommandHandler } from "@nestjs/cqrs"
import { CancelScheduleUserPostCommand } from "./cancel-schedule-user-post.command"

@CommandHandler(CancelScheduleUserPostCommand)
export class CancelScheduleUserPostHandler {
  constructor() {}
}
