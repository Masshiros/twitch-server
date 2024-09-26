import { TokenPayload, UserFilters } from "src/common/interface"
import { type UserAggregate } from "../../aggregate"

export abstract class IUserRepository {
  // user
  createUser: (user: UserAggregate) => Promise<void>
  isEmailExisted: (email: string) => Promise<boolean>
  isPhoneExisted: (phone: string) => Promise<boolean>
  findById: (id: string) => Promise<UserAggregate | null>
  findByEmail: (email: string) => Promise<UserAggregate | null>
  findByUsername: (email: string) => Promise<UserAggregate | null>
  delete: (id: string) => Promise<void>
  updateUserProfile: (user: UserAggregate) => Promise<void>
  updatePassword: (
    id: string,
    oldPassword: string,
    newPassword: string,
  ) => Promise<void>
  // updateToken: (user: UserAggregate) => Promise<void>
  getAllWithPagination: (
    offset: number,
    limit: number,
    filters: UserFilters,
  ) => Promise<UserAggregate[] | null>
  generateToken: (payload: TokenPayload) => Promise<string>
  storeToken: (token: string) => Promise<void>
  decodeToken: (token: string) => Promise<TokenPayload>
  deleteToken: (token: string) => Promise<void>
}
