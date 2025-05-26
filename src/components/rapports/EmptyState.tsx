
import { FileText } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="text-center py-10 border rounded-lg bg-gray-50">
      <FileText className="w-10 h-10 mx-auto text-gray-400 mb-3" />
      <p className="text-gray-600">Aucun rapport ne correspond à votre recherche</p>
    </div>
  );
};
