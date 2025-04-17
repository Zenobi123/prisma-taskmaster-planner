
/**
 * Utilities for comparing fiscal data objects
 */
export const compareObjects = (obj1: any, obj2: any): boolean => {
  try {
    // Comparison using stringification with sorted keys
    const sortedStringify = (obj: any) => JSON.stringify(obj, Object.keys(obj).sort());
    
    // Remove metadata fields for comparison
    const obj1ForComparison = { ...obj1 };
    const obj2ForComparison = { ...obj2 };
    
    if (obj1ForComparison._metadata) delete obj1ForComparison._metadata;
    if (obj2ForComparison._metadata) delete obj2ForComparison._metadata;
    
    return sortedStringify(obj1ForComparison) === sortedStringify(obj2ForComparison);
  } catch (e) {
    console.error("Error comparing objects:", e);
    return false;
  }
};
