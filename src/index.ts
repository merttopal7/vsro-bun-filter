import GatewayServer from '@/modules/GatewayServer/GatewayServer';

const main = async () => {
  const gatewayServer = new GatewayServer();
  gatewayServer.start();
};
main();

