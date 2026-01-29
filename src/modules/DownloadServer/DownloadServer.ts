import AuthProxy from '@/core/AuthProxy';
import Proxy from '@/core/Proxy';
import configuration from '@/modules/DownloadServer/Whitelist';
import { DataHandler } from "@/modules/DownloadServer/handlers/DataHandler";

class DownloadServer extends AuthProxy {
    constructor() {
        configuration.debug = false;
        configuration.module = "DownloadServer";
        super(configuration);

        const dataHandler = new DataHandler();
        dataHandler.register(this);
    }
}

export default DownloadServer;