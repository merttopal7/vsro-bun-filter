import { Packet, Session, StaticTypes } from "@/core";
import { SpawnInfoType } from "@/utils/Types";
const { bool, byte, long, int, short, string, stringASCII } = StaticTypes;

export class EntityInfo {
    _session: Session;
    _amount = short();
    _exit = bool(false);
    _packet: Packet = null;
    _single = bool(false);
    _spawnInfoType = byte<SpawnInfoType>();

    constructor(session: Session) {
        this._session = session;
    }

    public Initialize(spawnInfoType: SpawnInfoType, amount: number, msgId: number) {
        this._packet = new Packet(msgId);
        this._spawnInfoType.set(spawnInfoType);
        this._amount.set(amount);
        if (msgId == 0x3015) {
            this._single = true;
        }

        if (msgId == 0x3019) {
            this._packet.massive = true;
        }
    }


    Append(packet: Packet) {
        if (this._packet == null) {
            return;
        }

        for (let i = 0; i < packet.GetBytes().length; i++) {
            const b = byte();
            packet.TryRead(b);
            this._packet.TryWrite(b);
        }
    }

    ReadDespawn() {
        if (this._packet == null) {
            return;
        }

        this._packet.ToReadOnly();
        const uniqueId = int();
        this._packet.TryRead(uniqueId);
    }

    Read() {
        this._packet.ToReadOnly();

    }

}