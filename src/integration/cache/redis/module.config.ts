import { Logger } from "@nestjs/common"
import config from "libs/config"
import { RedisModule } from "./redis.module"

export const redisModule = RedisModule.registerAsync({
  imports: [],
  useFactory: async () => {
    const logger = new Logger("RedisModule")

    return {
      connectionOptions: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
      },
      onClientReady: (client) => {
        logger.log("Redis client ready")

        client.on("error", (err) => {
          logger.error("Redis Client Error: ", err)
        })

        client.on("connect", () => {
          logger.log(
            `Connected to redis on ${client.options.host}:${client.options.port}`,
          )
        })
      },
    }
  },
  inject: [],
})
