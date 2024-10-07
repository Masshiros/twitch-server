import { Request } from "express"
import { UserAggregate } from "src/module/users/domain/aggregate"

declare global {
  namespace Express {
    interface Request {
      user?: UserAggregate
    }
  }
}
