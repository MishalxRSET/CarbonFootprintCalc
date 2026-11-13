/**
 * Indian Rupee (INR - ₹) Formatting & Economic Modeling Utilities
 * Formats currency according to standard Indian numbering conventions (Lakhs & Crores).
 */

export function formatINR(
  amount: number,
  options?: {
    compact?: boolean;
    hideSymbol?: boolean;
    decimals?: number;
  }
): string {
  const { compact = false, hideSymbol = false, decimals = 0 } = options || {};
  const symbol = hideSymbol ? '' : '₹';

  if (isNaN(amount) || amount === 0) {
    return `${symbol}0`;
  }

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (compact) {
    // 1 Crore = 10,000,000 (100 Lakhs)
    if (absAmount >= 1000000000000) {
      const lakhCrore = (absAmount / 1000000000000).toFixed(1);
      return `${sign}${symbol}${lakhCrore} Lakh Cr`;
    }
    if (absAmount >= 10000000) {
      const crore = (absAmount / 10000000).toFixed(decimals > 0 ? decimals : 2);
      return `${sign}${symbol}${crore} Cr`;
    }
    // 1 Lakh = 100,000
    if (absAmount >= 100000) {
      const lakh = (absAmount / 100000).toFixed(decimals > 0 ? decimals : 1);
      return `${sign}${symbol}${lakh} Lakh`;
    }
    if (absAmount >= 1000) {
      const k = (absAmount / 1000).toFixed(1);
      return `${sign}${symbol}${k}k`;
    }
  }

  // Standard Indian Numbering System formatting (e.g. 1,80,000)
  try {
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(absAmount);
    return `${sign}${symbol}${formatted}`;
  } catch {
    return `${sign}${symbol}${absAmount.toLocaleString()}`;
  }
}
