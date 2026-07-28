import { describe, expect, it } from "vitest";
import { fitWithin } from "@/lib/images";

describe("fitWithin", () => {
  it("scales landscape photos down to the max edge", () => {
    expect(fitWithin(4032, 3024, 1024)).toEqual({ width: 1024, height: 768 });
  });

  it("scales portrait photos down to the max edge", () => {
    expect(fitWithin(3024, 4032, 1024)).toEqual({ width: 768, height: 1024 });
  });

  it("never upscales small images", () => {
    expect(fitWithin(640, 480, 1024)).toEqual({ width: 640, height: 480 });
  });

  it("never returns zero dimensions", () => {
    expect(fitWithin(10000, 1, 1024).height).toBe(1);
  });
});
