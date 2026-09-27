import { describe, expect, it } from "vitest";
import { getSriLankaAccessExpiryAt } from "./db";

describe("buyer access session expiry", () => {
  it("returns 10 PM Sri Lanka time for the same calendar day", () => {
    const beforeCutoff = getSriLankaAccessExpiryAt(new Date("2026-09-27T10:00:00.000Z"));
    expect(beforeCutoff.toISOString()).toBe("2026-09-27T16:30:00.000Z");

    const afterCutoff = getSriLankaAccessExpiryAt(new Date("2026-09-27T17:00:00.000Z"));
    expect(afterCutoff.toISOString()).toBe("2026-09-27T16:30:00.000Z");
  });
});
