
import { Mail, Users, FileText } from "lucide-react";

interface CourrierHeaderProps {
  title?: string;
}

const CourrierHeader = ({ title = "Courrier" }: CourrierHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600 mt-1">
                Générez des correspondances personnalisées pour vos clients
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Clients ciblés</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Modèles prédéfinis</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>Envoi automatisé</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CourrierHeader };
export default CourrierHeader;
