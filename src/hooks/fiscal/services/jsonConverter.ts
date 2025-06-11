
import { Json } from "@/integrations/supabase/types";

export const convertToJsonCompatible = (data: any): Json => {
  const convertValue = (value: any): Json => {
    if (value === null || value === undefined) {
      return null;
    }
    if (typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number') {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map(convertValue) as Json[];
    }
    if (typeof value === 'object') {
      const result: { [key: string]: Json } = {};
      Object.keys(value).forEach(key => {
        result[key] = convertValue(value[key]);
      });
      return result;
    }
    return String(value);
  };
  
  return convertValue(data);
};
