export const CHF_FORMAT = {
  locale: "fr-CH",
  currency: "CHF",
  groupSeparator: "'",
  decimalSeparator: ".",
  currencySeparator: "\u00a0",
  defaultMaximumFractionDigits: 0,
} as const;

export type ChfFormatOptions = {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export function formatChfPrice(value: number, options: ChfFormatOptions = {}): string {
  if (!Number.isFinite(value)) throw new RangeError("CHF prices must be finite numbers.");

  const maximumFractionDigits = options.maximumFractionDigits ?? CHF_FORMAT.defaultMaximumFractionDigits;
  const minimumFractionDigits = options.minimumFractionDigits ?? 0;
  if (
    !Number.isInteger(maximumFractionDigits) ||
    !Number.isInteger(minimumFractionDigits) ||
    maximumFractionDigits < 0 ||
    maximumFractionDigits > 6 ||
    minimumFractionDigits < 0 ||
    minimumFractionDigits > maximumFractionDigits
  ) {
    throw new RangeError("CHF fraction digits must be integers between zero and six.");
  }

  const negative = value < 0;
  const fixed = Math.abs(value).toFixed(maximumFractionDigits);
  const [integer, rawFraction = ""] = fixed.split(".");
  const fraction = rawFraction.replace(/0+$/, "").padEnd(minimumFractionDigits, "0");
  const groupedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, CHF_FORMAT.groupSeparator);
  const formattedNumber = fraction
    ? `${groupedInteger}${CHF_FORMAT.decimalSeparator}${fraction}`
    : groupedInteger;

  return `${negative ? "-" : ""}${formattedNumber}${CHF_FORMAT.currencySeparator}${CHF_FORMAT.currency}`;
}
