/**
 * @param {number} cents - Amount in cents.
 * @returns {string} Formatted string in dollars, e.g., "$1.00".
 */
export function formatCentsToDollars(cents) {
  if (typeof cents !== "number" || isNaN(cents)) return "$0.00";
  return `$${(cents / 100).toFixed(2)}`;
}
