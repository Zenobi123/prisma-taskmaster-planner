
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnfiledDsfSummaryProps {
  onViewAllClick: () => void;
  clientsCount: number;
  isLoading?: boolean;
}

const UnfiledDsfSummary = ({ onViewAllClick, clientsCount, isLoading = false }: UnfiledDsfSummaryProps) => {
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
    <Card className="bg-white shadow-md border-2 border-blue-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-neutral-800 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              DSF non déposées
            </h3>
            <div className="flex items-center mt-3">
              <span className="text-4xl font-semibold text-blue-600">{clientsCount}</span>
              <div className="ml-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  À régulariser
                </span>
                <p className="text-neutral-500 mt-1">Clients assujettis</p>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0 border-blue-300 hover:bg-blue-50 hover:text-blue-700" 
            onClick={onViewAllClick}
          >
            Voir tous
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnfiledDsfSummary;
