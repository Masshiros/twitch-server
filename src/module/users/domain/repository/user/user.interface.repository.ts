import { JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt"
import { TokenPayload, UserFilters } from "src/common/interface"
import { type UserAggregate } from "../../aggregate"
import { Device } from "../../entity/devices.entity"
import { Livestream } from "../../entity/livestream.entity"
import { LoginHistory } from "../../entity/login-histories.entity"
import { Permission } from "../../entity/permissions.entity"
import { Role } from "../../entity/roles.entity"

export abstract class IUserRepository {
  // user
  createUser: (user: UserAggregate) => Promise<void>
  isEmailExisted: (email: string) => Promise<boolean>
  isPhoneExisted: (phone: string) => Promise<boolean>
  findById: (id: string) => Promise<UserAggregate | null>
  findByOtp: (otp: string) => Promise<UserAggregate | null>
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
  deleteTokenByDevice: (deviceId: string) => Promise<void>
  deleteUserToken: (userId: string) => Promise<void>
  // device
  createOrUpdateDevice: (device: Device) => Promise<void>
  deleteDevice: (deviceId: string) => Promise<void>
  deleteUserDevice: (userId: string) => Promise<void>
  getDevice: (deviceId: string) => Promise<Device | null>
  getAllDevices: (userId: string) => Promise<Device[] | null>
  // login histories
  createLoginHistory: (value: LoginHistory) => Promise<void>
  getLoginHistories: (userId: string) => Promise<LoginHistory[] | null>
  deleteLoginHistory: (id: string) => Promise<void>
  // roles
  getAllRolesWithPagination: ({
    limit,
    offset,
    orderBy,
    order,
  }: {
    limit: number
    offset: number
    orderBy: string
    order: "asc" | "desc"
  }) => Promise<Role[] | null>
  getRoleByName: (name: string) => Promise<Role | null>
  getRoleById: (id: string) => Promise<Role | null>
  assignRoleToUser: (role: Role, user: UserAggregate) => Promise<void>
  removeRoleFromUser: (role: Role, user: UserAggregate) => Promise<void>
  assignPermissionToRole: (role: Role, permission: Permission) => Promise<void>
  removePermissionFromRole: (
    role: Role,
    permission: Permission,
  ) => Promise<void>
  getUserRoles: (user: UserAggregate) => Promise<Role[] | null>
  getAllPermissionsWithPagination: ({
    limit,
    offset,
    orderBy,
    order,
  }: {
    limit: number
    offset: number
    orderBy: string
    order: "asc" | "desc"
  }) => Promise<Permission[] | null>
  getPermissionById: (id: string) => Promise<Permission | null>
  getRolePermissions: (role: Role) => Promise<Permission[] | null>
  getUserPermissions: (user: UserAggregate) => Promise<Permission[] | null>
}
