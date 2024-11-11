import { CommandHandler } from "@nestjs/cqrs"
import { emailConfig } from "libs/constants/emails"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import NodemailerService from "src/integration/email/nodemailer/nodemailer.service"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { EmailTemplate } from "src/module/users/domain/value-object/email-template.vo"
import { ForgetUsernameCommand } from "./forget-username.command"

@CommandHandler(ForgetUsernameCommand)
export class ForgetUsernameHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailService: NodemailerService,
  ) {}
  async execute(command: ForgetUsernameCommand) {
    const { email } = command
    try {
      if (!email || email.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Email can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.DATA_FROM_CLIENT_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const user = await this.userRepository.findByEmailOrPhone(email)
      if (!user) {
        throw new CommandError({
          code: CommandErrorCode.NOT_FOUND,
          message: "User not found",
          info: {
            errorCode: CommandErrorDetailCode.NOT_FOUND,
          },
        })
      }
      const tempate = new EmailTemplate(
        emailConfig.forgetUsername.subject,
        emailConfig.forgetUsername.body,
      )
      const formattedTemplate = EmailTemplate.withUsername(tempate, user.name)
      await this.emailService.sendMail({
        to: user.email,
        subject: formattedTemplate.getSubject(),
        html: formattedTemplate.getBody(),
      })
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
