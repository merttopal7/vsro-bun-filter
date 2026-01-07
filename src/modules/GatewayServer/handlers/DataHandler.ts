import { Packet, Session, StaticTypes } from '@/core';
import { ModuleRegistry, PacketResultType } from '@/utils/types'
import { SERVER_GATEWAY_SHARD_LIST_RESPONSE, SERVER_GATEWAY_LOGIN_RESPONSE, SERVER_GATEWAY_PATCH_RESPONSE, SERVER_GATEWAY_LOGIN_IBUV_CHALLENGE } from '@/modules/GatewayServer/actions';
const { string, byte, int, short, stringASCII } = StaticTypes;


export class DataHandler {
    constructor(server?: ModuleRegistry) {
        if (server)
            this.register(server);
    }

    register(server: ModuleRegistry) {
        server.RegisterModuleHandler(SERVER_GATEWAY_SHARD_LIST_RESPONSE, this.ON_SERVER_GATEWAY_SHARD_LIST_RESPONSE);
        server.RegisterModuleHandler(SERVER_GATEWAY_PATCH_RESPONSE, this.ON_SERVER_GATEWAY_PATCH_RESPONSE);
        server.RegisterModuleHandler(SERVER_GATEWAY_LOGIN_RESPONSE, this.ON_SERVER_GATEWAY_LOGIN_RESPONSE);
        server.RegisterModuleHandler(SERVER_GATEWAY_LOGIN_IBUV_CHALLENGE, this.ON_SERVER_GATEWAY_LOGIN_IBUV_CHALLENGE);
    }

    async ON_SERVER_GATEWAY_SHARD_LIST_RESPONSE(data: SERVER_GATEWAY_SHARD_LIST_RESPONSE, session: Session) {
        data.Shard.Name.set("Test");

        return data;
    };

    async ON_SERVER_GATEWAY_PATCH_RESPONSE(data: SERVER_GATEWAY_PATCH_RESPONSE, session: Session) {
        if (data.HasUpdate.get()) {
            data.DownloadServer.Host.set("54.37.80.146");
            data.DownloadServer.Port.set(9002);
        }

        return data;
    };

    async ON_SERVER_GATEWAY_LOGIN_IBUV_CHALLENGE(data: ON_SERVER_GATEWAY_LOGIN_IBUV_CHALLENGE, session: Session) {
        console.log("ON_SERVER_GATEWAY_LOGIN_IBUV_CHALLENGE", data.opcode);

        const pkg: Packet =
            new Packet(0x6323)
                .TryWrite(string("0"));

        await session.SendToServer(pkg);


        data.ResultType = PacketResultType.Block;
        return data;
    };

    async ON_SERVER_GATEWAY_LOGIN_RESPONSE(data: SERVER_GATEWAY_LOGIN_RESPONSE, session: Session) {
        console.log("LOGIN_RESPONSE", data.opcode);

        data.AgentServer.Host.set("54.37.80.146");
        data.AgentServer.Port.set(9003);

        return data;
    };
}