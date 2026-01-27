import { serve } from "bun";
import { tokenStore } from "./crypto/InMemoryTokenStore";
import { tokenService } from "./crypto/TokenService";
import { AuthController } from "./http/AuthController";

export class AuthServer {
  private readonly controller: AuthController;

  constructor() {

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
