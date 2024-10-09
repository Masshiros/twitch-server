import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { Request } from "express"
import config from "libs/config"
import { IS_PUBLIC } from "libs/decorator/public.decorator"
import {
  InfrastructureError,
  InfrastructureErrorCode,
  InfrastructureErrorDetailCode,
} from "libs/exception/infrastructure"
import {
  PresentationError,
  PresentationErrorCode,
  PresentationErrorDetailCode,
} from "libs/exception/presentation"
import { IUserRepository } from "src/module/users/domain/repository/user/user.interface.repository"

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userRepository: IUserRepository,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const request: Request = context.switchToHttp().getRequest()
    try {
      const token = this.extractTokenFromHeader(request)
      if (!token) {
        throw new BadRequestException(
          "Unauthorized",
          JSON.stringify({
            info: { errorCode: PresentationErrorDetailCode.UNAUTHORIZED },
          }),
        )
      }

      const payload = await this.userRepository.decodeToken(token, {
        secret: config.JWT_SECRET_ACCESS_TOKEN,
      })
      if (!payload) {
        throw new InternalServerErrorException(
          "Jwt expired",
          JSON.stringify({
            info: { errorCode: InfrastructureErrorCode.INTERNAL_SERVER_ERROR },
          }),
        )
      }

      const user = await this.userRepository.findById(payload.sub)
      if (!user) {
        throw new BadRequestException(
          "Unauthorized",
          JSON.stringify({
            info: { errorCode: PresentationErrorDetailCode.UNAUTHORIZED },
          }),
        )
      }
      request.user = user
      request.decoded_access_token = payload
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

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? []
    return type === "Bearer" ? token : undefined
  }
}
