import Proxy from "@/core/Proxy";
import { Socket } from "net";
import configuration from "@/modules/GatewayServer/config";
import { DataHandler } from "@/modules/GatewayServer/handlers/DataHandler";

import { TokenService } from "@/utils/auth-server/crypto/TokenService";
import { InMemoryTokenStore } from "@/utils/auth-server/crypto/InMemoryTokenStore";
import { Session } from "@/core/index";
import type { Instance } from "@/core/types";

class AuthGatewayServer extends Proxy {
  private readonly tokenService: TokenService;
  private readonly tokenStore: InMemoryTokenStore;

  constructor() {
    configuration.debug = true;
    configuration.module = "AuthGatewayServer";

    super(configuration);

    this.tokenService = new TokenService(
      "SUPER_SECRET_KEY_CHANGE_THIS",
      30
    );

    this.tokenStore = new InMemoryTokenStore();

    const dataHandler = new DataHandler();
    dataHandler.register(this);
  }

  /**
   * 🔐 AUTH GATE
   * Proxy.setupSocketHandlers override
   */
  setupSocketHandlers(
    instance: Instance,
    id: string,
    side: "client" | "remote",
    session: Session
  ): void {
    const socket = instance[side].socket;
    const security = instance[side].security;

    const cleanup = () => this.removeInstance(id);
    socket.once("error", cleanup);
    socket.once("close", cleanup);

    // runtime flag
    (instance as any).authorized ??= false;

    socket.on("data", (data: Buffer) => {
      if (!this.instances.has(id)) return;

      if (side === "client" && !(instance as any).authorized) {
        const ok = this.handleAuthPacket(
          data,
          socket
        );

        if (!ok) {
          if (this.config.debug) {
            console.log(`[AUTH]->(${id})->(failed)`);
          }
          socket.destroy();
          return;
        }

        (instance as any).authorized = true;

        if (this.config.debug) {
          console.log(`[AUTH]->(${id})->(ok)`);
        }

        return; 
      }

      security.Recv(data.toJSON().data);

      this.events.emit("event", {
        sender: side,
        session
      });
    });
  }


  private handleAuthPacket(
    data: Buffer,
    socket: Socket
  ): boolean {
    try {
      if (data.length < 2) return false;

      const tokenLength = data.readUInt16BE(0);
      if (tokenLength <= 0 || tokenLength > 1024)
        return false;

      if (data.length < 2 + tokenLength)
        return false;

      const token = data
        .subarray(2, 2 + tokenLength)
        .toString("utf8");

      const ip =
        socket.remoteAddress ?? "0.0.0.0";

      if (!this.tokenService.validate(token, ip))
        return false;

      if (!this.tokenStore.consume(token))
        return false;

      return true;
    } catch {
      return false;
    }
  }
}

export default AuthGatewayServer;
