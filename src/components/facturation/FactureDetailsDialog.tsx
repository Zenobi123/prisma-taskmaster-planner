
import { Facture } from "@/types/facture";
import { Download, Printer, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Détails de la Facture {selectedFacture.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Informations facture</h3>
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">N° Facture:</span>
                  <span>{selectedFacture.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Date d'émission:</span>
                  <span>{selectedFacture.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Date d'échéance:</span>
                  <span>{selectedFacture.echeance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Statut:</span>
                  <span>{getStatusBadge(selectedFacture.status)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Client</h3>
              <div className="rounded-lg border p-4 space-y-2">
                <div className="font-medium">{selectedFacture.client.nom}</div>
                <div className="text-sm">{selectedFacture.client.adresse}</div>
                <div className="text-sm">Tél: {selectedFacture.client.telephone}</div>
                <div className="text-sm">Email: {selectedFacture.client.email}</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Prestations</h3>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80%]">Description</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedFacture.prestations.map((prestation, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{prestation.description}</TableCell>
                      <TableCell className="text-right">{formatMontant(prestation.montant)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right font-bold">{formatMontant(selectedFacture.montant)}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>

          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onPrintInvoice(selectedFacture.id)}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimer
              </Button>
              <Button onClick={() => onDownloadInvoice(selectedFacture.id)}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
