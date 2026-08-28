import { describe, expect, it } from "vitest";
import {
  clampParam,
  isValidHex,
  makeWavePath,
  randomHex,
} from "./patternMath";

describe("randomHex", () => {
  it("returns a well-formed 6-digit hex color", () => {
    const color = randomHex();
    expect(isValidHex(color)).toBe(true);
  });

  it("is deterministic when given a fixed random source", () => {
    const fixedRand = () => 0;
    expect(randomHex(fixedRand)).toBe("#000000");
  });

  it("produces different colors for different random inputs", () => {
    const colors = new Set(Array.from({ length: 20 }, () => randomHex()));
    expect(colors.size).toBeGreaterThan(1);
  });
});

describe("isValidHex", () => {
  it("accepts valid 6-digit hex strings", () => {
    expect(isValidHex("#ffffff")).toBe(true);
    expect(isValidHex("#3a7fd1")).toBe(true);
  });

  it("rejects malformed strings", () => {
    expect(isValidHex("ffffff")).toBe(false);
    expect(isValidHex("#fff")).toBe(false);
    expect(isValidHex("#gggggg")).toBe(false);
    expect(isValidHex("")).toBe(false);
  });
});

describe("makeWavePath", () => {
  it("starts the path at the given startX and baseY", () => {
    const path = makeWavePath({
      baseY: 100,
      amplitude: 20,
      wavelength: 200,
      startX: 0,
      endX: 400,
    });
    expect(path.startsWith("M 0,100")).toBe(true);
  });

  it("includes a line segment for each step across the range", () => {
    const path = makeWavePath({
      baseY: 0,
      amplitude: 10,
      wavelength: 100,
      startX: 0,
      endX: 220,
      step: 55,
    });
    const segments = path.split(" L ").length - 1;
    expect(segments).toBe(5); // 0, 55, 110, 165, 220
  });

  it("throws for a non-positive wavelength", () => {
    expect(() =>
      makeWavePath({
        baseY: 0,
        amplitude: 10,
        wavelength: 0,
        startX: 0,
        endX: 100,
      })
    ).toThrow();
  });

  it("throws when endX is before startX", () => {
    expect(() =>
      makeWavePath({
        baseY: 0,
        amplitude: 10,
        wavelength: 100,
        startX: 200,
        endX: 100,
      })
    ).toThrow();
  });
});

describe("clampParam", () => {
  it("clamps values above the max", () => {
    expect(clampParam(500, 0, 100)).toBe(100);
  });

  it("clamps values below the min", () => {
    expect(clampParam(-50, 0, 100)).toBe(0);
  });

  it("leaves in-range values untouched", () => {
    expect(clampParam(42, 0, 100)).toBe(42);
  });

  it("falls back to min for NaN input", () => {
    expect(clampParam(NaN, 5, 100)).toBe(5);
  });
});
