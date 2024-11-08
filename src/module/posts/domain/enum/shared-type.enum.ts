import { ESharedType as PrismaESharedType } from "@prisma/client"

export enum ESharedType {
  USER = "USER",
  CHAT = "CHAT",
  GROUP = "GROUP",
}
export class ESharedTypeMapper {
  static toPrisma(sharedType: ESharedType): PrismaESharedType {
    return sharedType as PrismaESharedType
  }

  static fromPrisma(sharedType: PrismaESharedType): ESharedType {
    return sharedType as ESharedType
  }
}
