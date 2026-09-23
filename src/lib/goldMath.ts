// Myanmar gold unit conversion helpers
// 1 Kyat (ကျပ်) = 16 Pae (ပဲ)
// 1 Pae (ပဲ) = 8 Yway (ရွှေး)
// 1 Kyat = 128 Yway

export const MM_DIGITS = ["၀", "၁", "၂", "၃", "၄", "၅", "၆", "၇", "၈", "၉"];

/** Detect whether a string contains Myanmar numerals */
export function hasMyanmarDigits(input: string): boolean {
  return /[၀-၉]/.test(input);
}

/** Convert Myanmar digits inside a string to English (Arabic) digits */
export function toEnglishDigits(input: string): string {
  return input.replace(/[၀-၉]/g, (d) => String(MM_DIGITS.indexOf(d)));
}

/** Convert English digits inside a string to Myanmar digits */
export function toMyanmarDigits(input: string): string {
  return input.replace(/[0-9]/g, (d) => MM_DIGITS[Number(d)]);
}

/** Parse a raw user-entered numeric string (may contain Myanmar digits, commas, spaces) into a number */
export function parseFlexibleNumber(raw: string): number {
  if (!raw) return NaN;
  const normalized = toEnglishDigits(raw).replace(/,/g, "").trim();
  if (normalized === "") return NaN;
  return Number(normalized);
}

/** Format a number with thousand separators, optionally mirroring Myanmar digit style */
export function formatNumber(
  value: number,
  useMyanmar: boolean,
  maxDecimals = 2
): string {
  if (!Number.isFinite(value)) return useMyanmar ? "၀" : "0";
  const rounded =
    Math.round(value * Math.pow(10, maxDecimals)) / Math.pow(10, maxDecimals);
  const formatted = rounded.toLocaleString("en-US", {
    maximumFractionDigits: maxDecimals,
  });
  return useMyanmar ? toMyanmarDigits(formatted) : formatted;
}

export interface GoldWeight {
  kyat: number;
  pae: number;
  yway: number;
}

/** Convert a decimal kyat weight into whole Kyat / Pae / decimal Yway */
export function decimalKyatToUnits(decimalKyat: number): GoldWeight {
  if (!Number.isFinite(decimalKyat) || decimalKyat < 0) {
    return { kyat: 0, pae: 0, yway: 0 };
  }
  const kyat = Math.floor(decimalKyat);
  const paeTotal = (decimalKyat - kyat) * 16;
  const pae = Math.floor(paeTotal);
  let yway = (paeTotal - pae) * 8;
  // guard against floating point rounding e.g. 7.9999999
  yway = Math.round(yway * 100) / 100;
  return { kyat, pae, yway };
}

/** Convert Kyat / Pae / Yway units into a single decimal kyat value */
export function unitsToDecimalKyat(kyat: number, pae: number, yway: number): number {
  const k = Number.isFinite(kyat) ? kyat : 0;
  const p = Number.isFinite(pae) ? pae : 0;
  const y = Number.isFinite(yway) ? yway : 0;
  return k + p / 16 + y / 128;
}

/** Buy mode: given cash (MMK) and gold price per kyat, return the gold weight it can buy */
export function calculateBuy(mmk: number, pricePerKyat: number): GoldWeight | null {
  if (!Number.isFinite(mmk) || !Number.isFinite(pricePerKyat) || pricePerKyat <= 0) {
    return null;
  }
  const decimalKyat = mmk / pricePerKyat;
  return decimalKyatToUnits(decimalKyat);
}

/** Sell mode: given a gold weight and price per kyat, return the MMK value */
export function calculateSell(
  kyat: number,
  pae: number,
  yway: number,
  pricePerKyat: number
): number | null {
  if (!Number.isFinite(pricePerKyat) || pricePerKyat <= 0) return null;
  const decimalKyat = unitsToDecimalKyat(kyat, pae, yway);
  if (!Number.isFinite(decimalKyat)) return null;
  return decimalKyat * pricePerKyat;
}
