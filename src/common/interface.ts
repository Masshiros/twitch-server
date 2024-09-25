import { JwtPayload } from "jsonwebtoken"
import { tokenType } from "libs/constants/enum"

export interface UserFilters {
  categoryId?: string
  isActive?: boolean
}
export interface TokenPayload extends JwtPayload {
  sub: string
  email: string
  username: string
  deviceId: string
  tokenType: tokenType
}
