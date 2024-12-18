import { randomUUID } from "crypto"
import { hashPassword, hashToken } from "utils/encrypt"
import { generateSlug } from "../../../../../../utils/string-format"
import { UserAggregate } from "../../aggregate"
import { Device } from "../../entity/devices.entity"
import { ExternalLink } from "../../entity/external-links.entity"
import { Livestream } from "../../entity/livestream.entity"
import { LoginHistory } from "../../entity/login-histories.entity"
import { Role } from "../../entity/roles.entity"
import { Token } from "../../entity/tokens.entity"
import { EUserStatus } from "../../enum/user-status.enum"

export type CreateUserAggregateParams = {
  id?: string

  email?: string
  name?: string
  displayName?: string
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
  isOnline?: boolean
  offlineAt?: Date
  is2FA?: boolean
  view?: number
  bio?: string
  lastUsernameChangeAt?: Date
  thumbnail?: string
  serverUrl?: string
  streamKey?: string
  devices?: Device[]
  tokens?: Token[]
  loginHistories?: LoginHistory[]
  externalLinks?: ExternalLink[]
  roles?: Role[]
}
export type CreateLivestreamParams = {
  userId: string
  slug: string
  totalView: number
  isChatEnabled?: boolean
  isChatDelayed?: boolean
  delayedSeconds?: string
  isChatFollowersOnly?: boolean
  ingressId: string
  startStreamAt?: Date
  endStreamAt?: Date
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}
export class UserFactory {
  async createLivestream(params: CreateLivestreamParams): Promise<Livestream> {
    return new Livestream({
      userId: params.userId,
      slug: params.slug,
      totalView: params.totalView,
      isChatEnabled: params.isChatEnabled,
      isChatDelayed: params.isChatDelayed,
      delayedSeconds: params.delayedSeconds,
      isChatFollowersOnly: params.isChatFollowersOnly,
      ingressId: params.ingressId,
      startStreamAt: params.startStreamAt,
      endStreamAt: params.endStreamAt,
      createdAt: new Date(),
      updatedAt: params.updatedAt,
      deletedAt: params.deletedAt,
    })
  }
  async createAggregate(
    params: CreateUserAggregateParams,
  ): Promise<UserAggregate> {
    const name = params.name ?? ""
    const slug = name ? generateSlug(name) : ""
    return new UserAggregate(
      {
        name,
        displayName: params.displayName ?? "",
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
        isActive: params.isActive ?? true,
        is2FA: params.is2FA ?? false,
        isOnline: params.isOnline,
        offlineAt: params.offlineAt,
        view: params.view ?? 0,
        bio: params.bio ?? "",
        lastUsernameChangeAt: params.lastUsernameChangeAt,
        thumbnail: params.thumbnail ?? "",
        serverUrl: params.serverUrl,
        streamKey: params.streamKey,
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
