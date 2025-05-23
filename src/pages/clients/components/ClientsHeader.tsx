
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DialogTrigger } from "@/components/ui/dialog";

interface ClientsHeaderProps {
  onAddClientClick: () => void;
  isMobile?: boolean;
}

export function ClientsHeader({ onAddClientClick, isMobile }: ClientsHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={`mb-${isMobile ? '6' : '8'}`}>
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
      </div>
      <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'flex-row items-center'} justify-between`}>
        <div>
          <h1 className={`text-${isMobile ? 'xl' : '2xl'} font-semibold text-neutral-800`}>Clients</h1>
          <p className="text-neutral-600 mt-1">
            Gérez vos clients et leurs informations
          </p>
        </div>
        <DialogTrigger asChild onClick={onAddClientClick}>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nouveau client
          </Button>
        </DialogTrigger>
      </div>
    </header>
  );
}
