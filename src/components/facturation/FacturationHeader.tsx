
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FacturationHeaderProps {
  onNewFactureClick: () => void;
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
}

export const FacturationHeader = ({ 
  onNewFactureClick,
  searchTerm = "",
  setSearchTerm
}: FacturationHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-4">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
        
        <Button className="flex items-center gap-2 whitespace-nowrap" onClick={onNewFactureClick}>
          <span className="w-4 h-4">+</span>
          Nouvelle facture
        </Button>
      </div>

      <div className="flex items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="text-left">
            <h1 className="text-2xl font-bold">Facturation</h1>
            <p className="text-neutral-600">
              Gérez vos factures clients et suivez les paiements
            </p>
          </div>
        </div>
      </div>

      {setSearchTerm && (
        <div className="relative w-full mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher une facture par numéro, client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      )}
    </>
  );
};
