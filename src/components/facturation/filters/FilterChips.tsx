
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Client } from "@/types/client";

interface FilterChipsProps {
  statusFilter: string | null;
  clientFilter: string | null;
  dateFilter: Date | null;
  setStatusFilter: (value: string | null) => void;
  setClientFilter: (value: string | null) => void;
  setDateFilter: (value: Date | null) => void;
  clients: Client[];
}

const FilterChips = ({
  statusFilter,
  clientFilter,
  dateFilter,
  setStatusFilter,
  setClientFilter,
  setDateFilter,
  clients
}: FilterChipsProps) => {
  if (!statusFilter && !clientFilter && !dateFilter) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 text-sm">
      {statusFilter && (
        <div className="bg-gray-100 rounded-full px-3 py-1 flex items-center">
          <span>Statut: {statusFilter === "en_attente" ? "Non payé" : statusFilter === "partiellement_payée" ? "Partiellement payé" : statusFilter === "payée" ? "Payé" : statusFilter}</span>
          <button 
            className="ml-2 text-gray-500 hover:text-gray-700"
            onClick={() => setStatusFilter(null)}
          >
            ×
          </button>
        </div>
      )}
      {clientFilter && (
        <div className="bg-gray-100 rounded-full px-3 py-1 flex items-center">
          <span>Client: {clients.find(c => c.id === clientFilter)?.nom || clients.find(c => c.id === clientFilter)?.raisonsociale || 'Inconnu'}</span>
          <button 
            className="ml-2 text-gray-500 hover:text-gray-700"
            onClick={() => setClientFilter(null)}
          >
            ×
          </button>
        </div>
      )}
      {dateFilter && (
        <div className="bg-gray-100 rounded-full px-3 py-1 flex items-center">
          <span>Date: {format(dateFilter, "dd/MM/yyyy", { locale: fr })}</span>
          <button 
            className="ml-2 text-gray-500 hover:text-gray-700"
            onClick={() => setDateFilter(null)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterChips;
