
import { Client } from "@/types/client";

// Fonction pour déterminer si un client devrait être assujetti selon les règles par défaut
export const shouldClientBeSubjectToObligation = (client: Client, obligationType: string): boolean => {
  // Règles pour les personnes physiques
  if (client.type === "physique") {
    if (obligationType === "igs" && client.regimefiscal === "igs") {
      return true;
    }
    if (obligationType === "patente" && client.regimefiscal === "reel") {
      return true;
    }
    if (obligationType === "dsf" && (client.regimefiscal === "reel" || client.regimefiscal === "igs")) {
      return true; // DSF automatique pour les assujettis IGS/Patente
    }
    if (obligationType === "darp") {
      return true; // Toutes les personnes physiques sont assujetties à la DARP
    }
  }
  
  // Règles pour les personnes morales
  if (client.type === "morale") {
    if (obligationType === "igs" && client.regimefiscal === "igs") {
      return true;
    }
    if (obligationType === "patente" && client.regimefiscal === "reel") {
      return true;
    }
    if (obligationType === "dsf" && (client.regimefiscal === "reel" || client.regimefiscal === "igs")) {
      return true; // DSF automatique pour les assujettis IGS/Patente
    }
  }
  
  return false;
};
