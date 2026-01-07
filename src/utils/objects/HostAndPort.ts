import { Packet, StaticTypes } from "@/core";
const { bool, byte, int, short, string, stringASCII } = StaticTypes;

export class HostAndPort {
    Host = string();
    Port = short();
    constructor(packet: Packet) {
        packet.TryRead(this.Host);
        packet.TryRead(this.Port);
    }
    Build(packet: Packet) {
        packet.TryWrite(this.Host);
        packet.TryWrite(this.Port);
        return packet;
    }
}