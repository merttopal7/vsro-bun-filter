import { tokenService } from "../crypto/TokenService";
import { tokenStore } from "../crypto/InMemoryTokenStore";
import crypto from "crypto";
import { Database } from "@/utils/Database";
import { jwtService } from "../jwt/JwtService";
import { AuthMiddleware } from "@/utils/auth-server/middlewares/auth.middleware";

export class AuthController {
  private readonly tokenStore = tokenStore;
  private readonly tokenService = tokenService;
  private readonly jwtService = jwtService;

  constructor() { }

  private md5(str: string): string {
    return crypto.createHash("md5").update(str).digest("hex");
  }

  async handle(req: Request): Promise<Response> {
    const url = new URL(req.url);

    if (req.method === "POST" && url.pathname === "/auth")
      return this.auth(req);

    // Yeni Refresh Rotası (Public)
    if (req.method === "POST" && url.pathname === "/refresh")
      return this.refresh(req);

    if (req.method === "POST" && url.pathname === "/tcp-token")
      return AuthMiddleware(req, () => this.tcpToken(req));

    if (req.method === "GET" && url.pathname === "/me")
      return AuthMiddleware(req, () => this.me(req));

    return new Response("Not Found", { status: 404 });
  }

  private async refresh(req: Request): Promise<Response> {
    const body = await req.json().catch(() => null);

    if (!body?.refreshToken) {
      return Response.json({ error: true, message: "Refresh token is required!" }, { status: 400 });
    }

    const user = await Database.SRO_VT_ACCOUNT()("TB_User")
      .where({ RefreshToken: body.refreshToken })
      .first();

    if (!user) {
      return Response.json({ error: true, message: "Invalid refresh token!" }, { status: 403 });
    }

    const newJwt = this.jwtService.sign({ userId: user.JID });

    return Response.json({
      error: false,
      accessToken: newJwt,
      expiresIn: 900
    });
  }


  private async auth(req: Request): Promise<Response> {
    const body = await req.json().catch(() => null);

    if (!body?.username || !body?.password)
      return Response.json(
        { error: true, message: "username and password is required!" },
        { status: 400 }
      );

    const user = await Database
      .SRO_VT_ACCOUNT()("TB_User")
      .where({
        StrUserID: body.username,
        password: this.md5(body.password),
      })
      .first();

    if (!user)
      return Response.json(
        { error: true, message: "Not found user!" },
        { status: 404 }
      );

    const jwt = this.jwtService.sign({
      userId: user.JID,
    });

    return Response.json({
      error: false,
      jwt,
      expiresIn: 900, // 15 dk
    });
  }

  private async tcpToken(req: Request): Promise<Response> {
    // @ts-ignore
    const user = (req as any).user;

    const token = this.tokenService.generate(user.JID);
    const expiresAt = this.tokenService.getExpireTimestamp();

    this.tokenStore.register(token, expiresAt);

    return Response.json({
      token,
      expiresIn: expiresAt
    });
  }


  private async me(req: Request): Promise<Response> {
    const user = (req as any).user;

    return new Response(
      JSON.stringify({
        error: false,
        user: {
          id: user.JID,
          username: user.StrUserID,
        },
      }),
      { status: 200 }
    );
  }
}
