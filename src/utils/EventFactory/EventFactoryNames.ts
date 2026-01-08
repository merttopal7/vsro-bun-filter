export class EventFactoryNames {
    // Session Stuff
    static OnSessionStart = "OnSessionStart"; // ISession
    static OnSessionEnd = "OnSessionEnd"; // ISession

    static OnClientReceivePacket = "OnClientReceivePacket"; // DateTime, FakeServer.Service.ServerType, ISession, Packet
    static OnClientTransferPacket = "OnClientTransferPacket"; // DateTime, FakeServer.Service.ServerType, ISession, Packet
    static OnModuleReceivePacket = "OnModuleReceivePacket"; // DateTime, FakeServer.Service.ServerType, ISession, Packet
    static OnModuleTransferPacket = "OnModuleTransferPacket"; // DateTime, FakeServer.Service.ServerType, ISession, Packet

    // Login and pre game stuff
    static OnUserAgentLogin = "OnUserAgentLogin"; // ISession
    static OnUserJoinCharScreen = "OnUserJoinCharScreen"; // ISession
    static OnUserLeaveCharScreen = "OnUserLeaveCharScreen"; // ISession
    static OnUserCharnameSent = "OnUserCharnameSent"; // ISession

    // Game stuff
    static OnCharacterFirstSpawn = "OnCharacterFirstSpawn"; // ISession
    static OnCharacterGameReadyChange = "OnCharacterGameReadyChange"; // ISession, (Bool) Status
    static OnCharacterSpawn = "OnCharacterSpawn"; // ISession, (Bool) Status

    // Server Stuff
    static OnAsyncServerStart = "OnAsyncServerStart"; // IAsyncServer
    static OnAsyncServerStop = "OnAsyncServerStart"; // IAsyncServer

    // Command Stuff
    static OnCommandExecution = "OnCommandExecution"; // inputString, Command || null
}