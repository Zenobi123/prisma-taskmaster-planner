// Export PDF fidèle — PORT du downloadPDF() vanilla (facture-app.html lignes 1759-1874).
// html2canvas (scale 2) → découpage en pages A4 → jsPDF. Mêmes marges que la
// référence (1 cm tout autour page 1, 2 cm en haut des pages suivantes) afin
// d'obtenir un PDF identique en tout point au document vanilla.
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// PORT de preparePdfAvoidSplitSpacing() (vanilla lignes 1759-1789) : si le
// groupe « paiement + signature » serait coupé entre deux pages du PDF, on le
// repousse en page suivante via un margin-top temporaire, restauré après capture.
function preparePdfAvoidSplitSpacing(element: HTMLElement): () => void {
  const group = element.querySelector<HTMLElement>(
    '.fct-payment-signature-group, .invoice-payment-signature-group',
  );
  if (!group) return () => {};

  const pageWidth = 210;
  const pageHeight = 297;
  const horizontalMargin = 10;
  const firstPageTopMargin = 10;
  const continuationTopMargin = 20;
  const bottomMargin = 10;
  const contentWidth = pageWidth - horizontalMargin * 2;
  const elementRect = element.getBoundingClientRect();
  const groupRect = group.getBoundingClientRect();
  const firstPageHeightPx =
    ((pageHeight - firstPageTopMargin - bottomMargin) * elementRect.width) / contentWidth;
  const nextPageHeightPx =
    ((pageHeight - continuationTopMargin - bottomMargin) * elementRect.width) / contentWidth;
  const top = groupRect.top - elementRect.top;
  const remainingInPage =
    top < firstPageHeightPx
      ? firstPageHeightPx - top
      : nextPageHeightPx - ((top - firstPageHeightPx) % nextPageHeightPx);
  const originalMarginTop = group.style.marginTop;

  if (remainingInPage > 0 && groupRect.height > remainingInPage) {
    const computedMarginTop = parseFloat(getComputedStyle(group).marginTop) || 0;
    const spacer = remainingInPage + 2;
    group.style.marginTop = `${computedMarginTop + spacer}px`;
  }

  return () => {
    group.style.marginTop = originalMarginTop;
  };
}

export async function downloadElementToPdf(element: HTMLElement, filename: string): Promise<void> {
  const restorePdfLayout = preparePdfAvoidSplitSpacing(element);

  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });
  } finally {
    restorePdfLayout();
  }

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
