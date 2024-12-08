import { Injectable } from "@nestjs/common"
import { Socket } from "socket.io"

export abstract class IGatewaySessionManager {
  getUserSocket: (id: string) => Socket | undefined
  setUserSocket: (id: string, socket: Socket) => void
  removeUserSocket: (id: string) => void
  getSockets: () => Map<string, Socket>
}

@Injectable()
export class GatewaySessionManager implements IGatewaySessionManager {
  private readonly sessions: Map<string, Socket> = new Map()

  getUserSocket(id: string): Socket | undefined {
    return this.sessions.get(id)
  }

  setUserSocket(userId: string, socket: Socket): void {
    this.sessions.set(userId, socket)
  }

  removeUserSocket(userId: string): void {
    this.sessions.delete(userId)
  }

  getSockets(): Map<string, Socket> {
    return this.sessions
  }
}
