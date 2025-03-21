
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Client } from "@/types/client";
import { formatMontant } from "@/utils/formatUtils";

interface FilterChipsProps {
  statusFilter: string | null;
  clientFilter: string | null;
  dateFilter: Date | null;
  periodeFilter: {
    debut: Date | null;
    fin: Date | null;
  };
  montantFilter: {
    min: number | null;
    max: number | null;
  };
  modePaiementFilter: string | null;
  setStatusFilter: (value: string | null) => void;
  setClientFilter: (value: string | null) => void;
  setDateFilter: (value: Date | null) => void;
  setPeriodeFilter: (value: { debut: Date | null; fin: Date | null; }) => void;
  setMontantFilter: (value: { min: number | null; max: number | null; }) => void;
  setModePaiementFilter: (value: string | null) => void;
  clients: Client[];
}

const FilterChips = ({
  statusFilter,
  clientFilter,
  dateFilter,
  periodeFilter,
  montantFilter,
  modePaiementFilter,
  setStatusFilter,
  setClientFilter,
  setDateFilter,
  setPeriodeFilter,
  setMontantFilter,
  setModePaiementFilter,
  clients
}: FilterChipsProps) => {
  const hasFilters = !!(
    statusFilter || 
    clientFilter || 
    dateFilter || 
    periodeFilter.debut || 
    periodeFilter.fin || 
    montantFilter.min || 
    montantFilter.max || 
    modePaiementFilter
  );

  if (!hasFilters) {
    return null;
  }

  const getModePaiementLabel = (mode: string) => {
    const modes: Record<string, string> = {
      'virement': 'Virement bancaire',
      'carte': 'Carte bancaire',
      'cheque': 'Chèque',
      'especes': 'Espèces',
      'mobile_money': 'Mobile Money'
    };
    return modes[mode] || mode;
  };

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

      {/* Période */}
      {(periodeFilter.debut || periodeFilter.fin) && (
        <div className="bg-gray-100 rounded-full px-3 py-1 flex items-center">
          <span>
            Période: 
            {periodeFilter.debut && ` du ${format(periodeFilter.debut, "dd/MM/yyyy", { locale: fr })}`}
            {periodeFilter.fin && ` au ${format(periodeFilter.fin, "dd/MM/yyyy", { locale: fr })}`}
          </span>
          <button 
            className="ml-2 text-gray-500 hover:text-gray-700"
            onClick={() => setPeriodeFilter({ debut: null, fin: null })}
          >
            ×
          </button>
        </div>
      )}

      {/* Montant */}
      {(montantFilter.min !== null || montantFilter.max !== null) && (
        <div className="bg-gray-100 rounded-full px-3 py-1 flex items-center">
          <span>
            Montant: 
            {montantFilter.min !== null && ` min ${formatMontant(montantFilter.min)}`}
            {montantFilter.min !== null && montantFilter.max !== null && ' -'}
            {montantFilter.max !== null && ` max ${formatMontant(montantFilter.max)}`}
          </span>
          <button 
            className="ml-2 text-gray-500 hover:text-gray-700"
            onClick={() => setMontantFilter({ min: null, max: null })}
          >
            ×
          </button>
        </div>
      )}

      {/* Mode de paiement */}
      {modePaiementFilter && (
        <div className="bg-gray-100 rounded-full px-3 py-1 flex items-center">
          <span>Mode: {getModePaiementLabel(modePaiementFilter)}</span>
          <button 
            className="ml-2 text-gray-500 hover:text-gray-700"
            onClick={() => setModePaiementFilter(null)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterChips;
