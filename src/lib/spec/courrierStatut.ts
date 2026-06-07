// SPEC_LOVABLE.md §9 — Métadonnées de statut des courriers (rendu imprimable)
//
// Les modèles de courriers (templates) sont définis dans la source unique
// `src/utils/courrierTemplates.ts`, utilisée par la page Courrier.
// Ce fichier ne conserve que le type de statut et ses libellés/styles, requis
// par le composant imprimable `PrintableCourrier`.

export type CourrierStatut = 'brouillon' | 'envoye' | 'accuse' | 'classe';

export const COURRIER_STATUT_BADGE: Record<CourrierStatut, string> = {
  brouillon: 'bg-yellow-100 text-yellow-800',
  envoye: 'bg-blue-100 text-blue-800',
  accuse: 'bg-green-100 text-green-800',
  classe: 'bg-gray-100 text-gray-800',
};

export const COURRIER_STATUT_LABEL: Record<CourrierStatut, string> = {
  brouillon: 'Brouillon',
  envoye: 'Envoyé',
  accuse: 'Accusé R.',
  classe: 'Classé',
};
