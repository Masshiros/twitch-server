import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { IUserRepository } from 'src/users/domain/repository/user';
import { PrismaUserRepository } from './prisma/repositories/user.prisma.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [PrismaService],
})
export class DatabaseModule {}
