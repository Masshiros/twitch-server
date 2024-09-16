import { IUserRepository } from 'src/users/domain/repository/user';
import { PrismaService } from '../prisma.service';
import { UserAggregate } from 'src/users/domain/aggregate';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async createUser(user: UserAggregate): Promise<void> {
    await this.prismaService.user.create({ data: user });
  }
  isEmailExisted: (email: string) => Promise<boolean>;
  isPhoneExisted: (phone: string) => Promise<boolean>;
  findById: (id: string) => Promise<UserAggregate | null>;
  findUserByEmailAndPassword: (
    email: string,
    password: string,
  ) => Promise<UserAggregate | null>;
  updateUserProfile: (user: UserAggregate) => Promise<UserAggregate | null>;
  updatePassword: (
    id: string,
    oldPassword: string,
    newPassword: string,
  ) => Promise<boolean>;
}
