import type { ProxyContext, ProxyEvent } from "@/core/types";
import { PacketResultType } from "@/utils/types";

function CreateEventHandler(ctx: ProxyContext) {
  return async function Event(event: ProxyEvent): Promise<void> {
    const target = event.sender === "client" ? "remote" : "client";
    const receive = (await event.session.instance[event.sender].security.GetPacketToRecv()) || [];

    for (const packet of receive) {
      if (
        (target === "remote" && ctx.config.whitelist?.[packet.opcode]) ||
        target === "client"
      ) {
        const middleware = ctx.middlewares[event.sender]?.[packet.opcode] ?? false;
        const _packet = packet;
        if (middleware) {
          const packetClass = new middleware.packetClass();
          packetClass.bindPacket(packet);
          packetClass.Read();
          const _handler = await middleware.handler(packetClass, event.session);
          const built = _handler.Build();
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
          `[${event.sender}]->(${packet.opcode})->${target}: NOT WHITELISTED`
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