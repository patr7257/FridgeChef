import { describe, expect, it } from "vitest";
import { createRateLimiter } from "@/lib/ratelimit";

describe("createRateLimiter", () => {
  it("allows up to the limit inside the window, then blocks", () => {
    const limiter = createRateLimiter(3, 1000);
    expect(limiter.check("ip", 0)).toBe(true);
    expect(limiter.check("ip", 1)).toBe(true);
    expect(limiter.check("ip", 2)).toBe(true);
    expect(limiter.check("ip", 3)).toBe(false);
  });

  it("frees slots when old hits fall out of the window", () => {
    const limiter = createRateLimiter(2, 1000);
    expect(limiter.check("ip", 0)).toBe(true);
    expect(limiter.check("ip", 500)).toBe(true);
    expect(limiter.check("ip", 900)).toBe(false);
    expect(limiter.check("ip", 1200)).toBe(true);
  });

  it("tracks keys independently", () => {
    const limiter = createRateLimiter(1, 1000);
    expect(limiter.check("a", 0)).toBe(true);
    expect(limiter.check("b", 0)).toBe(true);
    expect(limiter.check("a", 1)).toBe(false);
  });
});
