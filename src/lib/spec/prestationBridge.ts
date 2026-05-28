// Pont entre la forme « Prestation » des formulaires (factures/devis — modèle
// @/types) et la lib canonique fidèle à la référence (@/lib/spec/facturePrestations).
import type { Prestation as SpecPrestation } from '@/lib/spec/facturePrestations';

export interface FormPrestation {
  id?: string;
  description: string;
  type: 'impot' | 'honoraire';
  quantite: number;
  prix_unitaire: number;
  montant: number;
}

export const toSpecPrestation = (p: FormPrestation): SpecPrestation => ({
  type: p.type === 'impot' ? 'Impôt' : 'Honoraire',
  designation: p.description,
  qty: p.quantite,
  price: p.prix_unitaire,
  total: p.montant,
});

export const toFormPrestation = (p: SpecPrestation): FormPrestation => ({
  description: p.designation,
  type: p.type === 'Impôt' ? 'impot' : 'honoraire',
  quantite: p.qty,
  prix_unitaire: p.price,
  montant: p.total,
});
