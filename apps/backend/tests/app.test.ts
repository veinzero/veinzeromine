import { describe, expect, it } from "vitest";

import { createApp } from "../src/app.js";

describe("backend app", () => {
  it("returns health data", async () => {
    const app = createApp();
    const response = await app.inject({
      method: "GET",
      url: "/health"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().ok).toBe(true);
    await app.close();
  });

  it("returns a game overview payload", async () => {
    const app = createApp();
    const response = await app.inject({
      method: "GET",
      url: "/api/game/overview"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().brand.title).toBe("VeinZero");
    expect(response.json().agents.length).toBeGreaterThan(0);
    await app.close();
  });
});
