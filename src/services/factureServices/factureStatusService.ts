
// Utility function to check if a date is past due
export const isOverdue = (dueDate: string, paidAmount: number, totalAmount: number): boolean => {
  if (!dueDate) return false;
  
  const today = new Date();
  let dueDateObj: Date;
  
  // Handle both DD/MM/YYYY and YYYY-MM-DD formats
  if (dueDate.includes('/')) {
    // DD/MM/YYYY format
    const dueDateParts = dueDate.split('/');
    dueDateObj = new Date(
      parseInt(dueDateParts[2]), // year
      parseInt(dueDateParts[1]) - 1, // month (0-based)
      parseInt(dueDateParts[0]) // day
    );
  } else if (dueDate.includes('-')) {
    // YYYY-MM-DD format
    const dueDateParts = dueDate.split('-');
    dueDateObj = new Date(
      parseInt(dueDateParts[0]), // year
      parseInt(dueDateParts[1]) - 1, // month (0-based)
      parseInt(dueDateParts[2]) // day
    );
  } else {
    // Invalid date format
    console.error(`Invalid date format: ${dueDate}`);
    return false;
  }
  
  return today > dueDateObj && paidAmount < totalAmount;
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
