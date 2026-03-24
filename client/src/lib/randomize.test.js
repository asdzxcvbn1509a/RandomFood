import { describe, expect, it } from "vitest";
import { pickRandomOne } from "./randomize.js";

describe("pickRandomOne", () => {
  it("returns null for empty list", () => {
    expect(pickRandomOne([])).toBeNull();
  });

  it("returns item from list", () => {
    const items = [1, 2, 3];
    const result = pickRandomOne(items);
    expect(items).toContain(result);
  });
});
