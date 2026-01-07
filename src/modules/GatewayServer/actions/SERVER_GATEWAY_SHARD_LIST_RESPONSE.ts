import { Packet, StaticTypes } from "@/core";
import { Farm, Shard } from "@/utils/types";
const { byte, string, short, stringASCII } = StaticTypes;

export class SERVER_GATEWAY_SHARD_LIST_RESPONSE extends Packet {
    static opcode = 0xA101;
    constructor() { super(SERVER_GATEWAY_SHARD_LIST_RESPONSE.opcode); }

    readonly hasFarmEntries = byte();
    readonly hasShardEntries = byte();
    readonly Farm: Farm = {
        Id: byte(),
        Name: string()
    };
    readonly Shard: Shard = {
        Id: short(),
        Name: stringASCII(),
        OnlineCount: short(),
        Capacity: short(),
        Status: byte(),
        FarmId: byte(),
    };
    readonly unkFarmEntries = byte();
    readonly unkShardEntries = byte();

    Read() {
        this.TryRead(this.hasFarmEntries);
        if (this.hasFarmEntries == 1) {
            this.TryRead(this.Farm.Id);
            this.TryRead(this.Farm.Name);
            this.TryRead(this.unkFarmEntries);
        }
        this.TryRead(this.hasShardEntries);
        if (this.hasShardEntries == 1) {
            this.TryRead(this.Shard.Id);
            this.TryRead(this.Shard.Name);
            this.TryRead(this.Shard.OnlineCount);
            this.TryRead(this.Shard.Capacity);
            this.TryRead(this.Shard.Status);
            this.TryRead(this.Shard.FarmId);
            this.TryRead(this.unkShardEntries);
        }

    }

    Build() {
        this.Reset();
        this.TryWrite(this.hasFarmEntries);
        if (this.hasFarmEntries == 1) {
            this.TryWrite(this.Farm.Id);
            this.TryWrite(this.Farm.Name);
            this.TryWrite(this.unkFarmEntries);
        }
        this.TryWrite(this.hasShardEntries);
        if (this.hasShardEntries == 1) {
            this.TryWrite(this.Shard.Id);
            this.TryWrite(this.Shard.Name);
            this.TryWrite(this.Shard.OnlineCount);
            this.TryWrite(this.Shard.Capacity);
            this.TryWrite(this.Shard.Status);
            this.TryWrite(this.Shard.FarmId);
            this.TryWrite(this.unkShardEntries);
        }
        return this;
    }
}