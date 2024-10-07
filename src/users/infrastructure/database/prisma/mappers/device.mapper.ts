import { Device as PrismaDevice } from "@prisma/client"
import { Device } from "src/users/domain/entity/devices.entity"

export class DeviceMapper {
  static toDomain(prismaDevice: PrismaDevice): Device {
    return new Device(
      {
        userId: prismaDevice.userId,
        type: prismaDevice.type,
        name: prismaDevice.name,
        lastUsed: prismaDevice.lastUsed,
        userAgent: prismaDevice.userAgent,
        ipAddress: prismaDevice.ipAddress,
        createdAt: prismaDevice.createdAt,
        updatedAt: prismaDevice.updatedAt,
      },
      prismaDevice.id,
    )
  }

  static toPersistence(domainDevice: Device): PrismaDevice {
    return {
      id: domainDevice.id,
      userId: domainDevice.userId,
      type: domainDevice.type,
      name: domainDevice.name,
      lastUsed: domainDevice.lastUsed,
      userAgent: domainDevice.userAgent,
      ipAddress: domainDevice.ipAddress,
      createdAt: domainDevice.createdAt,
      updatedAt: domainDevice.updatedAt,
      deletedAt: domainDevice.deletedAt,
    }
  }
}
