
import { Facture } from "@/types/facture";
import { Download, Printer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getStatusBadge } from "./FactureTable";

interface FactureDetailsDialogProps {
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
  selectedFacture: Facture | null;
  formatMontant: (montant: number) => string;
  onPrintInvoice: (factureId: string) => void;
  onDownloadInvoice: (factureId: string) => void;
}

export const FactureDetailsDialog = ({
  showDetails,
  setShowDetails,
  selectedFacture,
  formatMontant,
  onPrintInvoice,
  onDownloadInvoice,
}: FactureDetailsDialogProps) => {
  if (!selectedFacture) return null;

  return (
    <Dialog open={showDetails} onOpenChange={setShowDetails}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              Facture {selectedFacture.id}
              {getStatusBadge(selectedFacture.status)}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPrintInvoice(selectedFacture.id)}
                className="h-8 w-8 transition-transform hover:scale-105"
              >
                <Printer className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDownloadInvoice(selectedFacture.id)}
                className="h-8 w-8 transition-transform hover:scale-105"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            Détails de la facture du {selectedFacture.date}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-neutral-500">Client</h3>
                <p className="font-medium">{selectedFacture.client.nom}</p>
                {selectedFacture.client.adresse && (
                  <p className="text-sm text-neutral-600">{selectedFacture.client.adresse}</p>
                )}
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-neutral-500">Date d'émission</h3>
                  <p>{selectedFacture.date}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-neutral-500">Échéance</h3>
                  <p>{selectedFacture.echeance}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-2">Prestations</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Montant
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {selectedFacture.prestations.map((prestation, index) => (
                      <tr 
                        key={index}
                        className="transition-colors hover:bg-neutral-50"
                      >
                        <td className="px-4 py-3 text-sm">{prestation.description}</td>
                        <td className="px-4 py-3 text-sm text-right">
                          {formatMontant(prestation.montant)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-neutral-50">
                    <tr>
                      <td className="px-4 py-2 text-sm font-medium">Total</td>
                      <td className="px-4 py-2 text-sm font-medium text-right">
                        {formatMontant(selectedFacture.montant)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {selectedFacture.notes && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-neutral-500">Notes</h3>
                <p className="text-sm p-3 bg-neutral-50 rounded-md">{selectedFacture.notes}</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setShowDetails(false)}
            className="transition-all hover:bg-neutral-100"
          >
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
