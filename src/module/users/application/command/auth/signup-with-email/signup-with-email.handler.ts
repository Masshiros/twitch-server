import { Injectable } from "@nestjs/common"
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs"
import config from "libs/config"
import { emailConfig } from "libs/constants/emails"
import { tokenType } from "libs/constants/enum"
import { Roles } from "libs/constants/roles"
import { TokenPayload } from "src/common/interface"
import NodemailerService from "src/integration/email/nodemailer/nodemailer.service"
import { Role } from "src/module/users/domain/entity/roles.entity"
import { EmailTemplate } from "src/module/users/domain/value-object/email-template.vo"
import {
  CommandError,
  CommandErrorCode,
  CommandErrorDetailCode,
} from "../../../../../../../libs/exception/application/command"
import { DomainError } from "../../../../../../../libs/exception/domain/index"
import { InfrastructureError } from "../../../../../../../libs/exception/infrastructure/index"
import { mailRegex, passwordRegex } from "../../../../../../../utils/constants"
import { hashPassword, hashToken } from "../../../../../../../utils/encrypt"
import { type UserAggregate } from "../../../../domain/aggregate"
import { UserFactory } from "../../../../domain/factory/user"
import { IUserRepository } from "../../../../domain/repository/user/user.interface.repository"
import { SignupWithEmailCommand } from "./signup-with-email.command"

@CommandHandler(SignupWithEmailCommand)
export class SignupWithEmailCommandHandler
  implements ICommandHandler<SignupWithEmailCommand>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
    private readonly emailService: NodemailerService,
  ) {}
  async execute(command: SignupWithEmailCommand) {
    const { email, password, name, dob } = command
    try {
      // validate user name length
      if (!name || name.length === 0) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Username can not be empty",
          info: {
            errorCode: CommandErrorDetailCode.USERNAME_CAN_NOT_BE_EMPTY,
          },
        })
      }
      // validate user name exist
      if (await this.userRepository.findByUsername(name)) {
        throw new CommandError({
          code: CommandErrorCode.BAD_REQUEST,
          message: "Username is unavailable",
          info: {
            errorCode: CommandErrorDetailCode.USERNAME_EXIST,
          },
        })
      }
      if (email.length === 0) {
        // validate email length
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
            "Invalid password, it must have at least 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
          info: {
            errorCode: CommandErrorDetailCode.INVALID_USER_PASSWORD,
          },
        })
      }

      // send email confirmation
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      const userRole = await this.userRepository.getRoleByName(Roles.User)
      const user: UserAggregate = await this.userFactory.createAggregate({
        email: email,
        password: password,
        name: name,
        dob: dob,
        emailVerifyToken: otp,
        roles: [userRole],
      })

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
        this.userRepository.createUser(user),
      ])
      await Promise.all(
        user.roles.map((role) => {
          this.userRepository.assignRoleToUser(role, user)
        }),
      )
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
