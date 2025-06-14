
// Format a number with spaces as thousand separators
export function formatNumberWithSpaces(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === '') return '';
  const numStr = String(value).replace(/\s/g, '').replace(/[^\d]/g, ''); // Allow only digits
  if (!numStr) return '';
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Parse a formatted number to an integer
export const parseFormattedNumber = (value: string | undefined | null): number => {
  if (!value) return 0;
  const parsed = parseInt(String(value).replace(/\s/g, ''), 10);
  return isNaN(parsed) ? 0 : parsed;
};

