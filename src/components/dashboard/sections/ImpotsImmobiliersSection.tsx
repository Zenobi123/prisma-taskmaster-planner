
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnpaidBail, getClientsWithUnpaidPSL, getClientsWithUnpaidTF } from "@/services/fiscal/unpaidTaxService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, LoaderCircle } from "lucide-react";
import { UnpaidTaxDialog } from "../UnpaidTaxDialog";
import { Client } from "@/types/client";

type TaxDialogType = "bail" | "psl" | "tf" | null;

export const ImpotsImmobiliersSection = () => {
  const [activeDialog, setActiveDialog] = useState<TaxDialogType>(null);

  const { data: unpaidBail = [], isLoading: loadingBail } = useQuery({
    queryKey: ["clients-unpaid-bail"],
    queryFn: getClientsWithUnpaidBail,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const { data: unpaidPSL = [], isLoading: loadingPSL } = useQuery({
    queryKey: ["clients-unpaid-psl"],
    queryFn: getClientsWithUnpaidPSL,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const { data: unpaidTF = [], isLoading: loadingTF } = useQuery({
    queryKey: ["clients-unpaid-tf"],
    queryFn: getClientsWithUnpaidTF,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const isLoading = loadingBail || loadingPSL || loadingTF;

  const taxSummary = [
    { key: "bail" as const, label: "Bail Commercial", count: unpaidBail.length, clients: unpaidBail },
    { key: "psl" as const, label: "Précompte sur Loyer (PSL)", count: unpaidPSL.length, clients: unpaidPSL },
    { key: "tf" as const, label: "Taxe Foncière (TPF)", count: unpaidTF.length, clients: unpaidTF },
  ];

  const dialogConfig: Record<string, { clients: Client[]; taxName: string }> = {
    bail: { clients: unpaidBail as Client[], taxName: "Bail Commercial" },
    psl: { clients: unpaidPSL as Client[], taxName: "Précompte sur Loyer" },
    tf: { clients: unpaidTF as Client[], taxName: "Taxe Foncière" },
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2 pt-4 sm:pt-6 px-4 sm:px-6">
          <CardTitle className="text-base sm:text-xl flex items-center">
            <Home className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mr-2 shrink-0" />
            Impôts immobiliers
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <LoaderCircle className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {taxSummary.map((tax) => (
                <div key={tax.key} className="flex items-center justify-between p-2 sm:p-3 border rounded-lg gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    {tax.count > 0 && <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-500 shrink-0" />}
                    <span className="text-xs sm:text-sm font-medium truncate">{tax.label}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs sm:text-sm font-bold ${tax.count > 0 ? "text-orange-600" : "text-green-600"}`}>
                      {tax.count > 0 ? `${tax.count} impayé(s)` : "Payés"}
                    </span>
                    {tax.count > 0 && (
                      <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => setActiveDialog(tax.key)}>
                        Voir
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {activeDialog && dialogConfig[activeDialog] && (
        <UnpaidTaxDialog
          open={!!activeDialog}
          onOpenChange={(open) => !open && setActiveDialog(null)}
          clients={dialogConfig[activeDialog].clients}
          isLoading={false}
          taxName={dialogConfig[activeDialog].taxName}
          colorClass="orange"
        />
      )}
    </>
  );
};
