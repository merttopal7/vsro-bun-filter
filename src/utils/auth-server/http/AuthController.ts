import { TokenService } from "../crypto/TokenService";
import { InMemoryTokenStore } from "../crypto/InMemoryTokenStore";


export class AuthController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly tokenStore: InMemoryTokenStore
  ) {}

  async handle(req: Request): Promise<Response> {
    const url = new URL(req.url);

    if (req.method === "POST" && url.pathname === "/auth")
      return this.auth(req);

    if (req.method === "POST" && url.pathname === "/validate")
      return this.validate(req);

    return new Response("Not Found", { status: 404 });
  }

  private auth(req: Request): Response {
    const userId = 123;

    const ip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for") ||
      "0.0.0.0";

    const token = this.tokenService.generate(userId, ip);
    const expiresAt = this.tokenService.getExpireTimestamp();

    // 🔐 RAM'e kaydet
    this.tokenStore.register(token, expiresAt);

    return Response.json({
      token,
      expiresIn: 30
    });
  }

  private async validate(req: Request): Promise<Response> {
    const body = await req.json().catch(() => null);

    if (!body?.token)
      return Response.json({ valid: false }, { status: 400 });

    const ip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for") ||
      "0.0.0.0";

    // 1️⃣ Token kriptografik olarak geçerli mi?
    if (!this.tokenService.validate(body.token, ip))
      return Response.json({ valid: false });

    // 2️⃣ Daha önce kullanılmış mı?
    if (!this.tokenStore.consume(body.token))
      return Response.json({ valid: false });

    return Response.json({ valid: true });
  }
}
