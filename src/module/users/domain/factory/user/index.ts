import { randomUUID } from "crypto"
import { hashPassword, hashToken } from "utils/encrypt"
import { generateSlug } from "../../../../../../utils/string-format"
import { UserAggregate } from "../../aggregate"
import { Device } from "../../entity/devices.entity"
import { ExternalLink } from "../../entity/external-links.entity"
import { LoginHistory } from "../../entity/login-histories.entity"
import { Role } from "../../entity/roles.entity"
import { Token } from "../../entity/tokens.entity"
import { EUserStatus } from "../../enum/user-status.enum"

export type CreateUserAggregateParams = {
  id?: string

  email?: string
  name?: string
  slug?: string
  password?: string
  phoneNumber?: string
  dob?: Date
  status?: EUserStatus
  emailVerifyToken?: string
  phoneVerifyToken?: string
  forgotPasswordToken?: string
  otpToken?: string
  isLive?: boolean
  isActive?: boolean
  is2FA?: boolean
  view?: number
  bio?: string
  lastUsernameChangeAt?: Date
  thumbnail?: string
  devices?: Device[]
  tokens?: Token[]
  loginHistories?: LoginHistory[]
  externalLinks?: ExternalLink[]
  roles?: Role[]
}

export class UserFactory {
  async createAggregate(
    params: CreateUserAggregateParams,
  ): Promise<UserAggregate> {
    const name = params.name ?? ""
    const slug = name ? generateSlug(name) : ""
    return new UserAggregate(
      {
        name,
        displayName: params.name ?? "",
        slug,
        email: params.email ?? "",
        password: (await hashPassword(params.password)) ?? "",
        phoneNumber: params.phoneNumber ?? "",
        dob: params.dob ?? new Date(),
        status: params.status ?? EUserStatus.UNVERIFIED,
        emailVerifyToken: (await hashToken(params.emailVerifyToken)) ?? "",
        phoneVerifyToken: params.phoneVerifyToken ?? "",
        forgotPasswordToken: params.forgotPasswordToken ?? "",
        otpToken: params.otpToken ?? "",
        isLive: params.isLive ?? false,
        isActive: params.isActive ?? true,
        is2FA: params.is2FA ?? false,
        view: params.view ?? 0,
        bio: params.bio ?? "",
        lastUsernameChangeAt: params.lastUsernameChangeAt ?? new Date(),
        thumbnail: params.thumbnail ?? "",
        devices: params.devices ?? [],
        tokens: params.tokens ?? [],
        loginHistories: params.loginHistories ?? [],
        externalLinks: params.externalLinks ?? [],
        roles: params.roles ?? [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      params.id || randomUUID(),
    )
  }
}
