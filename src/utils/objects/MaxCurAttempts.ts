import { Packet } from "@/core/Packet";

export class MaxCurAttempts {
    CurAttempts: number;
    MaxAttempts: number;
    constructor(packet: Packet) {
        this.MaxAttempts = this.reader.uint32();
        this.CurAttempts = this.reader.uint32();
    }
    Build(packet: Packet) {
        packet.writer.uint32(this.MaxAttempts);
        packet.writer.uint32(this.CurAttempts);
        return packet;
    }
}