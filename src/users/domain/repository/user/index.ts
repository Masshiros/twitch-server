import { JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt"
import { TokenPayload, UserFilters } from "src/common/interface"
import { type UserAggregate } from "../../aggregate"
import { Device } from "../../entity/devices.entity"
import { LoginHistory } from "../../entity/login-histories.entity"

export abstract class IUserRepository {
  // user
  createUser: (user: UserAggregate) => Promise<void>
  isEmailExisted: (email: string) => Promise<boolean>
  isPhoneExisted: (phone: string) => Promise<boolean>
  findById: (id: string) => Promise<UserAggregate | null>
  // findByEmail: (email: string) => Promise<UserAggregate | null>
  // findByPhone: (phone: string) => Promise<UserAggregate | null>
  findByEmailOrPhone: (emailOrPhone: string) => Promise<UserAggregate | null>
  findByUsername: (username: string) => Promise<UserAggregate | null>
  delete: (id: string) => Promise<void>
  update: (user: UserAggregate) => Promise<void>
  updatePassword: (
    id: string,
    oldPassword: string,
    newPassword: string,
  ) => Promise<void>
  // updateToken: (user: UserAggregate) => Promise<void>
  getAllWithPagination: ({
    limit,
    offset,
    filters,
  }: {
    limit: number
    offset: number
    filters: UserFilters
  }) => Promise<UserAggregate[] | null>
  generateToken: (
    payload: TokenPayload,
    options: JwtSignOptions,
  ) => Promise<string>
  storeToken: (token: string, options: JwtVerifyOptions) => Promise<void>
  decodeToken: (
    token: string,
    options: JwtVerifyOptions,
  ) => Promise<TokenPayload>
  deleteToken: (token: string) => Promise<void>
  // device
  createOrUpdateDevice: (device: Device) => Promise<void>
  deleteDevice: (deviceId: string) => Promise<void>
  getAllDevices: (userId) => Promise<Device[] | null>
  // login histories
  createLoginHistory: (value: LoginHistory) => Promise<void>
  getLoginHistories: (userId: string) => Promise<LoginHistory[] | null>
  deleteLoginHistory: (id: string) => Promise<void>
}
