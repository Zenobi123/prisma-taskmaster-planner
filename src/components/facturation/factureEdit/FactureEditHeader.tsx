
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface FactureEditHeaderProps {
  factureId: string;
  onBackClick: () => void;
}

export const FactureEditHeader = ({ factureId, onBackClick }: FactureEditHeaderProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Button
        variant="outline"
        onClick={onBackClick}
        size="sm"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>
      <h1 className="text-2xl font-bold">Modifier la facture {factureId}</h1>
    </div>
  );
};
