
import { Mail } from "lucide-react";

export const CourrierHeader = () => {
  return (
    <div className="flex items-center gap-4 mb-8">
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
