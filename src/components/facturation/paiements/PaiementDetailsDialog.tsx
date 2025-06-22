
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Paiement } from "@/types/paiement";
import { formatMontant } from "@/utils/formatUtils";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle, Clock, CreditCard, FileText, User, Calendar, Hash, MessageSquare } from "lucide-react";
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
        'dd MMMM yyyy', 
        { locale: fr }
      );
    } catch (error) {
      return dateString;
    }
  };

  const getPaymentTypeBadge = () => {
    if (paiement.est_credit) {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Avance Client</Badge>;
    }
    if (paiement.type_paiement === "partiel") {
      return <Badge variant="outline" className="text-orange-600 border-orange-300">Paiement Partiel</Badge>;
    }
    return <Badge variant="outline" className="text-green-600 border-green-300">Paiement Total</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Détails du Paiement
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{paiement.reference}</h3>
              <div className="flex items-center gap-2 mt-1">
                {paiement.est_verifie ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Vérifié</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">En attente de vérification</span>
                  </div>
                )}
                {getPaymentTypeBadge()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {formatMontant(paiement.montant)}
              </div>
              <ModePaiementBadge mode={paiement.mode} />
            </div>
          </div>

          <Separator />

          {/* Client and Invoice Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Client</span>
              </div>
              <p className="text-lg pl-6">{paiement.client}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Facture associée</span>
              </div>
              <p className="text-lg pl-6">
                {paiement.facture || (paiement.est_credit ? "Avance (aucune facture)" : "N/A")}
              </p>
            </div>
          </div>

          <Separator />

          {/* Payment Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Date de paiement</span>
              </div>
              <p className="text-lg pl-6">{formatDate(paiement.date)}</p>

              {paiement.reference_transaction && (
                <>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Référence transaction</span>
                  </div>
                  <p className="text-lg pl-6 font-mono">{paiement.reference_transaction}</p>
                </>
              )}
            </div>

            <div className="space-y-4">
              {paiement.solde_restant > 0 && (
                <>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Solde restant</span>
                  </div>
                  <p className="text-lg pl-6 text-red-600 font-semibold">
                    {formatMontant(paiement.solde_restant)}
                  </p>
                </>
              )}

              {paiement.est_credit && (
                <>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-blue-600">Crédit disponible</span>
                  </div>
                  <p className="text-lg pl-6 text-blue-600 font-semibold">
                    {formatMontant(paiement.montant)}
                  </p>
                </>
              )}
            </div>
          </div>

          {paiement.notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Notes</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700">{paiement.notes}</p>
                </div>
              </div>
            </>
          )}

          {/* Payment breakdown for partial payments */}
          {paiement.prestations_payees && paiement.prestations_payees.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  Prestations payées
                </h4>
                <div className="space-y-2">
                  {paiement.prestations_payees.map((prestation, index) => (
                    <div key={prestation.id || index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                      <span>Prestation {prestation.id}</span>
                      <span className="font-medium">
                        {prestation.montant_modifie !== null 
                          ? formatMontant(prestation.montant_modifie) 
                          : "Montant original"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaiementDetailsDialog;
