import type { ProxyContext, ProxyEvent } from "@/core/types";
import { PacketResultType } from "@/utils/Types";

function CreateEventHandler(ctx: ProxyContext) {
  return async function Event(event: ProxyEvent): Promise<void> {
    const target = event.sender === "client" ? "remote" : "client";
    const receive = (await event.session.instance[event.sender].security.GetPacketToRecv()) || [];
    for (const packet of receive) {
      if (
        (target === "remote" && ctx.config.whitelist?.[packet.opcode]) ||
        target === "client"
      ) {
        const handler = ctx.middlewares[event.sender]?.[packet.opcode] ?? false;
        const _packet = packet;
        if (handler) {
          const packetClass = new handler.PacketClass();
          packetClass.BindPacket(packet);
          packetClass.Read();
          const NewPacket = await handler.action(packetClass, event.session);
          const built = NewPacket.Build();
          const data = built.writer.toData();
          if (data.length) {
            _packet.data = data;
            if (data.length > 4096)
              _packet.massive = true;
          }
          switch (built.ResultType) {
            case PacketResultType.Nothing:
              await event.session.instance[target].security.Send(
                _packet.opcode,
                _packet.data,
                _packet.encrypted,
                _packet.massive
              );
              break;
            case PacketResultType.Block:
              console.log("Blocked!")
              break;
            case PacketResultType.Disconnect:
              console.log("Disconnected!", event.session.client.id)
              ctx.server.removeInstance(event.session.client.id);
              break;
          }
        } else if (_packet) {
          await event.session.instance[target].security.Send(
            _packet.opcode,
            _packet.data,
            _packet.encrypted,
            _packet.massive
          );
        }
      } else if (ctx.config.debug && target === "remote") {
        console.log(
          `[${event.sender}]->(0x${packet.opcode.toString(16)})->${target}: NOT WHITELISTED`
        );
      }
    }

    const send =
      (await event.session.instance[target].security.GetPacketToSend()) || [];

    for (const packet of send) {
      event.session.instance[target].socket.write(Buffer.from(packet));
    }
  }
}

export default CreateEventHandler;