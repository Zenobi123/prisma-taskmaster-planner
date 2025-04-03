
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnpaidPatenteSummaryProps {
  onViewAllClick: () => void;
  clientsCount: number;
  isLoading?: boolean;
}

const UnpaidPatenteSummary = ({ onViewAllClick, clientsCount, isLoading = false }: UnpaidPatenteSummaryProps) => {
  if (isLoading) {
    return (
      <Card className="bg-white shadow-md">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-md border-2 border-amber-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-neutral-800 flex items-center">
              <FileBarChart className="h-5 w-5 mr-2 text-amber-500" />
              Patentes impayées
            </h3>
            <div className="flex items-center mt-3">
              <span className="text-4xl font-semibold text-amber-600">{clientsCount}</span>
              <div className="ml-4">
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                  À régulariser
                </span>
                <p className="text-neutral-500 mt-1">Clients assujettis</p>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0 border-amber-300 hover:bg-amber-50 hover:text-amber-700" 
            onClick={onViewAllClick}
          >
            Voir tous
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnpaidPatenteSummary;
