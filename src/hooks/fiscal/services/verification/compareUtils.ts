
/**
 * Utilities for comparing fiscal data objects
 */
export const compareObjects = (obj1, obj2): boolean => {
  try {
    // Comparison using stringification with sorted keys
    const sortedStringify = (obj) => JSON.stringify(obj, Object.keys(obj).sort());
    
    // Remove metadata fields for comparison
    const obj1ForComparison = { ...obj1 };
    const obj2ForComparison = { ...obj2 };
    
    if (obj1ForComparison._metadata) delete obj1ForComparison._metadata;
    if (obj2ForComparison._metadata) delete obj2ForComparison._metadata;
    
    return sortedStringify(obj1ForComparison) === sortedStringify(obj2ForComparison);
  } catch (e) {
    return false;
  }
};
