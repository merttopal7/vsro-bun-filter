import { Database } from "@/utils/Database";
import { jwtService } from "@/utils/auth-server/jwt/JwtService";


export async function AuthMiddleware(
  req: Request,
  next: () => Promise<Response>
): Promise<Response> {
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return new Response(
      JSON.stringify({ error: true, message: "Token required" }),
      { status: 401 }
    );
  }

  const payload = jwtService.verify<{ userId: number }>(token);
  if (!payload) {
    return new Response(
      JSON.stringify({ error: true, message: "Invalid token" }),
      { status: 401 }
    );
  }

  // Veritabanından kullanıcı bilgilerini al
  const user = await Database.SRO_VT_ACCOUNT()("TB_User")
    .where({ JID: payload.userId })
    .first();

  if (!user) {
    return new Response(
      JSON.stringify({ error: true, message: "User not found" }),
      { status: 404 }
    );
  }

  // @ts-ignore → req.user ekliyoruz
  (req as any).user = user;

  return next();
}
