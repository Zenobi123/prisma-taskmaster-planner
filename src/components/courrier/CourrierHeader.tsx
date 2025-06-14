
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
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                <p className="text-gray-600 text-sm">
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
