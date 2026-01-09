import type { Socket } from "net";
import type { Packet } from "@/core/Packet";
import type { Knex } from "knex";
import { Session } from "@/core/Session/Session";
import Proxy from "./Proxy";

export type ReadHolder =
  | { t: "byte"; value: number }
  | { t: "short"; value: number }
  | { t: "int"; value: number }
  | { t: "bool"; value: boolean }
  | { t: "string"; value: string };


export type WriteValue =
  | { t: "byte"; value: number }
  | { t: "short"; value: number }
  | { t: "int"; value: number }
  | { t: "bool"; value: boolean }
  | { t: "string"; value: string };

export interface RawPacket {
  opcode: number;
  data: number[];
  encrypted?: boolean;
  massive?: boolean;
}

export type PacketConstructor<T extends Packet = Packet> = {
  opcode: number;
  new(): T;
};

export type PacketHandler<T extends Packet> = (
  packet: T,
  context: any
) => void;

export interface Stream {
  buffer: Buffer;
  pointer: number;
}
export interface PacketWriter extends Stream {
  size: number;

  uint8(value: number): void;
  uint16(value: number): void;
  uint32(value: number): void;
  float(value: number): void;
  string(value: string): void;

  toData(): number[];
}
export interface PacketReader extends Stream {
  uint8(): number;
  uint16(): number;
  uint32(): number;
  uint64(): number;
  float(): number;
  string(): string;
  bool(): boolean;

  toData(): number[];
}

export interface StaticType<T> {
  value: T;
  read(r: PacketReader): void;
  set(v): void,
  get(): T,
  write(w: PacketWriter): void;
  valueOf(): T;
}


export interface Security {
  Recv(data: number[] | Buffer): void;

  Send(
    opcode: number,
    data?: number[] | Buffer | stream.writer,
    encrypted?: boolean,
    massive?: boolean
  ): void;

  GetPacketToRecv(): RawPacket[] | [];
  GetPacketToSend(): number[][] | [];

  GenerateHandshake(
    blowfish?: boolean,
    security_bytes?: boolean,
    handshake?: boolean
  ): void;

  ChangeIdentity(identity_name: string, identity_flag: number): void;
}

export interface ProxyConfig {
  module: string;
  debug?: boolean;
  maxConnections?: number;
  LOCAL: {
    HOST: string;
    PORT: number;
  };
  REMOTE: {
    HOST: string;
    PORT: number;
  };
  whitelist?: Record<number, boolean>;
}

export interface SideInstance {
  socket: Socket;
  security: Security;
}

export interface Instance {
  client: SideInstance;
  remote: SideInstance;
}
export interface MiddlewareContext {
  instance: Instance;
  sender: "client" | "remote";
  config: ProxyConfig;
  services: Record<string, any>;
}

export interface MiddlewareFn<T extends Packet = Packet> {
  PacketClass: PacketConstructor<T>;
  action: (packet: T, session: Session) => Packet | Promise<Packet>;
}

export interface SessionContext {
  client: {
    id: string;
    ip: string;
    port: number;
  };
  instance: Instance;
}
export interface ProxyEvent {
  sender: "client" | "remote";
  session: Session;
}


export interface ModuleRegistry {
  RegisterClientHandler<T>(
    packetClass: PacketClass<T>,
    handler: (packet: T, ctx?: any) => any
  ): void;

  RegisterModuleHandler<T>(
    packetClass: PacketClass<T>,
    handler: (packet: T, ctx?: any) => any
  ): void;
}

export interface ProxyContext {
  config: ProxyConfig;
  middlewares: {
    client: Record<number, MiddlewareFn>;
    remote: Record<number, MiddlewareFn>;
  };
  services: Record<string, any>;
  server: Proxy
}

export type DatabaseAdapters = Partial<Record<string, Knex>>;