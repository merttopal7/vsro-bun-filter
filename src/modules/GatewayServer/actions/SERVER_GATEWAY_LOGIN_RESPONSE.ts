import { Packet, StaticTypes } from "@/core";
import { LoginErrorCode, LoginBlockType } from "@/utils/types";
import { HostAndPort, MaxCurAttempts, Punishment } from "@/utils/objects";
const { bool, byte, int, short, string, stringASCII } = StaticTypes;

export class SERVER_GATEWAY_LOGIN_RESPONSE extends Packet {
    static opcode = 0xA102;
    constructor() { super(SERVER_GATEWAY_LOGIN_RESPONSE.opcode); }

    Result = byte();
    AgentServer: HostAndPort;
    AgentServerToken = int();
    ErrorCode = byte<LoginErrorCode>();
    MaxCurAttempts: MaxCurAttempts;
    BlockType = byte<LoginBlockType>();
    PunishmentData: Punishment;

    Read() {
        this.TryRead(this.Result);
        if (this.Result == 0x01) {
            this.TryRead(this.AgentServerToken);
            this.AgentServer = new HostAndPort(this);
        } else if (this.Result == 0x02) {
            this.TryRead(this.ErrorCode);
            if (this.ErrorCode == LoginErrorCode.InvalidCredentials) {
                this.MaxCurAttempts = new MaxCurAttempts(this);
            }
            else if (this.ErrorCode == LoginErrorCode.Blocked) {
                this.TryRead(this.BlockType)
                if (this.BlockType == LoginBlockType.Punishment) {
                    this.PunishmentData = new Punishment(this);
                }
            }

        }
        else if (Result == 0x03) {
            this.TryRead(byte());
            this.TryRead(byte());
            this.TryRead(string());
            this.TryRead(short());
        }
    }

    Build() {
        this.Reset();

        this.TryWrite(this.Result);
        if (this.Result == 0x01) {
            this.TryWrite(this.AgentServerToken);
            this.AgentServer.Build(this);
        }
        else if (this.Result == 0x02) {
            this.TryWrite(this.ErrorCode);
            if (this.ErrorCode == LoginErrorCode.InvalidCredentials) {
                MaxCurAttempts.Build(this);
            }
            else if (ErrorCode == LoginErrorCode.Blocked) {
                this.TryWrite(this.BlockType);
                if (this.BlockType == LoginBlockType.Punishment) this.PunishmentData.Build(this);
            }
        }
        else if (this.Result == 0x03) {
            // Not Implemented
            this.Reset();
        }

        return this;
    }
}