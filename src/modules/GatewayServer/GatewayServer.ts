import Proxy from '@/core/Proxy';
import configuration from '@/modules/GatewayServer/config';
import { DataHandler } from "@/modules/GatewayServer/handlers/dataHandler";

class GatewayServer extends Proxy {
    constructor() {
        super(configuration);

        const dataHandler = new DataHandler();
        dataHandler.register(this);
    }
}

export default GatewayServer;