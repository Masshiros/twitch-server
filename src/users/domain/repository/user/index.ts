import { UserAggregate } from '../../aggregate/user';

export abstract class IUserRepository {
  isEmailExisted: (email: string) => Promise<boolean>;
  isPhoneExisted: (phone: string) => Promise<boolean>;
  findById: (id: string) => Promise<UserAggregate | null>;
  updateUserProfile: (user: UserAggregate) => Promise<UserAggregate | null>;
  updatePassword: (
    id: string,
    oldPassword: string,
    newPassword: string,
  ) => Promise<boolean>;
  //TODO(feat) get categories of user
}
