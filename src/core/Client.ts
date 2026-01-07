import { SilkroadSecurityJS as Security } from "@/utils/security/index";
import { Socket } from "net";

class Client {
  socket: Socket;
  security: Security;

  constructor(socket: Socket) {
    this.socket = socket;
    this.security = new Security();
  }

  setup(): this {
    this.security.GenerateHandshake(true, true, true);
    return this;
  }
}

export default Client;
