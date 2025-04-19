
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
    <div className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-4">
          <Icon className="h-8 w-8 text-gray-400" />
          <div>
            <h3 className="font-semibold text-lg">{titre}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
            <p className="text-xs text-gray-500 mt-2">
              {date} • {taille}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onGenerate}
          className="hover:bg-gray-100"
        >
          <Download className="w-4 h-4 mr-2 text-[#3C6255]" />
          Générer
        </Button>
      </div>
    </div>
  );
};
