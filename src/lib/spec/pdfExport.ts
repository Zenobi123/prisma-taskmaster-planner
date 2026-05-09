// SPEC_LOVABLE.md §5.13 — Export PDF (split A4 multi-page).
// Note : html2canvas n'est pas installé en dépendance. Pour un export PDF
// fidèle, on utilise jsPDF.html() qui est natif dans la version 3.x présente.

import jsPDF from 'jspdf';

export async function exportNodeToPdf(node: HTMLElement, filename: string): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // jsPDF.html() rend le DOM via html2canvas si dispo, sinon via le moteur natif.
  await pdf.html(node, {
    callback: (doc) => doc.save(filename),
    margin: [10, 10, 10, 10],
    autoPaging: 'text',
    html2canvas: {
      scale: 0.27, // ajuster pour A4 (210mm) à partir d'une largeur ~800px
      useCORS: true,
      backgroundColor: '#ffffff',
    },
    width: 190,
    windowWidth: 800,
  });
}
