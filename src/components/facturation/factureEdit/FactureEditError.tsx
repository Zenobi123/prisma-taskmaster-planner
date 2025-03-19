
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface FactureEditErrorProps {
  onBackClick: () => void;
}

export const FactureEditError = ({ onBackClick }: FactureEditErrorProps) => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-destructive mb-4">Erreur lors du chargement de la facture</p>
        <Button variant="outline" onClick={onBackClick}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>
      </div>
    </div>
  );
};
