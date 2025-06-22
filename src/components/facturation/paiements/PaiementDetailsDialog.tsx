
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Paiement } from "@/types/paiement";
import { formatMontant } from "@/utils/formatUtils";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { FileText, User, Calendar, CreditCard, Receipt, Hash, DollarSign } from "lucide-react";
import ModePaiementBadge from "./ModePaiementBadge";

interface PaiementDetailsDialogProps {
  paiement: Paiement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PaiementDetailsDialog = ({ paiement, open, onOpenChange }: PaiementDetailsDialogProps) => {
  if (!paiement) return null;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Receipt className="h-5 w-5 text-primary" />
            Détails du paiement {paiement.reference}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations principales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-4 w-4" />
                Informations principales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Hash className="h-3 w-3" />
                    Référence
                  </p>
                  <p className="font-medium">{paiement.reference}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <DollarSign className="h-3 w-3" />
                    Montant
                  </p>
                  <p className="font-bold text-lg text-primary">{formatMontant(paiement.montant)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    Date
                  </p>
                  <p className="font-medium">{formatDate(paiement.date)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <CreditCard className="h-3 w-3" />
                    Mode de paiement
                  </p>
                  <ModePaiementBadge mode={paiement.mode} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations client et facture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-4 w-4" />
                Client et facturation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Client</p>
                <p className="font-medium text-lg">{paiement.client}</p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Facture associée</p>
                  <p className="font-medium">
                    {paiement.est_credit ? (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Crédit client
                      </Badge>
                    ) : (
                      paiement.facture || "N/A"
                    )}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Solde restant</p>
                  <p className={`font-medium ${paiement.solde_restant > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {formatMontant(paiement.solde_restant)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Détails techniques */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails techniques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paiement.reference_transaction && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Référence de transaction</p>
                  <p className="font-medium font-mono text-sm bg-gray-100 p-2 rounded">
                    {paiement.reference_transaction}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Type de paiement</p>
                  <Badge variant={paiement.type_paiement === "total" ? "default" : "outline"}>
                    {paiement.type_paiement === "total" ? "Paiement total" : "Paiement partiel"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Statut de vérification</p>
                  <Badge variant={paiement.est_verifie ? "default" : "secondary"}>
                    {paiement.est_verifie ? "Vérifié" : "En attente"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {paiement.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md italic">
                  {paiement.notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Prestations payées (si paiement partiel) */}
          {paiement.type_paiement === "partiel" && paiement.prestations_payees && paiement.prestations_payees.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prestations payées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {paiement.prestations_payees.map((prestation, index) => (
                    <div key={prestation.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">Prestation {index + 1}</span>
                      <span className="font-medium">
                        {prestation.montant_modifie ? formatMontant(prestation.montant_modifie) : "Montant original"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaiementDetailsDialog;
