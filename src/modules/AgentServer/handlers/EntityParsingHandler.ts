import { Packet, StaticTypes } from '@/core';
import { ModuleRegistry } from '@/core/types';
import { PacketResultType } from '@/utils/Types'
import { SERVER_CHARACTER_DATA_BEGIN, SERVER_CHARACTER_DATA, SERVER_CHARACTER_DATA_END } from '@/modules/AgentServer/actions';
import { Data, CharInfo, Session } from '@/core/Session';
const { string, byte, int, short, stringASCII } = StaticTypes;


export class EntityParsingHandler {
    constructor(server?: ModuleRegistry) {
        if (server)
            this.register(server);
    }

    register(server: ModuleRegistry) {
        server.RegisterModuleHandler(SERVER_CHARACTER_DATA_BEGIN, this.ON_SERVER_CHARACTER_DATA_BEGIN)
        server.RegisterModuleHandler(SERVER_CHARACTER_DATA, this.ON_SERVER_CHARACTER_DATA)
        server.RegisterModuleHandler(SERVER_CHARACTER_DATA_END, this.ON_SERVER_CHARACTER_DATA_END)
    }

    async ON_SERVER_CHARACTER_DATA_BEGIN(data: SERVER_CHARACTER_DATA_BEGIN, session: Session) {
        const charInfo: CharInfo = session.GetData(Data.CharInfo, new CharInfo());
        charInfo.Initalize();
        
        return data;
    }
    async ON_SERVER_CHARACTER_DATA(data: SERVER_CHARACTER_DATA, session: Session) {
        const charInfo: CharInfo = session.GetData(Data.CharInfo, new CharInfo());
        charInfo.Append(data);
        return data;
    }
    async ON_SERVER_CHARACTER_DATA_END(data: SERVER_CHARACTER_DATA_END, session: Session) {
        const charInfo: CharInfo = session.GetData(Data.CharInfo, new CharInfo());
        charInfo.Read();
        return data;
    }

}