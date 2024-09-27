import { Injectable, type OnModuleInit } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"
import config from "libs/config"

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const databaseUrl = `postgresql://${config.DATABASE_USERNAME}:${config.DATABASE_PASSWORD}@${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME}?schema=${config.DATABASE_SCHEMA}`
    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    })
  }
  async onModuleInit() {
    await this.$connect()
  }
}
