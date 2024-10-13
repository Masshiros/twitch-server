import { Injectable } from "@nestjs/common"
import { JwtService, JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt"
import { Prisma } from "@prisma/client"
import bcrypt from "bcrypt"
import config from "libs/config"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { PrismaService } from "prisma/prisma.service"
import { TokenPayload, UserFilters } from "src/common/interface"
import { type UserAggregate } from "src/module/users/domain/aggregate"
import { Device } from "src/module/users/domain/entity/devices.entity"
import { LoginHistory } from "src/module/users/domain/entity/login-histories.entity"
import { Token } from "src/module/users/domain/entity/tokens.entity"
import { type IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { addTimeToNow } from "utils/date"
import { hashToken } from "utils/encrypt"
import { handlePrismaError } from "utils/prisma-error"
import { DeviceMapper } from "../mappers/device.mapper"
import { LoginHistoryMapper } from "../mappers/login-history.mapper"
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async createUser(user: UserAggregate): Promise<void> {
    try {
      const data = UserMapper.toPersistence(user)

      await this.prismaService.user.create({ data: data })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async findById(id: string): Promise<UserAggregate | null> {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { id: id },
      })
      if (!user) {
        return null
      }
      const data = UserMapper.toDomain(user)
      return data ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async findByOtp(otp: string): Promise<UserAggregate | null> {
    try {
      const hashedOtp = await hashToken(otp)
      const user = await this.prismaService.user.findFirst({
        where: { emailVerifyToken: hashedOtp },
      })
      if (!user) {
        return null
      }
      const data = UserMapper.toDomain(user)
      return data ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async findByEmail(email: string): Promise<UserAggregate | null> {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { email: email },
      })
      if (!user) {
        return null
      }
      const data = UserMapper.toDomain(user)
      return data ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async findByPhone(phone: string): Promise<UserAggregate | null> {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { phoneNumber: phone },
      })
      if (!user) {
        return null
      }
      const data = UserMapper.toDomain(user)
      return data ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async findByEmailOrPhone(
    emailOrPhone: string,
  ): Promise<UserAggregate | null> {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { OR: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }] },
      })
      if (!user) {
        return null
      }
      const data = UserMapper.toDomain(user)
      return data ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async findByUsername(username: string): Promise<UserAggregate | null> {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { name: username },
      })
      if (!user) {
        return null
      }
      const data = UserMapper.toDomain(user)
      return data ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async update(user: UserAggregate): Promise<void> {
    try {
      const { id } = user
      let foundUser = await this.prismaService.user.findUnique({
        where: { id },
      })

      if (!foundUser) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.NOT_FOUND,
          message: "User not found",
        })
      }
      foundUser = UserMapper.toPersistence(user)
      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: foundUser,
      })
      if (!updatedUser) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.BAD_REQUEST,
          message: "Update operation not work",
        })
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
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
      if (!users) {
        return null
      }
      // return result
      const ids = users.map((user) => user.id)
      const queryUsers = await this.prismaService.user.findMany({
        where: { id: { in: ids } },
        orderBy: { createdAt: "desc" },
      })
      if (!queryUsers) {
        return null
      }
      const results = queryUsers.map((e) => UserMapper.toDomain(e))
      return results ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async generateToken(
    payload: TokenPayload,
    options: JwtSignOptions,
  ): Promise<string> {
    try {
      return await this.jwtService.signAsync(payload, options)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      })
    }
  }
  async decodeToken(
    token: string,
    options: JwtVerifyOptions,
  ): Promise<TokenPayload> {
    try {
      return await this.jwtService.verifyAsync<TokenPayload>(token, options)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }

      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async storeToken(token: string, options: JwtVerifyOptions): Promise<void> {
    try {
      const { sub, deviceId } = await this.jwtService.verifyAsync<TokenPayload>(
        token,
        options,
      )
      // find token
      const foundToken = await this.prismaService.token.findFirst({
        where: { deviceId },
      })
      if (foundToken) {
        await this.prismaService.token.delete({
          where: { deviceId },
        })
      }
      const expiresAt = addTimeToNow(config.REFRESH_TOKEN_EXPIRES_IN)

      const tokenStored = new Token({
        userId: sub,
        token: token,
        deviceId: deviceId,
        expiresAt,
      })
      const data = TokenMapper.toPersistence(tokenStored)

      await this.prismaService.token.create({ data })
    } catch (error) {
      console.log(error)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async deleteTokenByDevice(deviceId: string) {
    try {
      const token = await this.prismaService.token.findFirst({
        where: { deviceId },
      })
      await this.prismaService.token.delete({ where: { id: token.id } })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async deleteUserToken(userId: string) {
    try {
      await this.prismaService.token.deleteMany({ where: { userId } })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async createOrUpdateDevice(device: Device): Promise<void> {
    try {
      const existingDevice = await this.prismaService.device.findFirst({
        where: { id: device.id },
      })
      console.log(existingDevice)
      const storedDevice = DeviceMapper.toPersistence(device)
      if (existingDevice) {
        await this.prismaService.device.update({
          where: { id: existingDevice.id },
          data: {
            ...storedDevice,
            lastUsed: new Date(),
          },
        })
      } else {
        await this.prismaService.device.create({
          data: {
            ...storedDevice,
            lastUsed: new Date(),
          },
        })
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async deleteDevice(deviceId: string): Promise<void> {
    try {
      await this.prismaService.device.delete({
        where: { id: deviceId },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async deleteUserDevice(userId: string): Promise<void> {
    try {
      await this.prismaService.device.deleteMany({ where: { userId } })
    } catch (error) {
      console.log(error)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getDevice(deviceId: string): Promise<Device> {
    try {
      const device = await this.prismaService.device.findFirst({
        where: { id: deviceId },
      })
      if (!device) {
        return null
      }
      return DeviceMapper.toDomain(device) ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getAllDevices(userId: string): Promise<Device[] | null> {
    try {
      const devicesList = await this.prismaService.device.findMany({
        where: { userId },
      })
      if (!devicesList || devicesList === null || devicesList.length === 0) {
        return null
      }
      const result = devicesList.map((device) => DeviceMapper.toDomain(device))
      return result ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }

  async createLoginHistory(value: LoginHistory): Promise<void> {
    try {
      const history = LoginHistoryMapper.toPersistence(value)
      await this.prismaService.loginHistory.create({ data: { ...history } })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async getLoginHistories(userId: string): Promise<LoginHistory[] | null> {
    try {
      const histories = await this.prismaService.loginHistory.findMany({
        where: { userId },
        orderBy: { loginAt: "desc" },
      })
      const result = histories.map((e) => LoginHistoryMapper.toDomain(e))
      return result ?? null
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
  async deleteLoginHistory(id: string): Promise<void> {
    try {
      await this.prismaService.loginHistory.delete({ where: { id: id } })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      if (error instanceof InfrastructureError) {
        throw error
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }
}
