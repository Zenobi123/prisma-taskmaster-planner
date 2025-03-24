
// Utility function to check if a date is past due
export const isOverdue = (dueDate: string, paidAmount: number, totalAmount: number): boolean => {
  const today = new Date();
  const dueDateParts = dueDate.split('/');
  const dueDateTime = new Date(
    parseInt(dueDateParts[2]), // year
    parseInt(dueDateParts[1]) - 1, // month (0-based)
    parseInt(dueDateParts[0]) // day
  );
  return today > dueDateTime && paidAmount < totalAmount;
};

// Format date for database (DD/MM/YYYY to YYYY-MM-DD)
export const formatDateForDatabase = (dateStr: string): string => {
  // If the date is in DD/MM/YYYY format, convert it to YYYY-MM-DD
  if (dateStr && dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }
  return dateStr;
};
