import { Packet, Session, StaticTypes } from '@/core';
import { ModuleRegistry } from '@/core/types';
import { PacketResultType } from '@/utils/Types'
import { CLIENT_GAME_READY } from '../actions/CLIENT_GAME_READY';
import { Data } from '@/core/Session';
import { EventFactory, EventFactoryNames } from '@/utils/EventFactory';
const { string, byte, int, short, stringASCII } = StaticTypes;


export class DataHandler {
    constructor(server?: ModuleRegistry) {
        if (server)
            this.register(server);
    }

    register(server: ModuleRegistry) {
        server.RegisterClientHandler(CLIENT_GAME_READY, this.ON_CLIENT_GAME_READY);
    }

    async ON_CLIENT_GAME_READY(data: CLIENT_GAME_READY, session: Session) {
        const charScreen = session.GetData(Data.CharScreen, true);
        session.SetData(Data.CharacterGameReady, true);
        session.SetData(Data.CharacterGameReadyTimestamp, Date.now());
        if (charScreen) {
            EventFactory.Publish(EventFactoryNames.OnUserLeaveCharScreen, session);
            session.SetData(Data.CharScreen, false);
        }

        return data;
    }

}