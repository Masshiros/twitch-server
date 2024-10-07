import { CommandHandler } from "@nestjs/cqrs"
import { emailConfig } from "libs/constants/emails"
import { tokenType } from "libs/constants/enum"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "libs/exception/application/command"
import { TokenPayload } from "src/common/interface"
import NodemailerService from "src/integration/email/nodemailer/nodemailer.service"
import { IUserRepository } from "src/module/users/domain/repository/user"
import { EmailTemplate } from "src/module/users/domain/value-object/email-template.vo"
import { hashToken } from "utils/encrypt"
import { ResendVerifyEmailCommand } from "./resend-verify-email.command"

@CommandHandler(ResendVerifyEmailCommand)
export class ResendVerifyEmailCommandHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailService: NodemailerService,
  ) {}
  async execute(command: ResendVerifyEmailCommand): Promise<void> {
    const { id } = command

    // verify current user
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new CommandError({
        code: CommandErrorCode.BAD_REQUEST,
        message: "User not found",
        info: {
          errorCode: CommandErrorDetailCode.USER_NOT_FOUND,
        },
      })
    }
    // check whether the user is verified
    if (user.emailVerifyToken === "") {
      throw new CommandError({
        code: CommandErrorCode.BAD_REQUEST,
        message: "User email has been already verified before",
        info: {
          errorCode: CommandErrorDetailCode.EMAIL_VERIFIED_BEFORE,
        },
      })
    }
    // send email confirmation
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const hashedOtp = await hashToken(otp)
    if (!hashedOtp) {
      throw new CommandError({
        code: CommandErrorCode.BAD_REQUEST,
        message: "Error happen when generate otp. Try again later",
        info: {
          errorCode: CommandErrorDetailCode.OTP_CAN_NOT_BE_CREATED,
        },
      })
    }
    user.emailVerifyToken = hashedOtp

    // send email
    const template = new EmailTemplate(
      emailConfig.confirmEmail.subject,
      emailConfig.confirmEmail.body,
    )

    const formattedTemplate = EmailTemplate.withCode(template, otp)
    await Promise.all([
      this.emailService.sendMail({
        to: user.email,
        subject: formattedTemplate.getSubject(),
        html: formattedTemplate.getBody(),
      }),
      this.userRepository.update(user),
    ])
  }
}
