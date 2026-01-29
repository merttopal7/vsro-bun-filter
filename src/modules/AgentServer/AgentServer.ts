import configuration from '@/modules/AgentServer/Whitelist';
import { ExploitHandler } from "@/modules/AgentServer/handlers/ExploitHandler";
import { DataHandler } from "@/modules/AgentServer/handlers/DataHandler";
import { EntityParsingHandler } from "@/modules/AgentServer/handlers/EntityParsingHandler";
import AuthProxy from '@/core/AuthProxy';

class AgentServer extends AuthProxy {
    constructor() {
        configuration.debug = false;
        configuration.module = "AgentServer";
        super(configuration);

        new EntityParsingHandler(this);
        new ExploitHandler(this);
        new DataHandler(this);
    }
}

export default AgentServer;