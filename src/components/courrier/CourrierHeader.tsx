
import { Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CourrierHeaderProps {
  title?: string;
}

const CourrierHeader = ({ title = "Courrier" }: CourrierHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour</span>
            </Button>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="p-2 bg-blue-600 rounded-lg shrink-0">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 truncate">{title}</h1>
                <p className="text-gray-600 text-sm hidden sm:block">
                  Générez des correspondances personnalisées pour vos clients
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CourrierHeader };
export default CourrierHeader;
