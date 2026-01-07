import GatewayServer from '@/modules/GatewayServer/GatewayServer';

const main = async () => {
  // module.middleware('client', 0xCAFE, ctrl.HardwareID);
  // module.middleware('remote', 0xA100, ctrl.RedirectDownload);
  // module.middleware('remote', 0xA101, ctrl.RewriteShardList);
  // module.middleware('remote', 0xA102, ctrl.LoginResponse);
  // module.middleware('remote', 0x2322, ctrl.AutoCaptcha);

  const gatewayServer = new GatewayServer();
  gatewayServer.start();
};
main();

