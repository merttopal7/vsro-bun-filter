import crypto from "crypto";

class TokenService {
  private readonly secret: Buffer;
  private readonly ttlSeconds: number;

  constructor(secret: string, ttlSeconds = 30) {
    this.secret = Buffer.from(secret);
    this.ttlSeconds = ttlSeconds;
  }

  generate(userId: number): string {
    const buffer = Buffer.alloc(64);
    let offset = 0;

    // userId
    buffer.writeUInt32BE(userId, offset);
    offset += 4;

    // exp (unix seconds)
    const exp = Math.floor(Date.now() / 1000) + this.ttlSeconds;
    buffer.writeBigInt64BE(BigInt(exp), offset);
    offset += 8;

    // random nonce
    crypto.randomFillSync(buffer.subarray(offset, offset + 20));
    offset += 20;

    // HMAC(payload)
    const hmac = crypto
      .createHmac("sha256", this.secret)
      .update(buffer.subarray(0, offset))
      .digest();

    hmac.copy(buffer, offset);
    const generated = buffer.toString("base64")
      .replace(/\+/g, "-") // '+' yerine '-'
      .replace(/\//g, "_") // '/' yerine '_'
      .replace(/=+$/, "");
    console.log("generated", generated);
    return generated;
  }

  validate(tokenBase64: string): boolean {
    tokenBase64 = tokenBase64
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    let token: Buffer;

    try {
      token = Buffer.from(tokenBase64, "base64");
    } catch {
      return false;
    }

    if (token.length !== 64)
      return false;

    const payload = token.subarray(0, 32);
    const hmac = token.subarray(32);

    const expected = crypto
      .createHmac("sha256", this.secret)
      .update(payload)
      .digest();

    if (!crypto.timingSafeEqual(hmac, expected))
      return false;

    const exp = payload.readBigInt64BE(4);
    const now = BigInt(Math.floor(Date.now() / 1000));

    if (exp < now)
      return false;

    return true;
  }

  getExpireTimestamp(): number {
    return Date.now() + this.ttlSeconds * 1000;
  }
}

export const tokenService = new TokenService("SUPER_SECRET_KEY_CHANGE_THIS", 30);