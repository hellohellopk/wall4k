/**
 * Pure, testable helper functions extracted from the wallpaper-generation
 * logic used in client/src/pages/Home.tsx. Keeping these as standalone,
 * side-effect-free functions makes it possible to unit test the core
 * geometry/color math without needing a browser or DOM environment.
 */

/**
 * Generates a random 6-digit hex color string, e.g. "#3a7fd1".
 * Mirrors the `randomHex()` helper used for randomizing palette swatches.
 */
export function randomHex(rand: () => number = Math.random): string {
  const value = Math.floor(rand() * 16777215);
  return `#${value.toString(16).padStart(6, "0")}`;
}

/**
 * Validates that a string is a well-formed 6-digit hex color.
 */
export function isValidHex(color: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(color);
}

export interface WavePathOptions {
  baseY: number;
  amplitude: number;
  wavelength: number;
  startX: number;
  endX: number;
  step?: number;
}

/**
 * Builds an SVG path `d` attribute string describing a horizontal sine wave,
 * matching the shape produced by the `makeWavePath()` helper used for the
 * interlaced soft-wave pattern.
 */
export function makeWavePath({
  baseY,
  amplitude,
  wavelength,
  startX,
  endX,
  step = 55,
}: WavePathOptions): string {
  if (wavelength <= 0) {
    throw new Error("wavelength must be greater than 0");
  }
  if (endX < startX) {
    throw new Error("endX must be greater than or equal to startX");
  }

  let d = `M ${startX},${baseY}`;
  for (let x = startX; x <= endX; x += step) {
    const y = baseY + amplitude * Math.sin((2 * Math.PI * x) / wavelength);
    d += ` L ${x.toFixed(2)},${y.toFixed(2)}`;
  }
  return d;
}

/**
 * Clamps a numeric pattern parameter (e.g. amplitude, beam count, radius)
 * to a safe [min, max] range so extreme user input can't produce a broken
 * or extremely slow render.
 */
export function clampParam(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}
