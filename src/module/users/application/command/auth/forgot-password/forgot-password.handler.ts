import { CommandHandler } from "@nestjs/cqrs"
import config from "libs/config"
import { emailConfig } from "libs/constants/emails"
import { tokenType } from "libs/constants/enum"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { DomainError } from "libs/exception/domain"
import { InfrastructureError } from "libs/exception/infrastructure"
import NodemailerService from "src/integration/email/nodemailer/nodemailer.service"
import { UserFactory } from "src/module/users/domain/factory/user"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { EmailTemplate } from "src/module/users/domain/value-object/email-template.vo"
import { ForgotPasswordCommand } from "./forgot-password.command"

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordCommandHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
    private readonly emailService: NodemailerService,
  ) {}
  async execute(command: ForgotPasswordCommand) {
    const { emailOrPhone } = command
    try {
      if (!emailOrPhone) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Please input phone or email",
          info: {
            errorCode: CommandErrorDetailCode.EMAIL_OR_PHONE_CAN_NOT_BE_EMPTY,
          },
        })
      }
      const user = await this.userRepository.findByEmailOrPhone(emailOrPhone)
      if (!user) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "User not found",
          info: {
            errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
          },
        })
      }
      // sign forgot token
      const forgotToken = await this.userRepository.generateToken(
        {
          sub: user.id,
          tokenType: tokenType.ResetPasswordToken,
        },
        {
          secret: config.JWT_SECRET_FORGOT_PASSWORD_TOKEN,
          expiresIn: config.FORGOT_PASSWORD_TOKEN_EXPIRES_IN,
        },
      )
      // update user token
      user.forgotPasswordToken = forgotToken

      // send email
      const template = new EmailTemplate(
        emailConfig.passwordReset.subject,
        emailConfig.passwordReset.body,
      )
      const resetLink = `${config.APP_HOST}:${config.APP_PORT}/reset-password/${forgotToken}`
      const formattedTemplate = EmailTemplate.withResetLink(template, resetLink)
      await Promise.all([
        this.userRepository.update(user),
        this.emailService.sendMail({
          to: user.email,
          subject: formattedTemplate.getSubject(),
          html: formattedTemplate.getBody(),
        }),
      ])
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
