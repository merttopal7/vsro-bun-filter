import crypto from "crypto";

export class TokenService {
  private readonly secret: Buffer;
  private readonly ttlSeconds: number;

  constructor(secret: string, ttlSeconds = 30) {
    this.secret = Buffer.from(secret);
    this.ttlSeconds = ttlSeconds;
  }

  private hashIp(ip: string): number {
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
      hash = ((hash << 5) - hash) + ip.charCodeAt(i);
      hash |= 0;
    }
    return hash >>> 0;
  }

  generate(userId: number, ip: string): string {
    const buffer = Buffer.alloc(64);
    let offset = 0;

    buffer.writeUInt32BE(userId, offset);
    offset += 4;

    const exp = Math.floor(Date.now() / 1000) + this.ttlSeconds;
    buffer.writeBigInt64BE(BigInt(exp), offset);
    offset += 8;

    buffer.writeUInt32BE(this.hashIp(ip), offset);
    offset += 4;

    crypto.randomFillSync(buffer.subarray(offset, offset + 16));
    offset += 16;

    const hmac = crypto
      .createHmac("sha256", this.secret)
      .update(buffer.subarray(0, offset))
      .digest();

    hmac.copy(buffer, offset);

    return buffer.toString("base64");
  }

  validate(tokenBase64: string, ip: string): boolean {
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

    const ipHash = payload.readUInt32BE(12);
    if (ipHash !== this.hashIp(ip))
      return false;

    return true;
  }
  getExpireTimestamp(): number {
    return Date.now() + this.ttlSeconds * 1000;
  }

}
