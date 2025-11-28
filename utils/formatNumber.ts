/**
 * Formats a number with proper decimal places and thousand separators
 */
export function formatNumber(
  num: number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showCurrency?: boolean;
    currencyCode?: string;
  }
): string {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 8,
    showCurrency = false,
    currencyCode = '',
  } = options || {};

  const formatted = num.toLocaleString(undefined, {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return showCurrency && currencyCode ? `${currencyCode} ${formatted}` : formatted;
}

/**
 * Formats a large number with abbreviations (K, M, B)
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  }
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  }
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`;
  }
  return num.toFixed(2);
}

/**
 * Validates if a string is a valid number
 */
export function isValidNumber(value: string): boolean {
  if (!value || value.trim() === '') return false;
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num) && num >= 0;
}

