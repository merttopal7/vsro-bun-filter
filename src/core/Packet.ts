import { stream } from "@/utils/security/index";
import { PacketResultType } from "@/utils/types";
import { PacketReader, PacketWriter, RawPacket, StaticType } from "@/core/types";


export abstract class Packet {
  opcode: number = null!;
  _packet!: RawPacket;

  reader!: PacketReader;
  writer!: PacketWriter;

  ResultType: PacketResultType = PacketResultType.Nothing;

  constructor(opcode: number) {
    this.opcode = opcode;
    this.Reset();
  }

  bindPacket(packet: RawPacket) {
    this._packet = packet;
    this.reader = new stream.reader(packet.data);
  }

  Reset() {
    this.writer = new stream.writer();
    this.writer.buffer = Buffer.alloc(32768);
  }

  RemainingRead(): number {
    return this._packet.data.length - this.reader.pointer;
  }

  TryRead<T>(v: StaticType<T>): this {
    v.read(this.reader);
    return this;
  }

  TryWrite<T>(v: StaticType<T>): this {
    v.write(this.writer);
    return this;
  }

  abstract Read(): void | Promise<void>;
  abstract Build(): Packet;
}


