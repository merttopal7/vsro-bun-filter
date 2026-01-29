import crypto from "crypto";

type TokenEntry = {
  expiresAt: number;
};
class InMemoryTokenStore {
  private readonly tokens = new Map<string, TokenEntry>();

  constructor() {
    // cleanup loop
    setInterval(() => this.cleanup(), 30_000).unref();
  }
  private normalize(token: string): string {
    return token.trim();
  }
  private fingerprint(token: string): string {
    return crypto
      .createHash("sha256")
      .update(this.normalize(token), "utf8")
      .digest("hex");
  }

  register(token: string, expiresAt: number): void {
    this.tokens.set(this.fingerprint(token), {
      expiresAt
    });
  }

  consume(token: string): boolean {
    const key = this.fingerprint(token);

    const entry = this.tokens.get(key);
    if (!entry) return false;

    if (entry.expiresAt < Date.now()) {
      this.tokens.delete(key);
      return false;
    }

    this.tokens.delete(key);
    return true;
  }

  private cleanup(): void {
    const now = Date.now();

    for (const [key, entry] of this.tokens) {
      if (entry.expiresAt < now)
        this.tokens.delete(key);
    }
  }
}

export const tokenStore = new InMemoryTokenStore();
