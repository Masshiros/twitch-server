import { Socket } from "socket.io"
import { UserAggregate } from "src/module/users/domain/aggregate"

export interface Response<T> {
  statusCode: number
  message: string
  data: T
}
export interface AuthenticatedSocket extends Socket {
  user?: UserAggregate
}
