
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface FactureAlreadyPaidProps {
  factureId: string;
  onBackClick: () => void;
}

export const FactureAlreadyPaid = ({ factureId, onBackClick }: FactureAlreadyPaidProps) => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-amber-600 mb-4">Cette facture a déjà été payée et ne peut plus être modifiée.</p>
        <Button variant="outline" onClick={onBackClick}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux détails
        </Button>
      </div>
    </div>
  );
};
