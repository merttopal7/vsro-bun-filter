import { serve } from "bun";
import { InMemoryTokenStore } from "./crypto/InMemoryTokenStore";
import { TokenService } from "./crypto/TokenService";
import { AuthController } from "./http/AuthController";

export class AuthServer {
  private readonly controller: AuthController;

  constructor() {
    const tokenService = new TokenService(
      "SUPER_SECRET_KEY_CHANGE_THIS",
      30
    );

    const tokenStore = new InMemoryTokenStore();

    this.controller = new AuthController(
      tokenService,
      tokenStore
    );
  }

  start(port: number): void {
    serve({
      port,
      fetch: (req) => this.controller.handle(req)
    });

    console.log(`[Auth Server] Running on http://localhost:${port}`);
  }
}
