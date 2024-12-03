import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { DatabaseModule } from "prisma/database.module"
import { NodeMailerModule } from "src/integration/email/nodemailer/nodemailer.module"
import { TwilioModule } from "src/integration/twilio/twilio.module"
import { CategoriesDatabaseModule } from "src/module/categories/infrastructure/database/categories.database.module"
import { FollowersDatabaseModule } from "src/module/followers/infrastructure/database/followers.database.module"
import { ImageModule } from "src/module/image/application/image.module"
import { UserFactory } from "../domain/factory/user/index"
import { UserDatabaseModule } from "../infrastructure/database/user.database.module"
import { AuthController } from "../presentation/auth.controller"
import { LiveStreamController } from "../presentation/livestream.controller"
import { UserController } from "../presentation/user.controller"
import { AuthService } from "./auth.service"
import { ConfirmEmailCommandHandler } from "./command/auth/confirm-email/confirm-email.handler"
import { ForgetUsernameHandler } from "./command/auth/forget-username/forget-username.handler"
import { ForgotPasswordCommandHandler } from "./command/auth/forgot-password/forgot-password.handler"
import { LogoutFromAllDeviceCommandHandler } from "./command/auth/logout-from-all-device/logout-from-all-device.handler"
import { LogoutFromOneDeviceCommandHandler } from "./command/auth/logout-from-one-device/logout-from-one-device.handler"
import { RefreshTokenCommandHandler } from "./command/auth/refresh-token/refresh-token.handler"
import { ResendVerifyEmailCommandHandler } from "./command/auth/resend-verify-email/resend-verify-email.handler"
import { ResetPasswordCommandHandler } from "./command/auth/reset-password/reset-password.handler"
import { SignInCommandHandler } from "./command/auth/signin/signin.handler"
import { SignupWithEmailCommandHandler } from "./command/auth/signup-with-email/signup-with-email.handler"
import { SignupWithPhoneCommandHandler } from "./command/auth/signup-with-phone/signup-with-phone.handler"
import { ToggleTwoFaCommandHandler } from "./command/auth/toggle-two-fa/toggle-two-fa.handler"
import { CreateLivestreamSessionHandler } from "./command/livestream/create-livestream-session/create-livestream-session.handler"
import { SetIsLiveHandler } from "./command/livestream/set-is-live/set-is-live.handler"
import { SetStreamInfoHandler } from "./command/livestream/set-stream-info/set-stream-info.handler"
import { SetViewHandler } from "./command/livestream/set-view/set-view.handler"
import { UpdateLivestreamSessionHandler } from "./command/livestream/update-livestream-session/update-livestream-session.handler"
import { AssignPermissionToRoleHandler } from "./command/role/assign-permission-to-role/assign-permission-to-role.handler"
import { AssignRoleToUserHandler } from "./command/role/assign-role-to-user/assign-role-to-user.handler"
import { AddProfilePictureHandler } from "./command/user/add-profile-picture/add-profile-picture.handler"
import { AddThumbnailHandler } from "./command/user/add-thumbnail/add-thumbnail.handler"
import { DeleteUserCommandHandler } from "./command/user/delete-user/delete-user.handler"
import { SetStreamKeyHandler } from "./command/user/set-stream-key/set-stream-key.handler"
import { ToggleActivateCommandHandler } from "./command/user/toggle-activate/toggle-activate.handler"
import { UpdateBioCommandHandler } from "./command/user/update-bio/update-bio.handler"
import { UpdateDisplayNameHandler } from "./command/user/update-display-name/update-display-name.handler"
import { UpdateProfilePictureHandler } from "./command/user/update-profile-picture/update-profile-picture.handler"
import { UpdateUsernameCommandHandler } from "./command/user/update-username/update-username.handler"
import { GetListDeviceQueryHandler } from "./query/device/get-list-device/get-list-device.handler"
import { GetListLoginHistoriesQueryHandler } from "./query/login-history/get-list-login-histories/get-list-login-histories.handler"
import { GetAllPermissionsHandler } from "./query/role/get-all-permissions/get-all-permissions.handler"
import { GetAllRolesHandler } from "./query/role/get-all-role/get-all-role.handler"
import { GetUserPermissionsHandler } from "./query/role/get-user-permissions/get-user-permissions.handler"
import { GetUserRoleHandler } from "./query/role/get-user-role/get-user-role.handler"
import { GetAllStreamHandler } from "./query/user/get-all-stream/get-all-stream.handler"
import { GetAllUsersQueryHandler } from "./query/user/get-all-user/get-all-user.handler"
import { GetLivestreamInfoHandler } from "./query/user/get-livestream-info/get-livestream-info.handler"
import { GetStreamKeyHandler } from "./query/user/get-stream-key/get-stream-key.handler"
import { GetTop5StreamHandler } from "./query/user/get-top-5-stream/get-top-5-stream.handler"
import { GetUserByUserNameHandler } from "./query/user/get-user-by-username/get-user-by-username.handler"
import { GetUserByUserNameQuery } from "./query/user/get-user-by-username/get-user-by-username.query"
import { GetUserQueryHandler } from "./query/user/get-user/get-user.handler"
import { IsValidUserNameHandler } from "./query/user/is-valid-username/is-valid-username.handler"
import { UserService } from "./user.service"

const commandHandlers = [
  SignupWithEmailCommandHandler,
  SignupWithPhoneCommandHandler,
  DeleteUserCommandHandler,
  UpdateBioCommandHandler,
  UpdateUsernameCommandHandler,
  UpdateDisplayNameHandler,
  AddProfilePictureHandler,
  AddThumbnailHandler,
  UpdateProfilePictureHandler,
  SignInCommandHandler,
  ToggleTwoFaCommandHandler,
  ConfirmEmailCommandHandler,
  ResendVerifyEmailCommandHandler,
  ForgotPasswordCommandHandler,
  ResetPasswordCommandHandler,
  ToggleActivateCommandHandler,
  LogoutFromAllDeviceCommandHandler,
  LogoutFromOneDeviceCommandHandler,
  RefreshTokenCommandHandler,
  AssignRoleToUserHandler,
  AssignPermissionToRoleHandler,
  ForgetUsernameHandler,
  SetStreamKeyHandler,
  SetStreamInfoHandler,
  SetIsLiveHandler,
  SetViewHandler,
  CreateLivestreamSessionHandler,
  UpdateLivestreamSessionHandler,
]
const queryHandlers = [
  GetUserQueryHandler,
  GetAllUsersQueryHandler,
  GetListDeviceQueryHandler,
  GetListLoginHistoriesQueryHandler,
  GetAllRolesHandler,
  GetUserRoleHandler,
  GetAllPermissionsHandler,
  GetUserPermissionsHandler,
  IsValidUserNameHandler,
  GetStreamKeyHandler,
  GetTop5StreamHandler,
  GetAllStreamHandler,
  GetLivestreamInfoHandler,
  GetUserByUserNameHandler,
]
@Module({
  controllers: [AuthController, UserController, LiveStreamController],
  providers: [
    UserFactory,
    AuthService,
    UserService,
    ...commandHandlers,
    ...queryHandlers,
  ],
  imports: [
    CqrsModule,
    UserDatabaseModule,
    FollowersDatabaseModule,
    CategoriesDatabaseModule,
    NodeMailerModule,
    TwilioModule,
    ImageModule,
  ],
})
export class UserModule {}
