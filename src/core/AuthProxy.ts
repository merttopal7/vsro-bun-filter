import Proxy from "@/core/Proxy";
import { tokenService } from "@/utils/auth-server/crypto/TokenService";
import { tokenStore } from "@/utils/auth-server/crypto/InMemoryTokenStore";
import { Session } from "@/core/index";
import type { Instance, ProxyConfig } from "@/core/types";

abstract class AuthProxy extends Proxy {
    protected readonly tokenService = tokenService;
    protected readonly tokenStore = tokenStore;
    protected readonly AUTH_TIMEOUT = 30000;

    constructor(config: ProxyConfig) {
        super(config);
    }

    setupSocketHandlers(
        instance: Instance,
        id: string,
        side: "client" | "remote",
        session: Session
    ): void {
        const socket = instance[side].socket;
        const security = instance[side].security;

        const cleanup = () => this.removeInstance(id);
        socket.once("error", cleanup);
        socket.once("close", cleanup);

        const runtime = instance as any;
        runtime.authorized ??= false;

        let authTimeout: NodeJS.Timeout | null = null;

        if (side === "client" && !runtime.authorized) {
            authTimeout = setTimeout(() => {
                if (!runtime.authorized) {
                    if (this.config.debug) {
                        console.log(`[AUTH]->(${id})->(timeout)`);
                    }
                    socket.destroy();
                }
            }, this.AUTH_TIMEOUT);
        }

        socket.on("data", (data: Buffer) => {
            if (!this.instances.has(id)) return;

            if (side === "client" && !runtime.authorized) {
                const ok = this.handleAuthPacket(data);

                if (!ok) {
                    if (this.config.debug) console.log(`[AUTH]->(${id})->(failed)`);
                    socket.destroy();
                    return;
                }

                runtime.authorized = true;
                if (authTimeout) {
                    clearTimeout(authTimeout);
                    authTimeout = null;
                }

                if (this.config.debug) console.log(`[AUTH]->(${id})->(ok)`);

                const tokenLen = data.readUInt16BE(0);
                const remainingData = data.subarray(2 + tokenLen);
                if (remainingData.length > 0) {
                    socket.emit("data", remainingData);
                }
                return;
            }

            security.Recv(data.toJSON().data);

            this.events.emit("event", {
                sender: side,
                session
            });
        });
    }

    private handleAuthPacket(data: Buffer): boolean {
        try {
            if (data.length < 2) return false;
            
            const tokenLen = data.readUInt16BE(0);
            if (data.length < 2 + tokenLen) return false;
            
            const tokenBuf = data.subarray(2, 2 + tokenLen);
            const token = tokenBuf.toString("utf8");
            
            if (!this.tokenService.validate(token)) return false;
            if (!this.tokenStore.consume(token)) return false;
            
            console.log(`[${this.config.module}] Auth Packet Validated.`)
            return true;
        } catch (err) {
            console.log("[AuthProxy] AUTH PACKET ERROR:", err);
            return false;
        }
    }
}

export default AuthProxy;