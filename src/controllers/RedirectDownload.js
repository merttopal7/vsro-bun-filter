async function RedirectAgent(Event, packet) {
  const { DownloadServer } = Event.config.REDIRECT;
  const { reader, writer } = Event.stream;

  const read = new reader(packet.data);
  const status = read.uint8();

  let _packet = {};

  if (status == 2) {
    const statusCode = read.uint8();
    if (statusCode == 2) {
      read.string();
      read.uint16();

      let version = read.uint32();
      let hasEntry = read.uint8();

      const write = new writer();
      write.uint8(status);
      write.uint8(statusCode);
      write.string(DownloadServer.HOST);
      write.uint16(DownloadServer.PORT);
      write.uint32(version);
      write.uint8(hasEntry);

      while (hasEntry == 1) {
        const file = {
          id: read.uint32(),
          name: read.string(),
          path: read.string(),
          size: read.uint32(),
          toPack: read.uint8()
        };

        hasEntry = read.uint8();

        write.uint32(file.id);
        write.string(file.name);
        write.string(file.path);
        write.uint32(file.size);
        write.uint8(file.toPack);
        write.uint8(hasEntry);
      }

      _packet = {
        ...packet,
        data: write.toData()
      };
    }
  } else {
    _packet = packet;
  }
  
  return _packet;
}

export default RedirectAgent;