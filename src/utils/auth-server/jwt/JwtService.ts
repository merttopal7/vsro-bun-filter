import jwt from "jsonwebtoken";

class JwtService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn = "15m"
  ) { }

  sign(payload: object): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  verify<T = any>(token: string): T | null {
    try {
      return jwt.verify(token, this.secret) as T;
    } catch {
      return null;
    }
  }
}
export const jwtService = new JwtService("JWT_SECRET_CHANGE_THIS", "15m");