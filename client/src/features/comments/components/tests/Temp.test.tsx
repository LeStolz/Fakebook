import { sum } from "../Temp";
import { describe, expect, it } from "vitest";

describe("sum", () => {
  it("returns 0 if no arguments are passed", () => {
    expect(sum()).toBe(0);
  });

  it("returns that same argument if a single argument is passed", () => {
    expect(sum(123)).toBe(123);
  });

  it("returns the sum of the arguments if multiple arguments are passed", () => {
    expect(sum(1, 2, 3)).toBe(6);
  });
});
