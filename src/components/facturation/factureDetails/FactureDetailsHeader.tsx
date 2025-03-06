
import { Facture } from "@/types/facture";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getStatusBadge } from "../FactureTable";

interface FactureDetailsHeaderProps {
  selectedFacture: Facture;
  onPrintInvoice: (factureId: string) => void;
  onDownloadInvoice: (factureId: string) => void;
}

export const FactureDetailsHeader = ({
  selectedFacture,
  onPrintInvoice,
  onDownloadInvoice,
}: FactureDetailsHeaderProps) => {
  return (
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
  );
};
