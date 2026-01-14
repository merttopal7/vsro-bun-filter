import { FTemir } from '@/FTemir';
import GatewayServer from '@/modules/GatewayServer/GatewayServer';
import AgentServer from '@/modules/AgentServer/AgentServer';
import { AuthServer } from '@/utils/auth-server/AuthServer';

const main = async () => {
  await FTemir.Initalize();

  const gatewayServer = new GatewayServer();
  gatewayServer.start();

  new AgentServer().start();
  const authServer = new AuthServer();
  authServer.start(3000);
};

main();