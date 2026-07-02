import { describe, it, expect } from "vitest";
import { pickName } from "./title-lang";

describe("pickName", () => {
  const anime = { title: "Attack on Titan", titleRomaji: "Shingeki no Kyojin" };

  it("returns the English title in 'en' mode", () => {
    expect(pickName(anime, "en")).toBe("Attack on Titan");
  });

  it("returns the romaji title in 'jp' mode", () => {
    expect(pickName(anime, "jp")).toBe("Shingeki no Kyojin");
  });

  it("falls back to the base title when romaji is missing", () => {
    expect(pickName({ title: "Bleach" }, "jp")).toBe("Bleach");
  });
});
