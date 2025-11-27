
/**
 * Format a number as currency with commas
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string with commas
 */
export function formatCurrency(value: number, decimals: number = 0): string {
  try {
    if (value === null || value === undefined || isNaN(value)) {
      return '0';
    }
    
    return value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  } catch (error) {
    console.error('Error formatting currency:', error, 'Value:', value);
    return '0';
  }
}

/**
 * Format a number with commas (no currency symbol)
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string with commas
 */
export function formatNumber(value: number, decimals: number = 0): string {
  try {
    if (value === null || value === undefined || isNaN(value)) {
      return '0';
    }
    
    return value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  } catch (error) {
    console.error('Error formatting number:', error, 'Value:', value);
    return '0';
  }
}
