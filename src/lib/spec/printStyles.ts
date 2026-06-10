// Feuilles de style d'impression — PORT FIDÈLE des templates « vanilla »
// (dossier facturation/*.html). Chaque constante `*_PRINT_CSS` reprend
// VERBATIM les règles visuelles inline du printXxx() vanilla afin que le
// rendu React soit identique en tout point au document de référence.
//
// Convention :
//   - `*_PRINT_CSS`  : règles visuelles (classes préfixées), embarquées dans
//                       le composant Printable → s'appliquent à l'écran ET en
//                       impression (le <style> voyage avec le markup).
//   - `PAGE_STYLE_*` : règles `@page` (marges A4) + reset body, injectées
//                       uniquement dans l'iframe/print et l'export PDF.

/* ------------------------------------------------------------------ */
/* FACTURE — facture-app.html / printFacture() (lignes 1515-1631)      */
/* ------------------------------------------------------------------ */

export const FACTURE_PRINT_CSS = `
.fct-header-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
.fct-company-name { font-size: 17pt; font-weight: bold; color: #1e3a8a; }
.fct-company-sub { font-size: 8pt; color: #6b7280; text-transform: uppercase; letter-spacing: 0.08em; }
.fct-company-info { font-size: 9pt; color: #374151; margin-top: 5px; line-height: 1.5; }
.fct-title-facture { font-size: 30pt; font-weight: bold; color: #1e3a8a; text-align: right; line-height: 1; }
.fct-header-date { font-size: 9pt; color: #374151; text-align: right; margin-top: 5px; }
.fct-divider { border: none; border-top: 3px solid #1e3a8a; margin: 8px 0 12px; }

.fct-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
.fct-meta-num { background: linear-gradient(135deg, #1e3a8a, #3b82f6) !important; color: white !important; padding: 10px 14px; border-radius: 6px; }
.fct-meta-num-label { font-size: 9pt; opacity: 0.85; }
.fct-meta-num-value { font-size: 20pt; font-weight: bold; line-height: 1.2; }
.fct-meta-client { background: #f9fafb !important; border: 2px solid #e5e7eb; padding: 10px 14px; border-radius: 6px; }
.fct-meta-client-label { font-size: 8pt; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-bottom: 4px; }
.fct-meta-client-name { font-size: 13pt; font-weight: bold; }
.fct-meta-client-info { font-size: 9pt; color: #374151; margin-top: 2px; }

.fct-table { width: 100%; border-collapse: collapse; margin-bottom: 0; }
.fct-thead-info td {
    background-color: #eef2ff !important;
    color: #3730a3 !important;
    font-size: 8pt;
    padding: 4px 8px;
    border-bottom: 1px solid #c7d2fe;
    font-style: italic;
    border-top: 2px solid #1e3a8a;
}
.fct-table th {
    background-color: #1e3a8a !important;
    color: white !important;
    padding: 7px 8px;
    font-size: 9pt;
    border: 1px solid #1e3a8a;
    text-align: left;
}
.fct-table td { padding: 6px 8px; border: 1px solid #e5e7eb; font-size: 9.5pt; vertical-align: middle; }
.fct-table tbody tr:nth-child(even) td { background-color: #f8fafc !important; }
.fct-table tfoot td {
    background-color: #1e3a8a !important;
    color: white !important;
    font-weight: bold;
    font-size: 11pt;
    padding: 9px 8px;
    border: 1px solid #1e3a8a;
}

.fct-bottom-table { width: 100%; margin-top: 14px; }
.fct-summary-wrap { page-break-inside: avoid !important; break-inside: avoid !important; }
.fct-payment-signature-group {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    break-inside: avoid-page !important;
}

.fct-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
.fct-box-impots { background-color: #dbeafe !important; border-left: 4px solid #3b82f6; padding: 10px 12px; }
.fct-box-impots-title { font-size: 9pt; color: #1e3a8a; font-weight: 600; }
.fct-box-impots-amount { font-size: 16pt; font-weight: bold; color: #1e3a8a; }
.fct-box-honoraires { background-color: #d1fae5 !important; border-left: 4px solid #10b981; padding: 10px 12px; }
.fct-box-honoraires-title { font-size: 9pt; color: #065f46; font-weight: 600; }
.fct-box-honoraires-amount { font-size: 16pt; font-weight: bold; color: #065f46; }

.fct-payment { background-color: #f0f9ff !important; border-left: 4px solid #1e3a8a; padding: 10px 12px; margin-bottom: 14px; }
.fct-payment-title { font-weight: bold; color: #1e3a8a; font-size: 9.5pt; margin-bottom: 5px; }
.fct-payment-info { font-size: 9pt; color: #374151; line-height: 1.6; }

.fct-sig-wrap {
    text-align: right;
    margin-bottom: 12px;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    break-inside: avoid-page !important;
}
.fct-signature-block {
    display: inline-table;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    break-inside: avoid-page !important;
}
.fct-sig-cachet-wrap { display: table-cell; vertical-align: middle; padding-right: 12px; }
.fct-sig-inner {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    min-width: 58mm;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    break-inside: avoid-page !important;
}
.fct-sig-label { font-weight: bold; color: #1e3a8a; font-size: 9pt; }
.fct-sig-line { border-top: 2px solid #9ca3af; padding-top: 4px; margin-top: 4px; }
.fct-sig-name { font-weight: bold; font-size: 9.5pt; }
.fct-sig-title { font-size: 8.5pt; color: #6b7280; }

.fct-footer { border-top: 1px solid #e5e7eb; padding-top: 6px; text-align: center; font-size: 8pt; color: #6b7280; }
`;

// Marges @page de la facture (facture-app.html lignes 1515-1519).
export const PAGE_STYLE_FACTURE = `
@page { size: A4; margin: 20mm 12mm 15mm 12mm; }
@page :first { margin: 12mm 12mm 15mm 12mm; }
* { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
body { font-family: Arial, sans-serif !important; margin: 0 !important; padding: 0 !important; font-size: 10.5pt; color: #111; background: #fff !important; }
@media print { body { display: block !important; } }
.no-print { display: none !important; }
${FACTURE_PRINT_CSS}
`;

/* ------------------------------------------------------------------ */
/* Conteneur d'aperçu A4 commun (écran) — simule la page imprimée.     */
/* En impression la marge @page prend le relais (padding remis à 0).   */
/* ------------------------------------------------------------------ */

export const PRINT_PAGE_FRAME_CSS = `
.prisma-print-page { background: #fff; color: #111; font-family: Arial, sans-serif; }
@media screen {
  .prisma-print-page { width: 210mm; min-height: 297mm; padding: 18mm 12mm 15mm; margin: 0 auto; box-sizing: border-box; }
}
@media print {
  .prisma-print-page { width: auto; min-height: 0; padding: 0; margin: 0; }
}
`;

/* ------------------------------------------------------------------ */
/* REÇU — recu-app.html (rendu via classes Tailwind + Inter).          */
/* La feuille Tailwind globale est copiée dans l'iframe d'impression,   */
/* on ne fournit donc ici que les marges @page + reset (police Inter).  */
/* ------------------------------------------------------------------ */

export const PAGE_STYLE_RECU = `
@page { size: A4; margin: 10mm 10mm; }
* { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
body { font-family: 'Inter', Arial, sans-serif !important; margin: 0 !important; padding: 0 !important; background: #fff !important; }
@media print { body { display: block !important; } }
.no-print { display: none !important; }
`;

/* ------------------------------------------------------------------ */
/* DEVIS / PROPOSITION — rendus via classes Tailwind + Inter.          */
/* ------------------------------------------------------------------ */

export const PAGE_STYLE_DEVIS = PAGE_STYLE_RECU;
export const PAGE_STYLE_PROPOSITION = PAGE_STYLE_RECU;
