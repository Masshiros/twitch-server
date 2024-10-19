import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { Request } from "express"
import { PERMISSION_KEY } from "libs/decorator/permission.decorator"
import { PresentationErrorDetailCode } from "libs/exception/presentation"
import { Observable } from "rxjs"
import { Permission } from "src/module/users/domain/entity/permissions.entity"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userRepository: IUserRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    try {
      const permissions = this.reflector.getAllAndOverride<string[]>(
        PERMISSION_KEY,
        [context.getHandler(), context.getClass()],
      )
      if (!permissions) {
        return true
      }
      if (!request.user) {
        throw new BadRequestException(
          "Unauthorized",
          JSON.stringify({
            info: { errorCode: PresentationErrorDetailCode.UNAUTHORIZED },
          }),
        )
      }

      const userPermissions = await this.userRepository.getUserPermissions(
        request.user,
      )

      for (const permission of permissions) {
        const userPermission = userPermissions.find(
          (e) => e.name === permission,
        )
        if (!userPermission) {
          throw new BadRequestException(
            "You do not have permission to access this resource",
            JSON.stringify({
              info: { errorCode: PresentationErrorDetailCode.UNAUTHORIZED },
            }),
          )
        }
      }
    } catch (err) {
      throw new BadRequestException(
        err.message,
        JSON.stringify({
          info: { errorCode: PresentationErrorDetailCode.UNAUTHORIZED },
        }),
      )
    }

    return true
  }
}
