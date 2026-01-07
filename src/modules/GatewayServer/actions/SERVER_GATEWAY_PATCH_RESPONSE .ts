import { Packet, StaticTypes } from "@/core";
import { HostAndPort, DownloadFile } from "@/utils/objects";
const { bool, byte, int, short, string, stringASCII } = StaticTypes;

export class SERVER_GATEWAY_PATCH_RESPONSE extends Packet {
    static opcode = 0xA100;
    constructor() { super(SERVER_GATEWAY_PATCH_RESPONSE.opcode); }

    HasUpdate = bool(false);
    status = byte();
    statusCode = byte();
    DownloadServer: HostAndPort;
    version = int();
    hasEntry = byte();
    files: DownloadFile[] = [];

    Read() {
        this.TryRead(this.status);
        if (this.status == 2) {

            this.TryRead(this.statusCode);

            if (this.statusCode == 2) {
                this.HasUpdate.set(true);
                this.DownloadServer = new HostAndPort(this);

                this.TryRead(this.version)

                while (true) {
                    this.TryRead(this.hasEntry);
                    if (this.hasEntry != 1) break;
                    this.files.push(new DownloadFile(this));
                }
            }
        }


    }

    Build() {
        this.Reset();

        this.TryWrite(this.status);
        if (this.status == 2) {

            this.TryWrite(this.statusCode);

            if (this.statusCode == 2) {

                this.DownloadServer.Build(this);

                this.TryWrite(this.version);

                for (let i = 0; i < this.files.length; i++) {
                    this.TryWrite(byte(1));
                    this.files[i].Build(this);
                }

                this.TryWrite(byte(0));
            }
        }

        return this;
    }
}