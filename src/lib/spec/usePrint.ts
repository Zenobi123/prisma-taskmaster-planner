// SPEC_LOVABLE.md §10.4 — Impression directe sans nouvelle fenêtre.
// Mécanisme : on remplace temporairement le contenu du <body> par celui de la zone à imprimer,
// on lance window.print(), puis on restaure.

import { useCallback } from 'react';

export interface PrintOptions {
  /** Préfixe unique pour l'élément <style> ajouté (ex: "fact", "rec", "crr"). */
  stylePrefix: string;
  /** Bloc CSS à injecter pour l'impression (page size, marges, etc.). */
  pageStyle: string;
}

export const PAGE_STYLE_A4_DEFAULT = `
  @page { size: A4; margin: 10mm 10mm; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  body { font-family: 'Inter', Arial, sans-serif !important; margin: 0 !important; padding: 0 !important; background: white !important; }
  @media print { body { display: block !important; } }
  table { page-break-inside: auto; }
  tr { page-break-inside: avoid; page-break-after: auto; }
  thead { display: table-header-group; }
  .no-print { display: none !important; }
`;

// Marges spécifiques aux courriers (SPEC §9.10)
export const PAGE_STYLE_A4_COURRIER = `
  @page { size: A4; margin: 1cm 2cm 0.7cm 2cm; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  body { font-family: 'Inter', Arial, sans-serif !important; margin: 0 !important; padding: 0 !important; background: white !important; }
  @media print { body { display: block !important; } }
  .no-print { display: none !important; }
`;

/**
 * Renvoie une fonction d'impression qui ne crée pas de nouvelle fenêtre.
 * Le `getNode()` doit renvoyer l'élément HTML à imprimer.
 */
export function usePrint(getNode: () => HTMLElement | null, options: Partial<PrintOptions> = {}) {
  const stylePrefix = options.stylePrefix ?? 'prisma';
  const pageStyle = options.pageStyle ?? PAGE_STYLE_A4_DEFAULT;

  return useCallback(() => {
    const node = getNode();
    if (!node) return;

    const styleId = `${stylePrefix}-print-style`;
    const existing = document.getElementById(styleId);
    if (existing) existing.remove();

    const printStyle = document.createElement('style');
    printStyle.id = styleId;
    printStyle.textContent = pageStyle;
    document.head.appendChild(printStyle);

    const bodyContent = node.innerHTML;
    const originalContent = document.body.innerHTML;
    const originalScroll = window.scrollY;

    document.body.innerHTML = bodyContent;

    // Lance l'impression
    window.print();

    // Restaure
    document.body.innerHTML = originalContent;
    document.getElementById(styleId)?.remove();

    // React perd le DOM lorsqu'on remplace le body : on recharge la page pour
    // restaurer entièrement l'état (handlers, refs, etc.)
    // L'utilisateur garde son URL et sera replacé sur la même section.
    window.scrollTo({ top: originalScroll, behavior: 'auto' });
    window.location.reload();
  }, [getNode, stylePrefix, pageStyle]);
}

/**
 * Variante : utilise un <iframe> caché pour imprimer (ne casse pas l'app React).
 * Préférée en production.
 */
export function usePrintIframe(getNode: () => HTMLElement | null, options: Partial<PrintOptions> = {}) {
  const pageStyle = options.pageStyle ?? PAGE_STYLE_A4_DEFAULT;

  return useCallback(() => {
    const node = getNode();
    if (!node) return;

    // Capturer également les <style> et <link rel="stylesheet"> du document principal
    // pour conserver Tailwind & polices.
    const headLinks = Array.from(document.head.querySelectorAll('link[rel="stylesheet"], style'))
      .map((el) => el.outerHTML)
      .join('\n');

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
      iframe.remove();
      return;
    }

    doc.open();
    doc.write(`<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8" />
${headLinks}
<style>${pageStyle}</style>
</head>
<body>${node.innerHTML}</body>
</html>`);
    doc.close();

    const onLoad = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } finally {
        // Laisser le temps au navigateur d'ouvrir le dialog d'impression
        setTimeout(() => iframe.remove(), 1000);
      }
    };

    if (doc.readyState === 'complete') {
      onLoad();
    } else {
      iframe.addEventListener('load', onLoad);
    }
  }, [getNode, pageStyle]);
}
