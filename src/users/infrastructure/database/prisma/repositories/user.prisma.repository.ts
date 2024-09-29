import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import bcrypt from "bcrypt"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { PrismaService } from "prisma/prisma.service"
import { TokenPayload, UserFilters } from "src/common/interface"
import { type UserAggregate } from "src/users/domain/aggregate"
import { Token } from "src/users/domain/entity/tokens.entity"
import { type IUserRepository } from "src/users/domain/repository/user"
import { TokenMapper } from "../mappers/token.prisma.mapper"
import { UserMapper } from "../mappers/user.prisma.mapper"

@Injectable()
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
      console.log(data)
      await this.prismaService.user.create({ data: data })
    } catch (error) {
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
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
      console.error(error)
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
  // async updateToken(user: UserAggregate): Promise<void> {
  //   try {
  //     const tokens = await this.prismaService.token.findMany({
  //       where: { id: { in: user.tokens.map((token) => token.id) } },
  //     })
  //     const updateOperations = user.tokens.map((domainToken) => {
  //       const matchingToken = tokens.find(
  //         (token) => token.id === domainToken.id,
  //       )

  //       if (matchingToken) {
  //         return this.prismaService.token.update({
  //           where: { id: domainToken.id },
  //           data: {
  //             token: domainToken.token,
  //             userId: user.id,
  //             // TODO: Update device module later
  //             deviceId: "device-id",
  //             expiresAt: domainToken.expiresAt,
  //             updatedAt: new Date(),
  //           },
  //         })
  //       }
  //       return null
  //     })
  //     await this.prismaService.$transaction(updateOperations.filter(Boolean))
  //   } catch (error) {
  //     if (error instanceof InfrastructureError) {
  //       throw error
  //     }
  //     throw new InfrastructureError({
  //       code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
  //       message: "Internal Server Error",
  //     })
  //   }
  // }
  async getAllWithPagination({
    limit = 1,
    offset = 0,
    filters = {},
  }: {
    limit: number
    offset: number
    filters: UserFilters
  }): Promise<UserAggregate[] | null> {
    try {
      // fetch users with filters

      const users = await this.prismaService.user.findMany({
        where: { ...filters },
        skip: offset,
        take: limit,

        select: {
          id: true,
        },
      })
      console.log(users)
      // return result
      const ids = users.map((user) => user.id)
      const queryUsers = await this.prismaService.user.findMany({
        where: { id: { in: ids } },
        orderBy: { createdAt: "desc" },
      })
      const results = queryUsers.map((e) => UserMapper.toDomain(e))
      return results ?? null
    } catch (error) {
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async generateToken(payload: TokenPayload): Promise<string> {
    try {
      return await this.jwtService.signAsync(payload)
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
  async decodeToken(token: string): Promise<TokenPayload> {
    try {
      return await this.jwtService.verifyAsync<TokenPayload>(token)
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
  async storeToken(token: string): Promise<void> {
    try {
      const [sub, deviceId] = await this.jwtService.verifyAsync(token)
      const tokenStored = new Token({
        userId: sub,
        token: token,
        deviceId: deviceId,
        // TODO(): handle jwt service later
        expiresAt: new Date(),
      })
      const data = TokenMapper.toPersistence(tokenStored)
      await this.prismaService.token.create({ data })
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
  async deleteToken(token: string) {
    try {
      const tokenFound = await this.prismaService.token.findFirst({
        where: { token },
      })
      await this.prismaService.token.delete({ where: { id: tokenFound.id } })
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
}
