import { describe, expect, it } from "vitest";

describe("PowerWorldGyms branding", () => {
  it("serves the configured project title", async () => {
    const response = await fetch("http://127.0.0.1:3000/");
    expect(response.ok).toBe(true);
    const html = await response.text();
    const title = process.env.VITE_APP_TITLE ?? "PowerWorldGyms Day Pass";
    expect(html).toContain(`<title>${title}</title>`);
  });
});
