import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { Request } from "express"

export const DecodedTokenPayload = createParamDecorator((_, ctx: ExecutionContext) => {
  const req: Request = ctx.switchToHttp().getRequest()
  return req.decoded_access_token
})
