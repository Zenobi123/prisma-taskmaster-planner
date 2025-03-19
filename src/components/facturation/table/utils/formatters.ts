
import { format, parseISO } from "date-fns";
import { fr } from 'date-fns/locale';

// Formatage du montant
export const formatMontant = (montant: number) => {
  return montant.toLocaleString('fr-FR') + " FCFA";
};

// Formatage de la date
export const formatDate = (dateStr: string) => {
  try {
    // Vérifier si la date est déjà au format ISO
    if (dateStr.includes('T')) {
      return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: fr });
    }
    
    // Sinon, essayer de la parser au format YYYY-MM-DD
    return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: fr });
  } catch (e) {
    // En cas d'erreur, retourner la date telle quelle
    return dateStr;
  }
};
