
/**
 * Format a number as currency with commas
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string with commas
 */
export function formatCurrency(value: number, decimals: number = 0): string {
  if (isNaN(value)) return '0';
  
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format a number with commas (no currency symbol)
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string with commas
 */
export function formatNumber(value: number, decimals: number = 0): string {
  if (isNaN(value)) return '0';
  
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
