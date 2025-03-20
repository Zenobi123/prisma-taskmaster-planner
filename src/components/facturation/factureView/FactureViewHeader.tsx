
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, CreditCard, Printer } from "lucide-react";
import { Facture } from "@/types/facture";
import { formatDate } from "./utils";
import { generatePDF } from "@/utils/pdfUtils";

interface FactureViewHeaderProps {
  facture: Facture;
  onAddPayment?: () => void;
}

export function FactureViewHeader({ facture, onAddPayment }: FactureViewHeaderProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Générer et télécharger la facture en PDF
  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      await generatePDF(facture);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Facture #{facture.id.substring(0, 8)}</h2>
        <p className="text-gray-500">
          Créée le {formatDate(facture.created_at || facture.date)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Télécharger
        </Button>
        <Button 
          variant="outline"
          onClick={() => window.print()}
        >
          <Printer className="mr-2 h-4 w-4" />
          Imprimer
        </Button>
        {(facture.status === "en_attente" || facture.status === "partiellement_payée") && (
          <Button onClick={onAddPayment}>
            <CreditCard className="mr-2 h-4 w-4" />
            Ajouter un paiement
          </Button>
        )}
      </div>
    </div>
  );
}
