
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, ExternalLink } from "lucide-react";
import { Facture, Paiement } from "@/types/facture";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface PaiementDetailsProps {
  paiement: Paiement;
  facture: Facture;
}

export function PaiementDetails({ paiement, facture }: PaiementDetailsProps) {
  // Fonction pour formater les montants
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + " XAF";
  };

  // Fonction pour formater les dates
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd MMMM yyyy", { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête et informations générales */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Informations générales</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Référence</p>
            <p className="font-medium">{paiement.id.substring(0, 8)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p>{formatDate(paiement.date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Montant</p>
            <p className="font-bold">{formatMontant(paiement.montant)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Mode de paiement</p>
            <p className="capitalize">{paiement.mode}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Informations sur la facture */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Facture associée</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Numéro de facture</p>
            <p className="font-medium">{facture.id.substring(0, 8)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Client</p>
            <p>{facture.client.nom}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Montant total de la facture</p>
            <p>{formatMontant(facture.montant)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Statut</p>
            <p>{facture.status.replace('_', ' ')}</p>
          </div>
        </div>
        <div className="mt-2">
          <Button 
            variant="outline" 
            size="sm"
            className="mt-2"
            onClick={() => window.open(`/facturation?tab=factures&id=${facture.id}`, '_blank')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Voir la facture complète
          </Button>
        </div>
      </div>

      {/* Notes */}
      {paiement.notes && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Notes</h3>
            <p className="whitespace-pre-wrap text-gray-700">{paiement.notes}</p>
          </div>
        </>
      )}
    </div>
  );
}
