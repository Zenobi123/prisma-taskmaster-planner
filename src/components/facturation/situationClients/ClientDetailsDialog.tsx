
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { FileText, CreditCard, Wallet, Bell } from "lucide-react";
import { formatMontant } from "@/utils/formatUtils";
import { ClientFinancialDetails } from "@/types/clientFinancial";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ModePaiementBadge from "../paiements/ModePaiementBadge";
import StatusBadge from "../StatusBadge";

interface ClientDetailsDialogProps {
  clientDetails: ClientFinancialDetails | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenApplyCreditDialog: (invoiceId: string) => void;
  onOpenReminderDialog: (invoiceId: string) => void;
}

const ClientDetailsDialog = ({ 
  clientDetails, 
  isOpen, 
  onOpenChange, 
  onOpenApplyCreditDialog, 
  onOpenReminderDialog 
}: ClientDetailsDialogProps) => {
  // Helper function to format dates
  const formatDate = (dateString: string) => {
    try {
      return format(
        typeof dateString === 'string' && dateString.includes('-') 
          ? parseISO(dateString) 
          : new Date(dateString), 
        'dd/MM/yyyy', 
        { locale: fr }
      );
    } catch (error) {
      return dateString;
    }
  };

  const availableCredits = clientDetails?.paiements.filter(p => p.est_credit && !p.facture_id) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails financiers du client</DialogTitle>
          <DialogDescription>
            {clientDetails?.solde_disponible && clientDetails.solde_disponible > 0 ? (
              <Alert className="mt-2 bg-green-50 border-green-200">
                <AlertDescription className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-green-500" />
                  Ce client dispose d'un solde positif de {formatMontant(clientDetails.solde_disponible)} 
                  qui peut être utilisé pour ses factures.
                </AlertDescription>
              </Alert>
            ) : null}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="factures" className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="factures">
              <FileText className="h-4 w-4 mr-2" />
              Factures ({clientDetails?.factures?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="paiements">
              <CreditCard className="h-4 w-4 mr-2" />
              Paiements ({clientDetails?.paiements?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="factures">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Payé</TableHead>
                  <TableHead>Restant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientDetails?.factures && clientDetails.factures.length > 0 ? (
                  clientDetails.factures.map((facture) => (
                    <TableRow key={facture.id}>
                      <TableCell className="font-medium">{facture.id}</TableCell>
                      <TableCell>{formatDate(facture.date)}</TableCell>
                      <TableCell>{formatDate(facture.echeance)}</TableCell>
                      <TableCell>{formatMontant(facture.montant)}</TableCell>
                      <TableCell>{formatMontant(facture.montant_paye || 0)}</TableCell>
                      <TableCell className={facture.montant_restant > 0 ? "text-red-600" : "text-green-600"}>
                        {formatMontant(facture.montant_restant)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={facture.status_paiement} type="paiement" />
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        {facture.status_paiement !== 'payée' && availableCredits.length > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onOpenApplyCreditDialog(facture.id)}
                            title="Appliquer une avance"
                          >
                            <Wallet className="h-4 w-4" />
                          </Button>
                        )}
                        {facture.status_paiement !== 'payée' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onOpenReminderDialog(facture.id)}
                            title="Envoyer un rappel"
                          >
                            <Bell className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                      Aucune facture trouvée pour ce client
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="paiements">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Facture</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientDetails?.paiements && clientDetails.paiements.length > 0 ? (
                  clientDetails.paiements.map((paiement) => (
                    <TableRow key={paiement.id}>
                      <TableCell className="font-medium">{paiement.reference}</TableCell>
                      <TableCell>{formatDate(paiement.date)}</TableCell>
                      <TableCell>{formatMontant(paiement.montant)}</TableCell>
                      <TableCell>
                        <ModePaiementBadge mode={paiement.mode} />
                      </TableCell>
                      <TableCell>
                        {paiement.facture_id || (paiement.est_credit ? "Crédit" : "N/A")}
                      </TableCell>
                      <TableCell>
                        {paiement.est_credit ? (
                          <Badge className="bg-blue-500">Avance</Badge>
                        ) : (
                          <Badge variant="outline">Standard</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      Aucun paiement trouvé pour ce client
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailsDialog;
