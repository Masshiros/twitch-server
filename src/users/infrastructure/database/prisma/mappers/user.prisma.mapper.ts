// import { User as PrismaUser } from '@prisma/client';
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from 'libs/exception/infrastructure';
// import { UserAggregate } from 'src/users/domain/aggregate';

export class UserPrismaMapper {
  private constructor() {
    throw new InfrastructureError({
      code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
      message:
        'UserPrismaMapper is a static class and should not be instantiated',
    });
  }
}
