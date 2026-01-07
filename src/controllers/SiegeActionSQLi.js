async function SiegeActionSQLi(Event, packet) {
  const { reader } = Event.stream;
  const read = new reader(packet.data);
  const message = read.string('ascii');
  
  return /[^A-Z a-z0-9.,!?]+/g.test(message) ? false : packet;
}

export default SiegeActionSQLi;