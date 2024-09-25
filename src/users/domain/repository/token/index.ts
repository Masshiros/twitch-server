import { TokenPayload } from "src/common/interface"

export abstract class ITokenRepository {
  generateToken: (payload: TokenPayload) => Promise<string>
  storeToken: (token: string) => Promise<void>
}
