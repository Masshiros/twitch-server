import { JwtService } from "@nestjs/jwt"
import bcrypt from "bcrypt"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { type UserAggregate } from "src/users/domain/aggregate"
import { type IUserRepository } from "src/users/domain/repository/user"
import { UserMapper } from "../mappers/user.prisma.mapper"
import { type PrismaService } from "../prisma.service"

export class PrismaUserRepository implements IUserRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async delete(id: string): Promise<void> {
    try {
      await this.prismaService.user.delete({ where: { id: id } })
    } catch (error) {
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      })
    }
  }
  async createUser(user: UserAggregate): Promise<void> {
    try {
      const data = UserMapper.toPersistence(user)
      await this.prismaService.user.create({ data: data })
    } catch (error) {
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      })
    }
  }
  async isEmailExisted(email: string): Promise<boolean> {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { email: email },
      })
      if (!user) {
        return false
      }
      return true
    } catch (error) {
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      })
    }
  }
  async isPhoneExisted(phone: string): Promise<boolean> {
    try {
      if (
        !(await this.prismaService.user.findFirst({
          where: { phoneNumber: phone },
        }))
      ) {
        return false
      }
      return true
    } catch (error) {
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      })
    }
  }
  async findById(id: string): Promise<UserAggregate | null> {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { id: id },
      })
      const data = UserMapper.toDomain(user)
      return data ?? null
    } catch (error) {
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      })
    }
  }
  async findByEmail(email: string): Promise<UserAggregate | null> {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { email: email },
      })
      const data = UserMapper.toDomain(user)
      return data ?? null
    } catch (error) {
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      })
    }
  }
  async findByUsername(username: string): Promise<UserAggregate | null> {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { name: username },
      })
      const data = UserMapper.toDomain(user)
      return data ?? null
    } catch (error) {
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      })
    }
  }
  async updateUserProfile(user: UserAggregate): Promise<void> {
    try {
      const { id, ...updateData } = user
      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: updateData,
      })
      if (!updatedUser) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.NOT_FOUND,
          message: "User not found",
        })
      }
    } catch (error) {
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      })
    }
  }
  async updatePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
      })

      if (!user) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.NOT_FOUND,
          message: "User not found",
        })
      }

      // Verify the old password
      const isMatch = await bcrypt.compare(oldPassword, user.password)
      if (!isMatch) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.BAD_REQUEST,
          message: "Old password is incorrect",
        })
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)

      await this.prismaService.user.update({
        where: { id },
        data: { password: hashedPassword },
      })
    } catch (error) {}
  }
  async generateToken(payload: any): Promise<string> {
    return await this.jwtService.signAsync(payload)
  }
}
