import { FTemir } from '@/FTemir';

const main = async () => {
  await FTemir.Initalize();
  await FTemir.StartAuthServer();
  await FTemir.StartServiceManager(1);


  // Start Service Manually
  const ServiceManager = FTemir.GetServiceManager();

  const _agent = ServiceManager.AgentServer();
  _agent.config.module = "CustomAgentServer";
  _agent.config.LOCAL.HOST = "127.0.0.1";
  _agent.config.LOCAL.PORT = 9040;
  _agent.config.REMOTE.HOST = "127.0.0.1";
  _agent.config.REMOTE.PORT = 9041;
  _agent.start();

};

main();