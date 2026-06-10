// Référence : facturation/recu-app.html + facturation/situation-app.html.
// Dans l'application de référence, l'état d'une facture est *généré* par les
// reçus qui lui sont appliqués : « émise » → « partiellement payée » → « payée ».
// Ici la même règle pilote factures.status_paiement, avec en plus l'état
// « en_retard » (échéance dépassée sans solde complet) déjà présent dans le
// modèle React.

export type StatutPaiementFacture =
  | 'non_payée'
  | 'partiellement_payée'
  | 'payée'
  | 'en_retard';

function parseDateOnly(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
  const str = String(value);
  let year: number;
  let month: number;
  let day: number;
  if (str.includes('/')) {
    // DD/MM/YYYY
    const [d, m, y] = str.split('/');
    day = parseInt(d, 10);
    month = parseInt(m, 10) - 1;
    year = parseInt(y, 10);
  } else {
    // YYYY-MM-DD (éventuellement suivi d'une heure ISO)
    const [datePart] = str.split('T');
    const [y, m, d] = datePart.split('-');
    year = parseInt(y, 10);
    month = parseInt(m, 10) - 1;
    day = parseInt(d, 10);
  }
  if ([year, month, day].some((n) => Number.isNaN(n))) return null;
  return new Date(year, month, day);
}

export function computeStatutPaiement(
  montant: number,
  montantPaye: number,
  echeance?: string | Date | null,
  today: Date = new Date(),
): StatutPaiementFacture {
  const total = Math.max(0, Math.round(montant || 0));
  const paye = Math.max(0, Math.round(montantPaye || 0));

  if (total > 0 && paye >= total) return 'payée';

  const due = parseDateOnly(echeance);
  if (due) {
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (t > due) return 'en_retard';
  }

  return paye > 0 ? 'partiellement_payée' : 'non_payée';
}

export function computeMontantPaye(paiements: Array<{ montant?: number | null }>): number {
  return paiements.reduce((sum, p) => sum + (Number(p.montant) || 0), 0);
}
