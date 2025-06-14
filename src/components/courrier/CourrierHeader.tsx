
import { Mail } from "lucide-react";

interface CourrierHeaderProps {
  title?: string;
}

const CourrierHeader = ({ title = "Courrier" }: CourrierHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#84A98C] rounded-lg shadow-sm">
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
  );
};

export { CourrierHeader };
export default CourrierHeader;
