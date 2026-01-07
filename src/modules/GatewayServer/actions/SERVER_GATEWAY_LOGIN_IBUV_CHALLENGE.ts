import { Packet } from "@/core/Packet";

export class SERVER_GATEWAY_LOGIN_IBUV_CHALLENGE extends Packet {
    static opcode = 0x2322;
    constructor() { super(SERVER_GATEWAY_LOGIN_IBUV_CHALLENGE.opcode); }

    ImageCompressed: number;
    ImageCompressedData: number[] = [];

    ImageFlag: number;
    ImageHeight: number;
    ImageRemain: number;
    ImageUncompressed: number;
    ImageWidth: number;

    Read() {
        this.ImageFlag = this.reader.uint8();
        this.ImageRemain = this.reader.uint16();
        this.ImageCompressed = this.reader.uint16();
        this.ImageUncompressed = this.reader.uint16();
        this.ImageWidth = this.reader.uint16();
        this.ImageHeight = this.reader.uint16();

        const remainingRead = this.RemainingRead();
        for (let i = 0; i < remainingRead; i++) {
            this.ImageCompressedData[i] = this.reader.uint8();
        }

    }

    Build() {
        this.Reset();

        this.writer.uint8(this.ImageFlag);
        this.writer.uint16(this.ImageRemain);
        this.writer.uint16(this.ImageCompressed);
        this.writer.uint16(this.ImageUncompressed);
        this.writer.uint16(this.ImageWidth);
        this.writer.uint16(this.ImageHeight);
        for (let i = 0; i < this.ImageCompressedData.length; i++) {
            this.writer.uint8(this.ImageCompressedData[i]);
        }
        
        return this;
    }
}