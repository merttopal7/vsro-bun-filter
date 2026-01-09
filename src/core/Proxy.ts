import { createServer, Socket, Server } from "net";
import { EventEmitter } from "events";
import { stream } from "@/utils/Security/index";
import { Client, Remote, CreateEventHandler, Session } from "@/core/index";
import type {
  ProxyConfig,
  Instance,
  MiddlewareFn,
  Stream
} from "@/core/types";

class Proxy {
  services: Record<string, any>;
  config: ProxyConfig;
  instances: Map<string, Instance>;
  middlewares: {
    client: Record<number, MiddlewareFn>;
    remote: Record<number, MiddlewareFn>;
  };
  stream: Stream;
  events: EventEmitter;
  server!: Server;

  private readonly context: {
    config: ProxyConfig;
    middlewares: typeof this.middlewares;
    services: typeof this.services;
    server: typeof this;
  };

  constructor(config: ProxyConfig) {
    this.services = {};
    this.config = { ...config };
    this.instances = new Map();
    this.middlewares = { client: {}, remote: {} };
    this.stream = stream;
    this.events = new EventEmitter();
    this.events.setMaxListeners(0);

    this.SetContext();

    if (this.config.debug) {
      console.log(
        `[${this.config.module}]->{Production}->(run)`
      );
    }
  }

  SetContext() {
    this.context = {
      config: this.config,
      middlewares: this.middlewares,
      services: this.services,
      server: this
    };

  }

  RegisterClientHandler<T>(
    PacketClass: { opcode: number },
    action: (packet: T, ctx?: any) => any
  ) {
    const opcode = PacketClass.opcode;
    const side = "client";

    this.middlewares[side][opcode] = { PacketClass, action };
    this.SetContext();
    if (this.config.debug) {
      console.log(
        `[Middleware]->{${side}}[0x${opcode.toString(16)}]->(ready)`
      );
    }
  }
  RegisterModuleHandler<T>(
    PacketClass: { opcode: number },
    action: (packet: T, ctx?: any) => any
  ) {
    const opcode = PacketClass.opcode;
    const side = "remote";

    this.middlewares[side][opcode] = { PacketClass, action };
    this.SetContext();
    if (this.config.debug) {
      console.log(
        `[Middleware]->{${side}}[0x${opcode.toString(16)}]->(ready)`
      );
    }
  }

  createInstanceID(ip: string, port: number): string {
    return `${ip}:${port}`;
  }

  getInstanceParams(id: string) {
    const [ip, port] = id.split(":");
    return { ip, port: Number(port) };
  }

  removeInstance(id: string): void {
    const instance = this.instances.get(id);
    if (!instance) return;

    try {
      instance.remote.socket.destroy();
    } catch { }

    try {
      instance.client.socket.destroy();
    } catch { }

    this.instances.delete(id);

    if (this.config.debug) {
      console.log(`[Client]->{${id}}->(disconnected)`);
    }
  }

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

    socket.on("data", (data: Buffer) => {
      if (!this.instances.has(id)) return;

      security.Recv(data.toJSON().data);

      this.events.emit("event", {
        sender: side,
        session
      });

    });
  }

  start(): void {
    this.server = createServer(
      { pauseOnConnect: false, noDelay: true },
      (clientSocket: Socket) => {
        const id = this.createInstanceID(
          clientSocket.remoteAddress as string,
          clientSocket.remotePort as number
        );

        clientSocket.setNoDelay(true);
        clientSocket.setKeepAlive(true, 30_000);

        const client = new Client(clientSocket).setup();
        const remote = new Remote(this.config).setup();

        const instance: Instance = { client, remote };
        this.instances.set(id, instance);

        if (this.config.debug) {
          console.log(
            `[Client]->(${id})->(connected)`
          );
        }
        const session = new Session({
          client: {
            id,
            ...this.getInstanceParams(id)
          },
          instance
        });
        this.setupSocketHandlers(instance, id, "client", session);
        this.setupSocketHandlers(instance, id, "remote", session);
      }
    );

    this.events.on("event", CreateEventHandler(this.context));

    this.server.maxConnections =
      this.config.maxConnections ?? 10_000;

    this.server.listen(
      this.config.LOCAL.PORT,
      this.config.LOCAL.HOST,
      () => {
        console.log(
          `[${this.config.module}]->${JSON.stringify(
            this.config.LOCAL
          )}->(ready)`
        );
      }
    );
  }

  async shutdown(): Promise<void> {
    console.log("Shutting down...");

    for (const id of this.instances.keys()) {
      this.removeInstance(id);
    }

    return new Promise(resolve => {
      this.server.close(() => {
        console.log("Server closed");
        resolve();
      });
    });
  }
}

export default Proxy;
