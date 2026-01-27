import { FTemir } from '@/FTemir';
import GatewayServer from '@/modules/GatewayServer/GatewayServer';
import AgentServer from '@/modules/AgentServer/AgentServer';
import { AuthServer } from '@/utils/auth-server/AuthServer';

const main = async () => {
  await FTemir.Initalize();
  
  
  new AuthServer().start(3000);
  new GatewayServer().start();
  new AgentServer().start();
};

main();