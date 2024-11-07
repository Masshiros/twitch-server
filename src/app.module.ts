import { BullModule } from "@nestjs/bullmq"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_GUARD } from "@nestjs/core"
import config, { validate } from "libs/config"
import { AuthGuard } from "./guard/auth.guard"
import { PermissionGuard } from "./guard/permission.guard"
import { CategoriesModule } from "./module/categories/application/categories.module"
import { FollowerModule } from "./module/followers/application/follower.module"
import { FriendsModule } from "./module/friends/application/friend.module"
import { ImageModule } from "./module/image/application/image.module"
import { NotificationsModule } from "./module/notifications/application/notifications.module"
import { PostsModule } from "./module/posts/application/posts.module"
import { UserModule } from "./module/users/application/user.module"
import { UserDatabaseModule } from "./module/users/infrastructure/database/user.database.module"

@Module({
  imports: [
    ConfigModule.forRoot({ validate: validate, isGlobal: true }),
    BullModule.forRootAsync({
      useFactory: async () => ({
        connection: {
          host: config.REDIS_HOST,
          port: config.REDIS_PORT,
        },
      }),
    }),
    ImageModule,
    UserModule,
    UserDatabaseModule,
    FollowerModule,
    CategoriesModule,
    NotificationsModule,
    FriendsModule,
    PostsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
})
export class AppModule {}
