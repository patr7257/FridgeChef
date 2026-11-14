import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const dir = __dirname;

describe("link preview", () => {
  it("sets metadataBase to the production origin and a large twitter card", () => {
    const layout = readFileSync(path.join(dir, "layout.tsx"), "utf8");
    expect(layout).toContain(
      'metadataBase: new URL("https://fridgechef.patrickrobel.dk")',
    );
    expect(layout).toContain('card: "summary_large_image"');
  });

  it.each(["opengraph-image", "twitter-image"])(
    "%s is a 1200x630 PNG with Danish alt text",
    (name) => {
      const png = readFileSync(path.join(dir, `${name}.png`));
      expect(png.subarray(1, 4).toString("ascii")).toBe("PNG");
      expect(png.readUInt32BE(16)).toBe(1200);
      expect(png.readUInt32BE(20)).toBe(630);
      const alt = readFileSync(path.join(dir, `${name}.alt.txt`), "utf8");
      expect(alt).toBe(
        "FridgeChef: tag et billede af dit køleskab og få forslag til aftensmad",
      );
    },
  );
});
