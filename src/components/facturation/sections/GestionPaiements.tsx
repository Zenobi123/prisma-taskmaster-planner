
import { useState } from "react";
import { Facture, Paiement } from "@/types/facture";
import { PaiementPartielDialog } from "../PaiementPartielDialog";
import { PaiementStatsCards } from "./paiements/PaiementStatsCards";
import { PaiementSearchFilters } from "./paiements/PaiementSearchFilters";
import { EnregistrerPaiementDialog } from "./paiements/EnregistrerPaiementDialog";
import { FacturesCard } from "./paiements/FacturesCard";
import { usePaiementsState } from "./paiements/usePaiementsState";

interface GestionPaiementsProps {
  factures: Facture[];
  onUpdateStatus: (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée' | 'partiellement_payée') => void;
  formatMontant: (montant: number) => string;
  onPaiementPartiel?: (factureId: string, paiement: Paiement, prestationsIds: string[]) => Promise<Facture | null>;
}

export const GestionPaiements = ({ 
  factures, 
  onUpdateStatus, 
  formatMontant,
  onPaiementPartiel 
}: GestionPaiementsProps) => {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredFactures,
    showPaymentDialog,
    setShowPaymentDialog,
    showPartialPaymentDialog,
    setShowPartialPaymentDialog,
    selectedFacture,
    handleOpenPaymentDialog,
    handleOpenPartialPaymentDialog,
    handleRegisterPayment
  } = usePaiementsState(factures, onUpdateStatus);

  return (
    <div className="space-y-6">
      <PaiementSearchFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <PaiementStatsCards 
        factures={factures}
        formatMontant={formatMontant}
      />

      <FacturesCard 
        factures={filteredFactures}
        formatMontant={formatMontant}
        onOpenPaymentDialog={handleOpenPaymentDialog}
        onOpenPartialPaymentDialog={handleOpenPartialPaymentDialog}
      />
      
      <EnregistrerPaiementDialog 
        isOpen={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        selectedFacture={selectedFacture}
        formatMontant={formatMontant}
        onConfirmPaiement={handleRegisterPayment}
      />

      {onPaiementPartiel && (
        <PaiementPartielDialog
          isOpen={showPartialPaymentDialog}
          onOpenChange={setShowPartialPaymentDialog}
          facture={selectedFacture}
          formatMontant={formatMontant}
          onConfirmPaiement={onPaiementPartiel}
        />
      )}
    </div>
  );
};
