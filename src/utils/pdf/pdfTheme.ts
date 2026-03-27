
/**
 * Palette de couleurs centralisée pour tous les documents PDF.
 * Alignée sur le thème principal du logiciel (vert sauge + gris neutre).
 *
 * Primary : #84A98C  |  Hover/dark : #6B8E74  |  Light : #A8C1AE
 * Neutrals : #F8F9FA → #212529
 */

type RGB = [number, number, number];

export const PDF_THEME = {
  // --- Couleurs primaires ---
  primary:      [132, 169, 140] as RGB,  // #84A98C – vert sauge
  primaryDark:  [107, 142, 116] as RGB,  // #6B8E74 – hover / en-têtes de tableaux
  primaryLight: [168, 193, 174] as RGB,  // #A8C1AE – accents légers

  // --- Fonds ---
  bgLight:      [248, 249, 250] as RGB,  // #F8F9FA – neutral-100
  bgPrimary:    [237, 243, 239] as RGB,  // teinte sage très pâle (info box, total…)
  bgAlternate:  [244, 247, 245] as RGB,  // lignes alternées dans les tableaux

  // --- Texte ---
  textHeading:  [33, 37, 41]   as RGB,   // #212529 – neutral-900
  textBody:     [73, 80, 87]   as RGB,   // #495057 – neutral-700
  textSecondary:[108, 117, 125] as RGB,  // #6C757D – neutral-600
  textMuted:    [173, 181, 189] as RGB,  // #ADB5BD – neutral-400 (footer, legal)
  textWhite:    [255, 255, 255] as RGB,

  // --- Bordures / lignes ---
  border:       [222, 226, 230] as RGB,  // #DEE2E6 – neutral-300
  borderLight:  [233, 236, 239] as RGB,  // #E9ECEF – neutral-200

  // --- Couleurs de statut (badges) ---
  statusPaid:    [34, 139, 34]  as RGB,  // vert – payé / crédit
  statusPartial: [217, 164, 6]  as RGB,  // ambre – partiel
  statusLate:    [220, 53, 69]  as RGB,  // rouge – en retard
  statusPending: [132, 169, 140] as RGB, // sage – en attente (cohérent avec primary)

  // --- Watermark ---
  watermark: '#ADB5BD',                  // neutral-400
} as const;
