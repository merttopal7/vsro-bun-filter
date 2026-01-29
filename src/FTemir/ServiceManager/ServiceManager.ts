import { Service } from "@/utils/Database/Models/FTemir/Service";
import GatewayServer from '@/modules/GatewayServer/GatewayServer';
import AgentServer from '@/modules/AgentServer/AgentServer';
import DownloadServer from "@/modules/DownloadServer/DownloadServer";

export class ServiceManager {
    static TypeDownloadServer = 1;
    static TypeGatewayServer = 2;
    static TypeAgentServer = 3;

    static async FetchWithMachines(machineId?: number): Promise<Array<Service>> {
        try {
            const services: Array<Service> = await Service.fromQuery(
                Service.withMachine(machineId)
            );
            return services;
        } catch (error) {
            console.log(`[FetchWithMachines] ${error.message}`)
            return [];
        }
    }

    static async start(machineId?: number) {
        const services = await ServiceManager.FetchWithMachines(machineId);
        for (let i = 0; i < services.length; i++) {
            if (!services[i].AutoStart) continue;
            ServiceManager.TryToStart(services[i]);
        }
    }

    static TryToStart(service: Service) {
        try {
            switch (service.ServerType) {
                case ServiceManager.TypeDownloadServer:
                    //DownloadServer
                    const _DownloadServer = ServiceManager.DownloadServer(service);
                    _DownloadServer.SetServiceSettings(service);
                    _DownloadServer.start();
                    break;
                case ServiceManager.TypeGatewayServer:
                    //GatewayServer
                    const _GatewayServer = ServiceManager.GatewayServer(service);
                    _GatewayServer.SetServiceSettings(service);
                    _GatewayServer.start();
                    break;
                case ServiceManager.TypeAgentServer:
                    //AgentServer
                    const _AgentServer = new AgentServer();
                    _AgentServer.SetServiceSettings(service);
                    _AgentServer.start();
                    break;
            }
        } catch (error) {
            console.log(`[${service?.Name}] ${error.message}`)
        }
    }

    static DownloadServer() {
        const _DownloadServer = new DownloadServer();
        return _DownloadServer;
    }
    static GatewayServer() {
        const _GatewayServer = new GatewayServer();
        return _GatewayServer;
    }
    static AgentServer() {
        const _AgentServer = new AgentServer();
        return _AgentServer;
    }

}