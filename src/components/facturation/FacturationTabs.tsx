
import { Facture } from "@/types/facture";

interface FacturationTabsProps {
  factures: Facture[];
  formatMontant: (montant: number) => string;
  onUpdateStatus: (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée' | 'partiellement_payée') => void;
  onDeleteInvoice: (factureId: string) => Promise<boolean> | void;
  onPaiementPartiel: (factureId: string, paiement: any, prestationsIds: string[]) => Promise<Facture | null>;
  isAdmin?: boolean;
}

export const FacturationTabs = ({
  factures,
  formatMontant,
  onUpdateStatus,
  onDeleteInvoice,
  onPaiementPartiel,
  isAdmin = false,
}: FacturationTabsProps) => {
  return (
    <div className="mt-6 animate-fade-in">
      <div className="text-center py-16">
        <h3 className="text-lg font-medium">Aucun contenu à afficher</h3>
        <p className="text-muted-foreground mt-2">
          Les onglets "Paiements" et "Situation clients" ont été supprimés.
        </p>
      </div>
    </div>
  );
};
