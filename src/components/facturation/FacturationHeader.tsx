
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FacturationHeaderProps {
  onNewFactureClick: () => void;
}

export const FacturationHeader = ({ onNewFactureClick }: FacturationHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
        
        <Button className="flex items-center gap-2" onClick={onNewFactureClick}>
          <span className="w-4 h-4">+</span>
          Nouvelle facture
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Facturation
          </h1>
          <p className="text-neutral-600 mt-1">
            Gérez vos factures clients et suivez les paiements
          </p>
        </div>
      </div>
    </>
  );
};
