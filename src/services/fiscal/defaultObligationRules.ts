
import { Client } from "@/types/client";

// Fonction pour déterminer si un client devrait être assujetti selon les règles par défaut
export const shouldClientBeSubjectToObligation = (client: Client, obligationType: string): boolean => {
  const sitType = client.situationimmobiliere?.type;
  const isLocataire = sitType === "locataire" || sitType === "les_deux";
  const isProprietaire = sitType === "proprietaire" || sitType === "les_deux";

  // Règles communes (physique et morale)
  if (obligationType === "igs" && client.regimefiscal === "igs") {
    return true;
  }
  if (obligationType === "patente" && client.regimefiscal === "reel") {
    return true;
  }
  if (obligationType === "dsf" && (client.regimefiscal === "reel" || client.regimefiscal === "igs")) {
    return true;
  }

  // Bail Commercial : locataire avec loyer renseigné
  if (obligationType === "bailCommercial" && isLocataire && client.situationimmobiliere?.loyer) {
    return true;
  }

  // Précompte sur Loyer : locataire professionnel avec loyer renseigné
  if (obligationType === "precompteLoyer" && isLocataire && client.situationimmobiliere?.loyer && client.regimefiscal !== "non_professionnel") {
    return true;
  }

  // Taxe Foncière : propriétaire avec valeur du bien renseignée
  if (obligationType === "tpf" && isProprietaire && client.situationimmobiliere?.valeur) {
    return true;
  }

  // Règles spécifiques personnes physiques
  if (client.type === "physique") {
    if (obligationType === "darp") {
      return true;
    }
  }

  // Règles spécifiques personnes morales
  if (client.type === "morale") {
    if (obligationType === "dbef") {
      return true;
    }
  }

  return false;
};
