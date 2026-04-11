
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ReportCardProps {
  id: number;
  titre: string;
  date: string;
  type: string;
  taille: string;
  icon: LucideIcon;
  description: string;
  onGenerate: () => void;
}

export const ReportCard = ({
  titre,
  date,
  description,
  taille,
  icon: Icon,
  onGenerate
}: ReportCardProps) => {
  return (
    <div className="p-3 sm:p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
          <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <h3 className="font-semibold text-base sm:text-lg">{titre}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{description}</p>
            <p className="text-xs text-gray-500 mt-1 sm:mt-2">
              {date} • {taille}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onGenerate}
          className="hover:bg-gray-100 shrink-0 w-full sm:w-auto"
        >
          <Download className="w-4 h-4 mr-2 text-[#3C6255]" />
          Générer
        </Button>
      </div>
    </div>
  );
};
