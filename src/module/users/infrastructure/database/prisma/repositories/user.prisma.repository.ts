import { Injectable } from "@nestjs/common"
import { JwtService, JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt"
import { Prisma, User } from "@prisma/client"
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
import { LiveStreamInfo } from "src/module/users/domain/entity/live-stream-info.entity"
import { Livestream } from "src/module/users/domain/entity/livestream.entity"
import { LoginHistory } from "src/module/users/domain/entity/login-histories.entity"
import { Permission } from "src/module/users/domain/entity/permissions.entity"
import { Role } from "src/module/users/domain/entity/roles.entity"
import { Token } from "src/module/users/domain/entity/tokens.entity"
import { type IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"
import { addTimeToNow } from "utils/date"
import { hashToken } from "utils/encrypt"
import { handlePrismaError } from "utils/prisma-error"
import { DeviceMapper } from "../mappers/device.mapper"
import { LiveStreamInfoMapper } from "../mappers/live-stream-info.mapper"
import { LivestreamMapper } from "../mappers/livestream.mapper"
import { LoginHistoryMapper } from "../mappers/login-history.mapper"
import { PermissionMapper } from "../mappers/permission.mapper"
import { RoleMapper } from "../mappers/role.mapper"
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
      console.log(username)
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
      // console.log(user)
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
    filters: any
  }): Promise<UserAggregate[] | null> {
    try {
      // fetch users with filters
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined),
      )
      const whereConditions = {
        AND: Object.entries(cleanedFilters).map(([key, value]) => {
          return { [key]: value }
        }),
      }

      console.log(cleanedFilters)
      console.log(whereConditions)
      const users = await this.prismaService.user.findMany({
        where: { ...whereConditions },
        ...(offset !== null ? { skip: offset } : {}),
        ...(limit !== null ? { take: limit } : {}),

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
      if (!histories) {
        return null
      }
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

  async getAllRolesWithPagination({
    limit,
    offset = 0,
    orderBy = "createdAt",
    order = "desc",
  }: {
    limit: number
    offset: number
    orderBy: string
    order: "asc" | "desc"
  }): Promise<Role[] | null> {
    try {
      const finalOrderBy = orderBy ?? "createdAt"
      const finalOrder = order ?? "desc"
      const roles = await this.prismaService.role.findMany({
        where: { deletedAt: null },
        ...(offset !== null ? { skip: offset } : {}),
        ...(limit !== null ? { take: limit } : {}),
        select: {
          id: true,
        },
      })
      if (!roles) {
        return null
      }
      const ids = roles.map((role) => role.id)
      const queryRole = await this.prismaService.role.findMany({
        where: { id: { in: ids } },
        orderBy: { [finalOrderBy]: finalOrder },
      })
      if (!queryRole) {
        return null
      }
      const result = queryRole.map((e) => {
        const role = RoleMapper.toDomain(e)
        return role
      })
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

  async getRoleByName(name: string): Promise<Role | null> {
    try {
      const role = await this.prismaService.role.findUnique({ where: { name } })
      if (!role) {
        return null
      }
      return RoleMapper.toDomain(role) ?? null
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

  async getRoleById(id: string): Promise<Role | null> {
    try {
      const role = await this.prismaService.role.findUnique({ where: { id } })
      if (!role) {
        return null
      }
      return RoleMapper.toDomain(role) ?? null
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

  async assignRoleToUser(role: Role, user: UserAggregate): Promise<void> {
    try {
      const existingUser = await this.prismaService.user.findFirst({
        where: { id: user.id },
      })

      if (!existingUser) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.BAD_REQUEST,
          message: "User does not exist",
        })
      }
      // const existingUserRole = await this.prismaService.userRole.findFirst({
      //   where: {
      //     roleId: role.id,
      //     userId: user.id,
      //   },
      // })
      await this.prismaService.userRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: role.id,
          },
        },
        create: {
          userId: user.id,
          roleId: role.id,
        },
        update: {},
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

  async removeRoleFromUser(role: Role, user: UserAggregate): Promise<void> {
    try {
      await this.prismaService.userRole.deleteMany({
        where: {
          roleId: role.id,
          userId: user.id,
        },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }

  async assignPermissionToRole(
    role: Role,
    permission: Permission,
  ): Promise<void> {
    try {
      const existingRole = await this.prismaService.role.findUnique({
        where: { id: role.id },
      })
      if (!existingRole) {
        throw new InfrastructureError({
          code: InfrastructureErrorCode.BAD_REQUEST,
          message: "Role does not exist",
        })
      }
      // const existingRolePermission =
      //   await this.prismaService.rolePermission.findFirst({
      //     where: {
      //       roleId: role.id,
      //       permissionId: permission.id,
      //     },
      //   })

      await this.prismaService.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
        update: {},
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

  async removePermissionFromRole(
    role: Role,
    permission: Permission,
  ): Promise<void> {
    try {
      await this.prismaService.rolePermission.deleteMany({
        where: {
          roleId: role.id,
          permissionId: permission.id,
        },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error)
      }
      throw new InfrastructureError({
        code: InfrastructureErrorCode.INTERNAL_SERVER_ERROR,
        message: error.message,
      })
    }
  }

  async getUserRoles(user: UserAggregate): Promise<Role[] | null> {
    try {
      const userRoles = await this.prismaService.userRole.findMany({
        where: {
          userId: user.id,
        },
      })
      const roles = await Promise.all(
        userRoles.map(async (e) => {
          const role = await this.prismaService.role.findUnique({
            where: {
              id: e.roleId,
            },
          })
          if (!role) {
            return null
          }
          return role
        }),
      )
      const result = roles.map((role) => RoleMapper.toDomain(role))
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

  async getAllPermissionsWithPagination({
    limit,
    offset = 0,
    orderBy = "createdAt",
    order = "desc",
  }: {
    limit: number
    offset: number
    orderBy: string
    order: "asc" | "desc"
  }): Promise<Permission[] | null> {
    try {
      const permissions = await this.prismaService.permission.findMany({
        where: { deletedAt: null },
        ...(offset !== null ? { skip: offset } : {}),
        ...(limit !== null ? { take: limit } : {}),
        select: {
          id: true,
        },
      })
      if (!permissions) {
        return null
      }
      const ids = permissions.map((permission) => permission.id)
      const queryPermission = await this.prismaService.permission.findMany({
        where: { id: { in: ids } },
        ...(orderBy !== null ? { orderBy: { [orderBy]: order } } : {}),
      })
      if (!queryPermission) {
        return null
      }
      const result = queryPermission.map((e) => {
        const permission = PermissionMapper.toDomain(e)
        return permission
      })
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

  async getPermissionById(id: string): Promise<Permission | null> {
    try {
      const permission = await this.prismaService.permission.findUnique({
        where: { id },
      })
      if (!permission) {
        return null
      }
      return PermissionMapper.toDomain(permission) ?? null
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

  async getRolePermissions(role: Role): Promise<Permission[] | null> {
    try {
      const rolePermission = await this.prismaService.rolePermission.findMany({
        where: {
          roleId: role.id,
        },
      })
      const permissions = await Promise.all(
        rolePermission.map(async (e) => {
          const permission = await this.prismaService.permission.findFirst({
            where: {
              id: e.permissionId,
            },
          })
          return permission ? PermissionMapper.toDomain(permission) : null
        }),
      )
      const uniquePermissions = Array.from(
        new Set(permissions.filter((p) => p !== null).map((p) => p!.id)),
      ).map((id) => permissions.find((p) => p?.id === id))
      return uniquePermissions ?? null
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

  async getUserPermissions(user: UserAggregate): Promise<Permission[] | null> {
    try {
      const roles = await this.getUserRoles(user)
      if (!roles) {
        return null
      }
      const allPermissions: Permission[] = []
      await Promise.all(
        roles.map(async (e) => {
          const permissions = await this.getRolePermissions(e)
          if (!permissions) {
            return null
          }
          permissions.forEach((e) => allPermissions.push(e))
        }),
      )
      const uniquePermissions = Array.from(
        new Set(allPermissions.map((permission) => permission.id)),
      ).map((id) => allPermissions.find((permission) => permission.id === id))
      return uniquePermissions ?? null
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
  async updateLivestream(livestream: Livestream): Promise<void> {
    try {
      const data = LivestreamMapper.toPersistence(livestream)

      await this.prismaService.livestream.update({
        where: { id: data.id },
        data: data,
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
  async updateLivestreamInfo(livestreamInfo: LiveStreamInfo): Promise<void> {
    try {
      const data = LiveStreamInfoMapper.toPersistence(livestreamInfo)
      await this.prismaService.liveStreamInfo.update({
        where: { id: data.id },
        data: data,
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
  async findLivestreamById(id: string): Promise<Livestream> {
    try {
      const livestream = await this.prismaService.livestream.findUnique({
        where: { id },
      })
      if (!livestream) {
        return null
      }
      return LivestreamMapper.toDomain(livestream) ?? null
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
  async findLivestreamByIngressId(ingressId: string): Promise<Livestream> {
    try {
      const livestream = await this.prismaService.livestream.findMany({
        where: { ingressId },
      })
      if (!livestream) {
        return null
      }
      const result = livestream.find((e) => e.endStreamAt === null)
      return LivestreamMapper.toDomain(result) ?? null
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
  async setLiveStreamInfoCategories(
    userId: string,
    categoriesId: string[],
  ): Promise<void> {
    try {
      const livestreamInfo = await this.prismaService.liveStreamInfo.findUnique(
        {
          where: {
            userId: userId,
          },
        },
      )
      if (!livestreamInfo) {
        return
      }
      await Promise.all(
        categoriesId.map(async (e) => {
          const category = await this.prismaService.category.findUnique({
            where: { id: e },
          })
          if (!category) {
            throw new InfrastructureError({
              code: InfrastructureErrorCode.BAD_REQUEST,
              message: "Category does not exist",
            })
          }
          await this.prismaService.liveStreamCategoriesInfo.createMany({
            data: {
              categoryId: category.id,
              liveStreamInfoId: livestreamInfo.id,
            },
          })
        }),
      )
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
  async setLiveStreamInfoTags(userId: string, tagsIds: string[]) {
    try {
      const livestreamInfo = await this.prismaService.liveStreamInfo.findUnique(
        {
          where: {
            userId: userId,
          },
        },
      )
      if (!livestreamInfo) {
        return
      }
      await Promise.all(
        tagsIds.map(async (e) => {
          const tag = await this.prismaService.tag.findUnique({
            where: { id: e },
          })
          if (!tag) {
            throw new InfrastructureError({
              code: InfrastructureErrorCode.BAD_REQUEST,
              message: "Tag does not exist",
            })
          }
          await this.prismaService.liveStreamTagsInfo.createMany({
            data: {
              tagId: tag.id,
              liveStreamInfoId: livestreamInfo.id,
            },
          })
        }),
      )
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
  async getStreamInfoByUser(user: UserAggregate) {
    try {
      const streamInfo = await this.prismaService.liveStreamInfo.findUnique({
        where: {
          userId: user.id,
        },
      })
      if (!streamInfo) {
        return null
      }
      return streamInfo
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
  async updateStreamInfoOfUser(streamInfo: any) {
    try {
      await this.prismaService.liveStreamInfo.update({
        where: { id: streamInfo.id },
        data: streamInfo,
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
  async createStreamInfo(streamInfo: any) {
    try {
      await this.prismaService.liveStreamInfo.create({
        data: streamInfo,
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
  async getLiveStreamInfoCategories(liveStreamInfoId: string) {
    try {
      const result = await this.prismaService.liveStreamCategoriesInfo.findMany(
        {
          where: {
            liveStreamInfoId,
          },
        },
      )
      return result ?? []
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
  async getLiveStreamInfoTags(liveStreamInfoId: string) {
    try {
      const result = await this.prismaService.liveStreamTagsInfo.findMany({
        where: {
          liveStreamInfoId,
        },
      })
      return result ?? []
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
  async getAllLivingLiveStreamInfo({
    limit,
    offset = 0,
    orderBy,
    order = "desc",
  }: {
    limit: number
    offset: number
    orderBy: string
    order: "asc" | "desc"
  }): Promise<LiveStreamInfo[] | null> {
    try {
      const livestreamInfos = await this.prismaService.liveStreamInfo.findMany({
        where: { isLive: true },
        ...(offset !== null ? { skip: offset } : {}),
        ...(limit !== null ? { take: limit } : {}),
        select: {
          id: true,
        },
      })
      if (!livestreamInfos) {
        return []
      }
      const ids = livestreamInfos.map((e) => e.id)
      console.log(typeof orderBy === "undefined")
      const queryInfos = await this.prismaService.liveStreamInfo.findMany({
        where: { id: { in: ids } },
        ...(typeof orderBy !== "undefined"
          ? { orderBy: { [orderBy]: order } }
          : {}),
      })
      if (!queryInfos) {
        return []
      }
      const result = queryInfos.map((e) => {
        const liveStreamInfo = LiveStreamInfoMapper.toDomain(e)
        return liveStreamInfo
      })
      return result ?? []
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
  async getAllStreamSessions(user: UserAggregate): Promise<Livestream[]> {
    try {
      const livestreams = await this.prismaService.livestream.findMany({
        where: {
          userId: user.id,
        },
      })
      if (!livestreams) {
        return []
      }
      const result = livestreams.map((e) => LivestreamMapper.toDomain(e))
      return result ?? []
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
  async getCurrentLivestreamSession(user: UserAggregate): Promise<Livestream> {
    try {
      const livestreams = await this.prismaService.livestream.findMany({
        where: {
          userId: user.id,
        },
      })
      if (!livestreams) {
        return null
      }
      const liveStream = livestreams.find((e) => e.endStreamAt === null)
      return LivestreamMapper.toDomain(liveStream) ?? null
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
  async createLivestreamSession(livestream: Livestream): Promise<void> {
    try {
      const data = LivestreamMapper.toPersistence(livestream)
      await this.prismaService.livestream.create({
        data,
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
}
