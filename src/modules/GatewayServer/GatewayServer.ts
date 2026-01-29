import AuthProxy from '@/core/AuthProxy';
import Proxy from '@/core/Proxy';
import configuration from '@/modules/GatewayServer/Whitelist';
import { DataHandler } from "@/modules/GatewayServer/handlers/DataHandler";

class GatewayServer extends AuthProxy {
    constructor() {
        configuration.debug = false;
        configuration.module = "GatewayServer";
        super(configuration);

        const dataHandler = new DataHandler();
        dataHandler.register(this);
    }
}

export default GatewayServer;