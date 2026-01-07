async function AutoCaptcha(Event) {
  const { remote } = Event.instance;
  const { writer } = Event.stream;

  const reply = new writer();
  reply.string(Event.config.CAPTCHA);

  await remote.security.Send(0x6323, reply, false, false);

  const send = await remote.security.GetPacketToSend() || [];
  for (const packet of send) {
    await remote.socket.write(Buffer.from(packet));
  }
}

export default AutoCaptcha;