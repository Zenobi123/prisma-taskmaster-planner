
import { igsBareme } from '@/config/fiscalConstants';

// Calculate IGS based on revenue and CGA status
export const calculateIGS = (ca: number, cgaStatus: boolean): { class: number | string; amount: number; outOfRange: boolean } => {
  if (ca >= 50000000) {
    return { class: 'Hors barème', amount: 0, outOfRange: true };
  }
  for (const bracket of igsBareme) {
    if (ca >= bracket.min && ca <= bracket.max) {
      let amount = bracket.standard;
      if (cgaStatus) amount = Math.round(amount / 2);
      return { class: bracket.class, amount, outOfRange: false };
    }
  }
  // Default for CA < 500_000, which should be caught by the first bracket.
  // This case handles ca = 0 or very small amounts if not covered explicitly by a min: 0 bracket.
  // Assuming igsBareme always starts with a min:0 bracket.
  if (ca < igsBareme[0].min) {
     let amount = igsBareme[0].standard;
     if (cgaStatus) amount = Math.round(amount / 2);
     return { class: igsBareme[0].class, amount, outOfRange: false };
  }
  return { class: '-', amount: 0, outOfRange: false }; // Fallback, should ideally not be reached if bareme is comprehensive
};

