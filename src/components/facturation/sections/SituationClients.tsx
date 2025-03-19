
import { Facture } from "@/types/facture";
import { ClientSearchFilters } from "./situationClients/ClientSearchFilters";
import { ClientStatsCards } from "./situationClients/ClientStatsCards";
import { ClientsTable } from "./situationClients/ClientsTable";
import { RecoveryRateCard } from "./situationClients/RecoveryRateCard";
import { useState } from "react";
import { getClientsFromFactures } from "./situationClients/utils";

interface SituationClientsProps {
  factures: Facture[];
  formatMontant: (montant: number) => string;
}

export const SituationClients = ({ factures, formatMontant }: SituationClientsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const clients = getClientsFromFactures(factures);
  const filteredClients = clients.filter(client => 
    client.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <ClientSearchFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        clientsCount={clients.length}
      />

      <ClientStatsCards 
        factures={factures}
        formatMontant={formatMontant}
      />

      <RecoveryRateCard 
        factures={factures} 
        formatMontant={formatMontant}
      />

      <ClientsTable 
        clients={filteredClients}
        factures={factures}
        formatMontant={formatMontant}
      />
    </div>
  );
};
