// Augmentation de jsPDF pour exposer `lastAutoTable` (rempli par jspdf-autotable),
// afin d'éviter les casts `any`. Les tableaux sont générés via l'API fonctionnelle
// `autoTable(doc, options)` importée depuis 'jspdf-autotable'.
import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}
