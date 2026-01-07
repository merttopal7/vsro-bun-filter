
async function HardwareID(Event, packet) {
  const { stream, config, service } = Event;
  const { reader } = stream;
  const read = new reader(packet.data);
  const HWID = Buffer.from(read.string()).toString('base64');
  
  if (config.debug) console.log(`[HWID RECEIVED]->${JSON.stringify(Event.client)}->"${HWID}"`);



  // const currentConnection = {
  //   hwid: HWID,
  //   port: Event.client.port
  // };

  // const initialState = {
  //   clients: [{

  //   }]
  // };

  // let currentState = cache.get(Event.client.ip) || initialState;

  // let checkHWID = currentIPState.clients.find(client => client.hwid = HWID);




  //cache.set(Event.client.ip, store);
  return;
}

export default HardwareID;