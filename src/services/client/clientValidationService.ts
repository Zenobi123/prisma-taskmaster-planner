
import { RegimeFiscal } from "@/types/client";

// Valid regime fiscal values - now strictly enforced by database constraint
export const VALID_REGIME_FISCAL = ["reel", "igs", "non_professionnel"] as const;

export const validateRegimeFiscal = (regimefiscal: any): RegimeFiscal => {
  if (VALID_REGIME_FISCAL.includes(regimefiscal as any)) {
    return regimefiscal as RegimeFiscal;
  }
  console.warn(`Invalid regimefiscal value: ${regimefiscal}, defaulting to 'reel'`);
  return "reel";
};

export const cleanClientUpdateData = (updates: any): any => {
  const cleanedUpdates: any = {};
  
  // Only include fields that have actual values and are valid
  if (updates.type !== undefined) cleanedUpdates.type = updates.type;
  if (updates.nom !== undefined) cleanedUpdates.nom = updates.nom || null;
  if (updates.nomcommercial !== undefined) cleanedUpdates.nomcommercial = updates.nomcommercial || null;
  if (updates.numerorccm !== undefined) cleanedUpdates.numerorccm = updates.numerorccm || null;
  if (updates.raisonsociale !== undefined) cleanedUpdates.raisonsociale = updates.raisonsociale || null;
  if (updates.sigle !== undefined) cleanedUpdates.sigle = updates.sigle || null;
  if (updates.datecreation !== undefined) cleanedUpdates.datecreation = updates.datecreation || null;
  if (updates.lieucreation !== undefined) cleanedUpdates.lieucreation = updates.lieucreation || null;
  if (updates.nomdirigeant !== undefined) cleanedUpdates.nomdirigeant = updates.nomdirigeant || null;
  if (updates.formejuridique !== undefined) cleanedUpdates.formejuridique = updates.formejuridique || null;
  if (updates.niu !== undefined) cleanedUpdates.niu = updates.niu;
  if (updates.centrerattachement !== undefined) cleanedUpdates.centrerattachement = updates.centrerattachement;
  if (updates.adresse !== undefined) cleanedUpdates.adresse = updates.adresse;
  if (updates.contact !== undefined) cleanedUpdates.contact = updates.contact;
  if (updates.secteuractivite !== undefined) cleanedUpdates.secteuractivite = updates.secteuractivite;
  if (updates.numerocnps !== undefined) cleanedUpdates.numerocnps = updates.numerocnps || null;
  if (updates.sexe !== undefined) cleanedUpdates.sexe = updates.sexe || null;
  if (updates.etatcivil !== undefined) cleanedUpdates.etatcivil = updates.etatcivil || null;
  if (updates.situationimmobiliere !== undefined) cleanedUpdates.situationimmobiliere = updates.situationimmobiliere;
  if (updates.statut !== undefined) cleanedUpdates.statut = updates.statut;
  if (updates.gestionexternalisee !== undefined) cleanedUpdates.gestionexternalisee = updates.gestionexternalisee || false;
  if (updates.inscriptionfanrharmony2 !== undefined) cleanedUpdates.inscriptionfanrharmony2 = updates.inscriptionfanrharmony2 || false;

  return cleanedUpdates;
};
