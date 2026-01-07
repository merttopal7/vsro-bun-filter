import { SilkroadSecurityJS as Security } from "@/utils/security/index";
import { Socket } from "net";
import type { ProxyConfig } from "@/core/types";

class Remote {
  config: ProxyConfig;
  security: Security;
  socket: Socket;

  constructor(config: ProxyConfig) {
    this.config = config;
    this.security = new Security();
    this.socket = new Socket();
  }

  setup() {
    this.socket.connect({
      host: this.config.REMOTE.HOST,
      port: this.config.REMOTE.PORT,
      onread: {
        buffer: Buffer.alloc(8 * 1024)
      }
    });

    return {
      security: this.security,
      socket: this.socket
    };
  }
}

export default Remote;
