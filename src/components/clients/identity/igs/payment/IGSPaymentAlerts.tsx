
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Calendar } from "lucide-react";

export function IGSPaymentAlerts() {
  return (
    <>
      <Alert className="bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-800" />
        <AlertTitle className="text-amber-800">Important</AlertTitle>
        <AlertDescription className="text-sm text-amber-800">
          Les paiements et déductions ne sont pris en compte que s'ils sont autorisés par l'administration fiscale.
          Veuillez vous assurer d'avoir les justificatifs nécessaires.
        </AlertDescription>
      </Alert>
      
      <Alert className="bg-blue-50 border-blue-200 mt-4">
        <Calendar className="h-4 w-4 text-blue-800" />
        <AlertTitle className="text-blue-800">Échéances de paiement IGS</AlertTitle>
        <AlertDescription className="text-sm text-blue-800">
          L'IGS se paie par trimestre aux dates suivantes : 15 janvier, 15 avril, 15 juillet et 15 octobre.
          Vous pouvez payer en 1, 2 ou 4 fois selon votre choix.
        </AlertDescription>
      </Alert>
    </>
  );
}
