import { Packet } from "@/core/Packet";

export class DownloadFile {
    Id: number;
    Length: number;
    Name: string;
    Path: string;
    ToBePacket: number;
    constructor(packet: Packet) {
        this.Id = packet.reader.uint32();
        this.Length = packet.reader.uint32();
        this.Name = packet.reader.string();
        this.Path = packet.reader.string();
        this.ToBePacket = packet.reader.uint8();
    }
    Build(packet: Packet) {
        packet.reader.uint32(this.Id);
        packet.reader.uint32(this.Length);
        packet.reader.string(this.Name);
        packet.reader.string(this.Path);
        packet.reader.uint8(this.ToBePacket);
        return packet;
    }
}