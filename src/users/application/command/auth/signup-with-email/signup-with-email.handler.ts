import { Injectable } from "@nestjs/common"
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs"
import { emailConfig } from "libs/constants/emails"
import { tokenType } from "libs/constants/enum"
import NodemailerService from "libs/integration/email/nodemailer/nodemailer.service"
import { TokenPayload } from "src/common/interface"
import { EmailTemplate } from "src/users/domain/value-object/email-template.vo"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "../../../../../../libs/exception/application/command"
import { DomainError } from "../../../../../../libs/exception/domain/index"
import { InfrastructureError } from "../../../../../../libs/exception/infrastructure/index"
import { mailRegex, passwordRegex } from "../../../../../../utils/constants"
import { hashPassword, hashToken } from "../../../../../../utils/encrypt"
import { type UserAggregate } from "../../../../domain/aggregate"
import { UserFactory } from "../../../../domain/factory/user"
import { IUserRepository } from "../../../../domain/repository/user/index"
import { SignupWithEmailCommand } from "./signup-with-email.command"
import { SignupWithEmailCommandResult } from "./signup-with-email.result"

@CommandHandler(SignupWithEmailCommand)
export class SignupWithEmailCommandHandler
  implements ICommandHandler<SignupWithEmailCommand>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
    private readonly emailService: NodemailerService,
  ) {}
  async execute(
    command: SignupWithEmailCommand,
  ): Promise<SignupWithEmailCommandResult> {
    const { email, password, name, dob } = command
    try {
      // validate email length
      if (email.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Email can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.EMAIL_CAN_NOT_BE_EMPTY,
          },
        })
      }
      // validate email exist
      if (await this.userRepository.isEmailExisted(email)) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Email already exists",
          info: {
            errorCode: CommandErrorDetailCode.EMAIL_ALREADY_EXIST,
          },
        })
      }
      // validate password length
      if (password.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Password can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.PASSWORD_CAN_NOT_BE_EMPTY,
          },
        })
      }
      // validate email regex
      if (!mailRegex.test(email)) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Invalid email, email must be in format xxx@yyyy.zzz",
          info: {
            errorCode: CommandErrorDetailCode.INVALID_USER_EMAIL,
          },
        })
      }
      // validate password regex
      if (!passwordRegex.test(password)) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message:
            "Invalid password, it must have at least 8 characters, at least one character and one number",
          info: {
            errorCode: CommandErrorDetailCode.INVALID_USER_PASSWORD,
          },
        })
      }
      const user: UserAggregate = this.userFactory.createAggregate({
        email: email,
        password: password,
      })

      user.email = email
      user.password = await hashPassword(password)
      user.name = name
      user.dob = dob

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
      // generate AT and RT
      const accessTokenPayload: TokenPayload = {
        sub: user.id,
        email: user.email,
        username: user.name,
        tokenType: tokenType.AccessToken,

        deviceId: "device-id",
        // add others later
      }
      const refreshTokenPayload: TokenPayload = {
        sub: user.id,
        email: user.email,
        username: user.name,

        deviceId: "device-id",
        tokenType: tokenType.RefreshToken,
        // add others later
      }

      const [accessToken, refreshToken] = await Promise.all([
        this.userRepository.generateToken(accessTokenPayload),
        this.userRepository.generateToken(refreshTokenPayload),
        this.emailService.sendMail({
          to: user.email,
          subject: formattedTemplate.getSubject(),
          html: formattedTemplate.getBody(),
        }),
        this.userRepository.createUser(user),
      ])
      return { accessToken, refreshToken }
    } catch (err) {
      console.error(err.stack)
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
