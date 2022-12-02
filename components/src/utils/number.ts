import * as M from "@discovery/prelude/lib/data/maybe";

export const readInt = (i: string): M.Maybe<number> => {
  const n = Number.parseInt(i);
  return !Number.isNaN(n) && Number.isInteger(n) ? M.of(n) : M.empty();
};

export const readFloat = (i: string): M.Maybe<number> => {
  const n = Number.parseFloat(i);
  return !Number.isNaN(n) ? M.of(n) : M.empty();
};

export const mod = (a: number, b: number): number => ((a % b) + b) % b;

export const inRange = (num: number, limit: number, tolerance = 0) =>
  num === limit || (num <= limit + tolerance && num >= limit - tolerance);
