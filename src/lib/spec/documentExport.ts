// Export PDF fidèle — PORT du downloadPDF() vanilla (facture-app.html lignes 1791-1874).
// html2canvas (scale 2) → découpage en pages A4 → jsPDF. Mêmes marges que la
// référence (1 cm tout autour page 1, 2 cm en haut des pages suivantes) afin
// d'obtenir un PDF identique en tout point au document vanilla.
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function downloadElementToPdf(element: HTMLElement, filename: string): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const pdf = new jsPDF('p', 'mm', 'a4');

  const pageWidth = 210; // A4 width (mm)
  const pageHeight = 297; // A4 height (mm)
  const horizontalMargin = 10; // 1 cm latéral
  const firstPageTopMargin = 10; // 1 cm en haut de la page 1
  const continuationTopMargin = 20; // 2 cm en haut des pages suivantes
  const bottomMargin = 10; // 1 cm en bas
  const contentWidth = pageWidth - horizontalMargin * 2;

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const ratio = contentWidth / (canvasWidth / 2); // scale: 2

  let currentY = 0;
  let pageNum = 0;

  while (currentY < canvasHeight) {
    const pageCanvas = document.createElement('canvas');
    const ctx = pageCanvas.getContext('2d');
    if (!ctx) break;

    const pageTopMargin = pageNum === 0 ? firstPageTopMargin : continuationTopMargin;
    const pageContentHeight = pageHeight - pageTopMargin - bottomMargin;
    const pageHeightInCanvasPixels = (pageContentHeight / ratio) * 2;
    const sliceHeight = Math.min(pageHeightInCanvasPixels, canvasHeight - currentY);

    pageCanvas.width = canvasWidth;
    pageCanvas.height = sliceHeight;

    ctx.drawImage(canvas, 0, currentY, canvasWidth, sliceHeight, 0, 0, canvasWidth, sliceHeight);

    const pageImgData = pageCanvas.toDataURL('image/png');
    const pageImgHeight = (sliceHeight / 2) * ratio;

    if (pageNum > 0) pdf.addPage();
    pdf.addImage(pageImgData, 'PNG', horizontalMargin, pageTopMargin, contentWidth, pageImgHeight);

    currentY += pageHeightInCanvasPixels;
    pageNum++;
  }

  pdf.save(filename);
}
