import { Packet } from "@/core/Packet";

export class Punishment {
    EndDateDay: number;
    EndDateHour: number;
    EndDateMicrosecond: number;
    EndDateMinute: number;
    EndDateMonth: number;
    EndDateNanosecond: number;
    EndDateSecond: number;
    EndDateYear: number;
    Reason: string;

    constructor(packet: Packet) {
        this.Reason = packet.reader.string();
        this.EndDateYear = this.reader.uint16();
        this.EndDateMonth = this.reader.uint16();
        this.EndDateDay = this.reader.uint16();
        this.EndDateHour = this.reader.uint16();
        this.EndDateMinute = this.reader.uint16();
        this.EndDateSecond = this.reader.uint16();
        this.EndDateMicrosecond = this.reader.uint16();
        this.EndDateNanosecond = this.reader.uint16();
    }
    
    Build(packet: Packet) {
        packet.writer.string(this.Reason);
        packet.writer.uint16(this.EndDateYear);
        packet.writer.uint16(this.EndDateMonth);
        packet.writer.uint16(this.EndDateDay);
        packet.writer.uint16(this.EndDateHour);
        packet.writer.uint16(this.EndDateMinute);
        packet.writer.uint16(this.EndDateSecond);
        packet.writer.uint16(this.EndDateMicrosecond);
        packet.writer.uint16(this.EndDateNanosecond);

        return packet;
    }
}