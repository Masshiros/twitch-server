import { Request } from "express"
import { TokenPayload } from "src/common/interface"
import { UserAggregate } from "src/module/users/domain/aggregate"

declare global {
  namespace Express {
    interface Request {
      user?: UserAggregate
      decoded_access_token?: TokenPayload
    }
  }
}
