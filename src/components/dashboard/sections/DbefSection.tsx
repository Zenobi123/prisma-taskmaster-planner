
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnfiledDbef } from "@/services/fiscal/unfiledDbefService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import { UnfiledDbefDialog } from "../UnfiledDbefDialog";

const DbefSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients-unfiled-dbef-section"],
    queryFn: getClientsWithUnfiledDbef,
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000
  });

  return (
    <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
      <Card className="bg-white shadow-md border-2 border-purple-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-xl font-semibold text-neutral-800 flex items-center">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-500 shrink-0" />
                DBEF non déposées
              </h3>
              {isLoading ? (
                <div className="flex items-center mt-2 sm:mt-3">
                  <LoaderCircle className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="flex items-center mt-2 sm:mt-3">
                  <span className="text-3xl sm:text-4xl font-semibold text-purple-600">{clients.length}</span>
                  <div className="ml-3 sm:ml-4">
                    <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {clients.length > 0 ? "À régulariser" : "À jour"}
                    </span>
                    <p className="text-neutral-500 mt-1 text-xs sm:text-sm">PM assujetties</p>
                  </div>
                </div>
              )}
            </div>
            {clients.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="border-purple-300 hover:bg-purple-50 hover:text-purple-700 shrink-0"
                onClick={() => setIsDialogOpen(true)}
              >
                Voir tous
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <UnfiledDbefDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};

export default DbefSection;
