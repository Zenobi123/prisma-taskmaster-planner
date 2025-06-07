
import { useEffect } from "react";
import { addDays, format, parse, isValid } from "date-fns";

interface UseValidityDateCalculationProps {
  creationDate: string;
  setValidityEndDate: (date: string) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}

export const useValidityDateCalculation = ({
  creationDate,
  setValidityEndDate,
  setHasUnsavedChanges
}: UseValidityDateCalculationProps) => {
  // Calculer la date de fin de validité lorsque la date de création change
  useEffect(() => {
    if (!creationDate) return;
    
    try {
      // Conversion de la chaîne de date en objet Date
      let creationDateObj: Date;
      
      // Si la date est au format YYYY-MM-DD
      if (creationDate.includes('-')) {
        creationDateObj = new Date(creationDate);
      } else {
        // Si la date est au format DD/MM/YYYY
        creationDateObj = parse(creationDate, 'dd/MM/yyyy', new Date());
      }
      
      // Vérification que la date est valide
      if (isValid(creationDateObj)) {
        // Ajout de 90 jours pour la date de fin de validité
        const endDateObj = addDays(creationDateObj, 90);
        
        // Formatage de la date en chaîne au format YYYY-MM-DD
        const formattedEndDate = format(endDateObj, "yyyy-MM-dd");
        
        setValidityEndDate(formattedEndDate);
        setHasUnsavedChanges(true);
      }
    } catch (error) {
      console.error("Erreur lors du calcul de la date de fin de validité:", error);
    }
  }, [creationDate, setValidityEndDate, setHasUnsavedChanges]);
};
