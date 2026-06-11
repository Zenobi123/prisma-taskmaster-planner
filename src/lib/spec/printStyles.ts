// Feuilles de style d'impression — PORT FIDÈLE des templates « vanilla »
// (dossier facturation/*.html). Chaque constante reprend VERBATIM les règles
// des fichiers de référence afin que le rendu React (aperçu, impression et
// PDF) soit identique en tout point au document vanilla, marges comprises.
//
// Architecture des marges (identique au vanilla) :
//   - Aperçu écran / capture PDF : conteneur « printArea » du module
//     (max-w-4xl p-8 pour la facture et la proposition, p-5 pour le devis,
//     max-w-3xl p-8 + double bordure pour le reçu). html2canvas capture ce
//     conteneur, puis jsPDF ajoute 10 mm de marge (20 mm en haut des pages
//     suivantes) — cf. documentExport.ts.
//   - Impression : `prisma-print.css` (feuille partagée, portée ci-dessous)
//     remet `.print-area` à padding 0 et applique la palette économie
//     d'encre ; les `@page` du module fournissent les marges papier.

/* ------------------------------------------------------------------ */
/* prisma-print.css — feuille d'impression A4 PARTAGÉE (port verbatim) */
/* Liée par <link> dans les 4 modules vanilla : facture, devis, reçu,  */
/* proposition. Ne s'applique qu'aux contextes d'impression (iframe).  */
/* ------------------------------------------------------------------ */

export const PRISMA_PRINT_CSS = `
@page {
    size: A4;
    margin: 15mm 10mm;
}

@media print {
    :root {
        --print-blue-strong: #c9dcfb;
        --print-blue-soft: #eaf2ff;
        --print-blue-text: #1e3a8a;
        --print-green-strong: #d8f3df;
        --print-green-soft: #eefbf1;
        --print-green-text: #166534;
        --print-teal-strong: #d6f2ef;
        --print-teal-soft: #edf9f7;
        --print-teal-text: #115e59;
        --print-amber-strong: #fbe7c3;
        --print-amber-soft: #fff7e8;
        --print-amber-text: #92400e;
        --print-orange-strong: #fde1c8;
        --print-orange-soft: #fff2e8;
        --print-orange-text: #9a3412;
        --print-purple-strong: #eadcfb;
        --print-purple-soft: #f7f1ff;
        --print-purple-text: #6b21a8;
        --print-indigo-strong: #dde5ff;
        --print-indigo-soft: #eff3ff;
        --print-indigo-text: #3730a3;
        --print-red-strong: #f9d8d8;
        --print-red-soft: #fff0f0;
        --print-red-text: #b91c1c;
        --print-gray-strong: #e5e7eb;
        --print-gray-soft: #f7f7f8;
        --print-gray-text: #374151;
    }

    * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
    }

    html, body {
        width: 210mm;
        height: auto;
        margin: 0 !important;
        padding: 0 !important;
        font-size: 11pt;
        line-height: 1.4;
        background: white !important;
    }

    .no-print,
    button:not(.print-visible),
    nav,
    header:not(.print-header),
    .prisma-toast-container,
    .prisma-modal-overlay,
    .prisma-loader-overlay,
    input,
    select,
    textarea,
    form,
    [type="submit"],
    [type="button"],
    .btn,
    .sidebar,
    .menu,
    .navigation,
    footer:not(.print-footer) {
        display: none !important;
    }

    .print-area {
        display: block !important;
        position: static !important;
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
        box-shadow: none !important;
        border: none !important;
    }

    table {
        width: 100% !important;
        border-collapse: collapse !important;
        page-break-inside: auto;
    }

    thead {
        display: table-header-group !important;
    }

    tbody {
        display: table-row-group !important;
    }

    tfoot {
        display: table-footer-group !important;
    }

    tr {
        page-break-inside: avoid !important;
        page-break-after: auto;
    }

    th, td {
        padding: 8px 10px !important;
        border: 1px solid #333 !important;
        text-align: left;
        vertical-align: top;
    }

    th {
        background-color: var(--print-blue-strong) !important;
        color: var(--print-blue-text) !important;
        font-weight: 600 !important;
        border-color: #9dbcf4 !important;
    }

    tbody tr:nth-child(even) {
        background-color: #f8fafc !important;
    }

    tbody tr.total-row,
    tbody tr.total-row:nth-child(even) {
        background-color: var(--print-blue-strong) !important;
        color: var(--print-blue-text) !important;
    }

    tbody tr.total-row td {
        background-color: var(--print-blue-strong) !important;
        color: var(--print-blue-text) !important;
        font-weight: 700 !important;
        border-color: #9dbcf4 !important;
    }

    h1 {
        font-size: 18pt !important;
        font-weight: 700 !important;
        margin-bottom: 15px !important;
        color: #1e3a8a !important;
    }

    h2 {
        font-size: 14pt !important;
        font-weight: 600 !important;
        margin-bottom: 10px !important;
        color: #1e3a8a !important;
    }

    h3 {
        font-size: 12pt !important;
        font-weight: 600 !important;
        margin-bottom: 8px !important;
    }

    p {
        margin-bottom: 8px !important;
        orphans: 3;
        widows: 3;
    }

    .bg-blue-900,
    .bg-primary {
        background-color: var(--print-blue-strong) !important;
        color: var(--print-blue-text) !important;
    }

    .bg-blue-800 {
        background-color: #d7e7ff !important;
        color: var(--print-blue-text) !important;
    }

    .bg-blue-700,
    .bg-blue-600,
    .bg-blue-500 {
        background-color: var(--print-blue-soft) !important;
        color: var(--print-blue-text) !important;
    }

    .bg-blue-100 {
        background-color: #edf4ff !important;
    }

    .bg-gray-100 {
        background-color: var(--print-gray-soft) !important;
    }

    .bg-gray-200 {
        background-color: var(--print-gray-strong) !important;
    }

    .bg-gray-900,
    .bg-gray-800,
    .bg-gray-700 {
        background-color: var(--print-gray-strong) !important;
        color: var(--print-gray-text) !important;
    }

    .bg-green-100 {
        background-color: var(--print-green-soft) !important;
    }

    .bg-green-900,
    .bg-green-800,
    .bg-green-700,
    .bg-green-600,
    .bg-green-500 {
        background-color: var(--print-green-strong) !important;
        color: var(--print-green-text) !important;
    }

    .bg-teal-900,
    .bg-teal-800,
    .bg-teal-700,
    .bg-teal-600,
    .bg-teal-500 {
        background-color: var(--print-teal-strong) !important;
        color: var(--print-teal-text) !important;
    }

    .bg-teal-100 {
        background-color: var(--print-teal-soft) !important;
    }

    .bg-red-100 {
        background-color: var(--print-red-soft) !important;
    }

    .bg-red-900,
    .bg-red-800,
    .bg-red-700,
    .bg-red-600,
    .bg-red-500 {
        background-color: var(--print-red-strong) !important;
        color: var(--print-red-text) !important;
    }

    .bg-yellow-100 {
        background-color: #fff7dd !important;
    }

    .bg-amber-900,
    .bg-amber-800,
    .bg-amber-700,
    .bg-amber-600,
    .bg-amber-500 {
        background-color: var(--print-amber-strong) !important;
        color: var(--print-amber-text) !important;
    }

    .bg-amber-100 {
        background-color: var(--print-amber-soft) !important;
    }

    .bg-orange-900,
    .bg-orange-800,
    .bg-orange-700,
    .bg-orange-600,
    .bg-orange-500 {
        background-color: var(--print-orange-strong) !important;
        color: var(--print-orange-text) !important;
    }

    .bg-orange-100,
    .bg-orange-50 {
        background-color: var(--print-orange-soft) !important;
    }

    .bg-purple-900,
    .bg-purple-800,
    .bg-purple-700,
    .bg-purple-600,
    .bg-purple-500 {
        background-color: var(--print-purple-strong) !important;
        color: var(--print-purple-text) !important;
    }

    .bg-purple-100,
    .bg-purple-50 {
        background-color: var(--print-purple-soft) !important;
    }

    .bg-indigo-900,
    .bg-indigo-800,
    .bg-indigo-700,
    .bg-indigo-600,
    .bg-indigo-500 {
        background-color: var(--print-indigo-strong) !important;
        color: var(--print-indigo-text) !important;
    }

    .bg-indigo-100,
    .bg-indigo-50 {
        background-color: var(--print-indigo-soft) !important;
    }

    .text-blue-900 {
        color: #1e3a8a !important;
    }

    .text-green-600 {
        color: #16a34a !important;
    }

    .text-red-600 {
        color: #dc2626 !important;
    }

    .border {
        border: 1px solid #333 !important;
    }

    .border-b {
        border-bottom: 1px solid #333 !important;
    }

    .border-t {
        border-top: 1px solid #333 !important;
    }

    .page-break-before {
        page-break-before: always !important;
        break-before: page !important;
    }

    .page-break-after {
        page-break-after: always !important;
        break-after: page !important;
    }

    .avoid-break {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
    }

    .keep-together {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
    }

    .print-section,
    .invoice-header,
    .invoice-footer,
    .client-info,
    .totals-section {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
    }

    .print-header {
        display: flex !important;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 15px;
        margin-bottom: 20px;
        border-bottom: 2px solid #1e3a8a !important;
    }

    .print-header img {
        max-height: 60px;
        width: auto;
    }

    .print-footer {
        display: block !important;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding-top: 10px;
        border-top: 1px solid #ccc !important;
        font-size: 9pt;
        color: #666;
        text-align: center;
    }

    .montant,
    .total-amount {
        font-weight: 700 !important;
        text-align: right !important;
    }

    .grand-total {
        font-size: 14pt !important;
        font-weight: 700 !important;
        background-color: var(--print-blue-strong) !important;
        color: var(--print-blue-text) !important;
        padding: 10px !important;
    }

    .client-block {
        background-color: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
        padding: 15px !important;
        margin-bottom: 20px !important;
        page-break-inside: avoid !important;
    }

    .doc-number {
        font-size: 12pt !important;
        font-weight: 600 !important;
        color: #1e3a8a !important;
    }

    .signature-area {
        margin-top: 40px !important;
        padding-top: 20px !important;
        border-top: 1px dashed #ccc !important;
        page-break-inside: avoid !important;
    }

    a {
        color: #1e3a8a !important;
        text-decoration: none !important;
    }

    a[href]:after {
        content: none !important;
    }

    img {
        max-width: 100% !important;
        page-break-inside: avoid !important;
    }

    .logo-print {
        max-width: 150px !important;
        height: auto !important;
    }

    [style*="background-color: #1e3a8a"],
    [style*="background-color:#1e3a8a"] {
        background-color: var(--print-blue-strong) !important;
        color: var(--print-blue-text) !important;
        border-color: #9dbcf4 !important;
    }

    [style*="background-color: #1e40af"],
    [style*="background-color:#1e40af"] {
        background-color: #d7e7ff !important;
        color: var(--print-blue-text) !important;
        border-color: #a8c4f8 !important;
    }

    [style*="background-color: #10b981"],
    [style*="background-color:#10b981"] {
        background-color: var(--print-green-strong) !important;
        color: var(--print-green-text) !important;
    }

    [style*="background-color: #f59e0b"],
    [style*="background-color:#f59e0b"] {
        background-color: var(--print-amber-strong) !important;
        color: var(--print-amber-text) !important;
    }

    [style*="background-color: #7c3aed"],
    [style*="background-color:#7c3aed"] {
        background-color: var(--print-purple-strong) !important;
        color: var(--print-purple-text) !important;
    }

    /* Variante supplémentaire « background:linear-gradient(135deg, #1e3a8a » :
       sérialisation des styles inline par React (pas d'espace après les
       deux-points, espace conservé après la virgule). */
    [style*="background: linear-gradient(135deg, #1e3a8a"],
    [style*="background:linear-gradient(135deg,#1e3a8a"],
    [style*="background:linear-gradient(135deg, #1e3a8a"] {
        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%) !important;
        color: var(--print-blue-text) !important;
        border: 1px solid #93c5fd !important;
    }

    [style*="border-left: 4px solid #1e3a8a"],
    [style*="border-left:4px solid #1e3a8a"] {
        border-left-color: #93c5fd !important;
    }

    [style*="border-left: 4px solid #3b82f6"],
    [style*="border-left:4px solid #3b82f6"] {
        border-left-color: #93c5fd !important;
    }

    [style*="border-left: 4px solid #10b981"],
    [style*="border-left:4px solid #10b981"] {
        border-left-color: #86efac !important;
    }

    [style*="border: 3px double #1e3a8a"],
    [style*="border:3px double #1e3a8a"] {
        border-color: #93c5fd !important;
    }
}

.print-only {
    display: none !important;
}

@media print {
    .print-only {
        display: block !important;
    }

    .screen-only {
        display: none !important;
    }
}
`;

/* ------------------------------------------------------------------ */
/* Bloc print des modules recu-app.html / devis.html (port verbatim).  */
/* Vient APRÈS prisma-print.css dans la cascade, comme dans le <head>  */
/* vanilla. @page 10mm 10mm.                                           */
/* ------------------------------------------------------------------ */

const MODULE_PRINT_CSS_STANDARD = `
@media print {
    body { background: white; margin: 0; padding: 0; }
    .no-print { display: none !important; }
    .print-area { box-shadow: none !important; padding: 0 !important; }
    @page { size: A4; margin: 10mm 10mm; }
}
`;

/* ------------------------------------------------------------------ */
/* FACTURE — facture-app.html.                                         */
/* Cascade vanilla à l'impression : prisma-print.css → bloc print du   */
/* module → style injecté par printFacture() (dernier, gagne sur       */
/* @page : 12mm 12mm 15mm 12mm en première page, 20mm ensuite).        */
/* ------------------------------------------------------------------ */

// Bloc print du module facture (head, lignes 12-26) — port verbatim.
const FACTURE_MODULE_PRINT_CSS = `
@media print {
    body { background: white; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .no-print { display: none !important; }
    .print-area { box-shadow: none !important; padding: 0 !important; margin: 0 !important; }
    @page { size: A4; margin: 20mm 10mm 10mm 10mm; }
    @page :first { margin: 10mm 10mm; }
    table { page-break-inside: auto; }
    tr { page-break-inside: avoid; page-break-after: auto; }
    thead { display: table-header-group; }
    tfoot { display: table-footer-group; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
    .total-row, .total-row td { background-color: #c9dcfb !important; color: #1e3a8a !important; }
}
`;

// Style injecté par printFacture() (lignes 1514-1632) — règles visuelles .fct-*.
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
.fct-force-page-break-before { page-break-before: always !important; break-before: page !important; }
`;

// Style de page de la facture, dans l'ordre de cascade du vanilla.
export const PAGE_STYLE_FACTURE = `
${PRISMA_PRINT_CSS}
${FACTURE_MODULE_PRINT_CSS}
@page { size: A4; margin: 20mm 12mm 15mm 12mm; }
@page :first { margin: 12mm 12mm 15mm 12mm; }
* { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
body { font-family: Arial, sans-serif !important; margin: 0 !important; padding: 0 !important; font-size: 10.5pt; color: #111; background: #fff !important; }
@media print { body { display: block !important; } }
.no-print { display: none !important; }
${FACTURE_PRINT_CSS}
`;

/* ------------------------------------------------------------------ */
/* Conteneur d'aperçu commun — réplique le « printArea » vanilla       */
/* (carte blanche capturée par html2canvas). La géométrie par document */
/* est portée par les composants ; à l'impression, `.print-area` est   */
/* remis à zéro par prisma-print.css + bloc module (comme le vanilla). */
/* ------------------------------------------------------------------ */

export const PRINT_PAGE_FRAME_CSS = `
/* facture-app.html : <div class="max-w-4xl mx-auto bg-white p-8 print-area" id="printArea"> */
.prisma-print-page { background: #fff; color: #111; max-width: 56rem; margin: 0 auto; padding: 2rem; font-family: 'Inter', Arial, sans-serif; }
@media print {
  .prisma-print-page { width: auto; max-width: none; min-height: 0; padding: 0; margin: 0; font-family: Arial, sans-serif; }
}
`;

/* ------------------------------------------------------------------ */
/* REÇU — recu-app.html : @page 10mm + reset .print-area.              */
/* ------------------------------------------------------------------ */

export const PAGE_STYLE_RECU = `
${PRISMA_PRINT_CSS}
body { font-family: 'Inter', Arial, sans-serif !important; margin: 0 !important; padding: 0 !important; background: #fff !important; }
@media print { body { display: block !important; } }
${MODULE_PRINT_CSS_STANDARD}
`;

/* ------------------------------------------------------------------ */
/* DEVIS — devis.html : @page 10mm + reset .print-area.                */
/* ------------------------------------------------------------------ */

export const PAGE_STYLE_DEVIS = `
${PRISMA_PRINT_CSS}
body { font-family: 'Inter', Arial, sans-serif !important; margin: 0 !important; padding: 0 !important; background: #fff !important; }
@media print { body { display: block !important; } }
${MODULE_PRINT_CSS_STANDARD}
`;

/* ------------------------------------------------------------------ */
/* PROPOSITION — avance-app.html : bloc standard + th/.bg-section.     */
/* ------------------------------------------------------------------ */

export const PAGE_STYLE_PROPOSITION = `
${PRISMA_PRINT_CSS}
body { font-family: 'Inter', Arial, sans-serif !important; margin: 0 !important; padding: 0 !important; background: #fff !important; }
@media print { body { display: block !important; } }
.bg-section { background-color: #dbeafe; color: #1e3a8a; font-weight: bold; }
@media print {
    body { background: white; margin: 0; padding: 0; }
    .no-print { display: none !important; }
    .print-area { box-shadow: none !important; padding: 0 !important; }
    @page { size: A4; margin: 10mm 10mm; }
    th { background-color: #c9dcfb !important; color: #1e3a8a !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .bg-section { background-color: #dbeafe !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`;
