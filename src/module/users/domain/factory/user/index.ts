import { randomUUID } from "crypto"
import { hashPassword, hashToken } from "utils/encrypt"
import { UserAggregate } from "../../aggregate"
import { Device } from "../../entity/devices.entity"
import { ExternalLink } from "../../entity/external-links.entity"
import { LoginHistory } from "../../entity/login-histories.entity"
import { Token } from "../../entity/tokens.entity"

// Define the types of parameters you'll pass to the factory
export type CreateUserAggregateParams = {
  id?: string

  email?: string
  name?: string
  slug?: string
  password?: string
  phoneNumber?: string
  dob?: Date
  emailVerifyToken?: string
  phoneVerifyToken?: string
  forgotPasswordToken?: string
  otpToken?: string
  isLive?: boolean
  isActive?: boolean
  is2FA?: boolean
  view?: number
  bio?: string
  avatar?: string
  lastUsernameChangeAt?: Date
  thumbnail?: string
  devices?: Device[]
  tokens?: Token[]
  loginHistories?: LoginHistory[]
  externalLinks?: ExternalLink[]
}

// UserFactory class responsible for creating UserAggregate
export class UserFactory {
  async createAggregate(
    params: CreateUserAggregateParams,
  ): Promise<UserAggregate> {
    return new UserAggregate(
      {
        name: params.name ?? "",
        displayName: params.name ?? "",
        slug: params.slug ?? "",
        email: params.email ?? "",
        password: (await hashPassword(params.password)) ?? "",
        phoneNumber: params.phoneNumber ?? "",
        dob: params.dob ?? new Date(),
        emailVerifyToken: (await hashToken(params.emailVerifyToken)) ?? "",
        phoneVerifyToken: params.phoneVerifyToken ?? "",
        forgotPasswordToken: params.forgotPasswordToken ?? "",
        otpToken: params.otpToken ?? "",
        isLive: params.isLive ?? false,
        isActive: params.isActive ?? true,
        is2FA: params.is2FA ?? false,
        view: params.view ?? 0,
        bio: params.bio ?? "",
        avatar: params.avatar ?? "",
        lastUsernameChangeAt: params.lastUsernameChangeAt ?? new Date(),
        thumbnail: params.thumbnail ?? "",
        devices: params.devices ?? [], // Default to empty arrays if undefined
        tokens: params.tokens ?? [],
        loginHistories: params.loginHistories ?? [],
        externalLinks: params.externalLinks ?? [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null, // Set deletedAt to null unless specified
      },
      params.id || randomUUID(), // Use provided id or generate a new UUID
    )
  }
}
