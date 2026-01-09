import { stream } from "@/utils/Security/index";
import { PacketResultType } from "@/utils/Types";
import { PacketReader, PacketWriter, RawPacket, StaticType } from "@/core/types";


export abstract class Packet {
  opcode: number = null!;
  _packet!: RawPacket;
  massive: boolean = false;
  encrypted: boolean = false;

  reader!: PacketReader;
  writer!: PacketWriter;
  _readerBytes!: number[];
  _isReadOnly: boolean = false;

  ResultType: PacketResultType = PacketResultType.Nothing;

  constructor(opcode: number) {
    this.opcode = opcode;
    this.Reset();
  }

  BindPacket(packet: RawPacket) {
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

  InitializePacketReader() {
    if (this.writer != null) {
      this._readerBytes = this.writer.toData();
      this.writer.buffer = [];
    }
    this.Reset();
    this.reader = new stream.reader(this._readerBytes);
  }

  ToReadOnly() {
    this.InitializePacketReader();
    this._isReadOnly = true;
  }

  GetBytes() {
    return this._isReadOnly ? this._readerBytes : this._packet.data;
  }

  abstract Read(): void | Promise<void>;
  abstract Build(): Packet;
}


