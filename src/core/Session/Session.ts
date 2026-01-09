import { Cache } from "@/utils/Cache";
import { Packet } from "../Packet";
import { SessionContext } from "../types";

export class Session {
    client;
    instance;
    SessionData;
    constructor(ctx: SessionContext) {
        this.client = ctx.client;
        this.instance = ctx.instance;
        this.SessionData = new Cache();
    }
    GetId() {
        return this.SessionData.id;
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

    SetData<T>(DataKey: string, value: T): this {
        this.SessionData.set<T>(DataKey, value);
        return this;
    }

    GetData<T>(
        key: string,
        defaultValue: T
    ): T {
        if (!this.SessionData.has(key)) {
            this.SessionData.set(key, defaultValue);
            return defaultValue;
        }
        return this.SessionData.get<T>(key)!;
    }

}