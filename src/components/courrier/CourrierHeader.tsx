
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CourrierHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-8">
      <Button
        variant="outline"
        onClick={() => navigate("/")}
        className="flex items-center gap-2 hover:bg-[#F2FCE2]"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Button>
      <div className="p-3 bg-blue-100 rounded-lg">
        <Mail className="w-8 h-8 text-blue-600" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-neutral-800">Courrier</h1>
        <p className="text-neutral-600 mt-1">
          Générez des correspondances personnalisées pour vos clients
        </p>
      </div>
    </div>
  );
};
