import { StaticTypes } from '@/core';
import { ModuleRegistry } from '@/core/types';
const { string, byte, int, short, stringASCII } = StaticTypes;


export class DataHandler {
    constructor(server?: ModuleRegistry) {
        if (server)
            this.register(server);
    }

    register(server: ModuleRegistry) {

    }

}