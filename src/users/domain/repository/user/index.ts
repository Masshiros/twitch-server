import { type UserAggregate } from "../../aggregate"

export abstract class IUserRepository {
  // user
  createUser: (user: UserAggregate) => Promise<void>
  isEmailExisted: (email: string) => Promise<boolean>
  isPhoneExisted: (phone: string) => Promise<boolean>
  findById: (id: string) => Promise<UserAggregate | null>
  findByEmail: (
    email: string,
   
  ) => Promise<UserAggregate | null>
  updateUserProfile: (user: UserAggregate) => Promise<UserAggregate | null>
  updatePassword: (
    id: string,
    oldPassword: string,
    newPassword: string,
  ) => Promise<void>
}
