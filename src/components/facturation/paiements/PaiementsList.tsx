
import { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import PaiementTableRow from "./PaiementTableRow";
import { Card, CardContent } from "@/components/ui/card";
import { Paiement } from "@/types/paiement";
import PaymentReceiptDialog from "./dialog/PaymentReceiptDialog";

interface PaiementsListProps {
  paiements: Paiement[];
  onDelete?: (id: string) => Promise<boolean>;
}

const PaiementsList = ({ paiements, onDelete }: PaiementsListProps) => {
  const [viewReceiptDialogOpen, setViewReceiptDialogOpen] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);
  
  const handleViewReceipt = (paiement: Paiement) => {
    setSelectedPaiement(paiement);
    setViewReceiptDialogOpen(true);
  };
  
  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Facture</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Solde restant</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paiements.length === 0 ? (
                  <TableRow>
                    <TableHead colSpan={8} className="text-center py-6">
                      Aucun paiement trouvé
                    </TableHead>
                  </TableRow>
                ) : (
                  paiements.map((paiement) => (
                    <PaiementTableRow 
                      key={paiement.id}
                      paiement={paiement}
                      onDelete={onDelete}
                      onViewReceipt={handleViewReceipt}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <PaymentReceiptDialog 
        paiement={selectedPaiement}
        open={viewReceiptDialogOpen}
        onOpenChange={setViewReceiptDialogOpen}
      />
    </>
  );
};

export default PaiementsList;
