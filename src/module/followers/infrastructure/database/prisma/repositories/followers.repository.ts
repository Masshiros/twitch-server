import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import {
  InfrastructureError,
  InfrastructureErrorCode,
} from "libs/exception/infrastructure"
import { PrismaService } from "prisma/prisma.service"
import { Follower } from "src/module/followers/domain/entity/followers.entity"
import { IFollowersRepository } from "src/module/followers/domain/repository/followers.interface.repository"
import { handlePrismaError } from "utils/prisma-error"
import { FollowerMapper } from "../mappers/followers.mapper"

@Injectable()
export class FollowersRepository implements IFollowersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findFollowersByUser(
    destinationUserId: string,
  ): Promise<Follower[] | null> {
    try {
      const followers = await this.prismaService.follower.findMany({
        where: { destinationUserId: destinationUserId },
      })
      if (!followers) {
        return null
      }
      const result = followers.map((follow) => FollowerMapper.toDomain(follow))
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
  async findFollowingByUser(sourceUserId: string): Promise<Follower[] | null> {
    try {
      const followings = await this.prismaService.follower.findMany({
        where: { sourceUserId: sourceUserId },
      })
      if (!followings) {
        return null
      }
      const result = followings.map((follow) => FollowerMapper.toDomain(follow))
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
  async isFollow(
    destinationUserId: string,
    sourceUserId: string,
  ): Promise<boolean> {
    try {
      const data = await this.prismaService.follower.findUnique({
        where: {
          sourceUserId_destinationUserId: {
            sourceUserId: sourceUserId,
            destinationUserId: destinationUserId,
          },
        },
      })
      return !!data
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
  async addFollower(follower: Follower): Promise<void> {
    try {
      const data = FollowerMapper.toPersistence(follower)
      await this.prismaService.follower.create({ data: data })
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
  async removeFollower(follower: Follower): Promise<void> {
    try {
      await this.prismaService.follower.delete({
        where: {
          sourceUserId_destinationUserId: {
            sourceUserId: follower.sourceUserId,
            destinationUserId: follower.destinationUserId,
          },
        },
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
