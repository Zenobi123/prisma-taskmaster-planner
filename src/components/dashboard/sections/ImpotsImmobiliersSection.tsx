
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
    staleTime: 60 * 1000,
  });

  const { data: unpaidPSL = [], isLoading: loadingPSL } = useQuery({
    queryKey: ["clients-unpaid-psl"],
    queryFn: getClientsWithUnpaidPSL,
    staleTime: 60 * 1000,
  });

  const { data: unpaidTF = [], isLoading: loadingTF } = useQuery({
    queryKey: ["clients-unpaid-tf"],
    queryFn: getClientsWithUnpaidTF,
    staleTime: 60 * 1000,
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
        <CardHeader className="pb-2 pt-6">
          <CardTitle className="text-xl flex items-center">
            <Home className="h-5 w-5 text-orange-600 mr-2" />
            Impôts liés à l'immobilier
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <LoaderCircle className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-3">
              {taxSummary.map((tax) => (
                <div key={tax.key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {tax.count > 0 && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                    <span className="text-sm font-medium">{tax.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${tax.count > 0 ? "text-orange-600" : "text-green-600"}`}>
                      {tax.count > 0 ? `${tax.count} impayé(s)` : "Tous payés"}
                    </span>
                    {tax.count > 0 && (
                      <Button variant="outline" size="sm" onClick={() => setActiveDialog(tax.key)}>
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
