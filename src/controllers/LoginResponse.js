const createError = writer => {
  const write = new writer();
  write.uint8(3);
  write.uint8(8);
  return write.toData();
};

const createAgentRedirect = (writer, data) => {
  const write = new writer();
  write.uint8(data.status);
  write.uint32(data.token);
  write.string(data.HOST);
  write.uint16(data.PORT);
  return write.toData();
};

async function LoginResponse(Event, packet) {
  const { AgentServer } = Event.config.REDIRECT;
  const { writer, reader } = Event.stream;

  const read = new reader(packet.data);
  const status = read.uint8();
  let _packet = {};

  switch (status) {
    case 1:
      const token = read.uint32();
      _packet = {
        ...packet,
        data: createAgentRedirect(writer, {
          status: status,
          token: token,
          ...AgentServer
        })
      };
      break;
    default:
      _packet = packet;
      break;
  }

  // failure packet
  // _packet = {
  //   ...packet,
  //   data: createError(writer)
  // };

  return _packet;
}

export default LoginResponse;