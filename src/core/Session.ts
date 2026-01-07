import { Packet } from "./Packet";
import { SessionContext } from "./types";

export class Session {
    client;
    instance;
    constructor(ctx: SessionContext) {
        this.client = ctx.client;
        this.instance = ctx.instance;
    }
    async SendToClient(packet: Packet, encrypted: boolean = false, massive: boolean = false) {
        await this.instance.client.security.Send(packet.opcode, packet.writer, encrypted, massive);

        const send = await this.instance.client.security.GetPacketToSend() || [];
        for (const packet of send) {
            await this.instance.client.socket.write(Buffer.from(packet));
        }
    }
    async SendToServer(packet: Packet, encrypted: boolean = false, massive: boolean = false) {
        await this.instance.remote.security.Send(packet.opcode, packet.writer, encrypted, massive);

        const send = await this.instance.remote.security.GetPacketToSend() || [];
        for (const packet of send) {
            await this.instance.remote.socket.write(Buffer.from(packet));
        }
    }
}