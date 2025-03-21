
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Client } from "@/types/client";
import { Facture } from "@/types/facture";
import StatusSelector from "../factures/StatusSelector";
import ClientSelector from "../factures/ClientSelector";

interface FilterFormProps {
  statusFilter: string | null;
  setStatusFilter: (value: string | null) => void;
  clientFilter: string | null;
  setClientFilter: (value: string | null) => void;
  dateFilter: Date | null;
  setDateFilter: (value: Date | null) => void;
  clients: Client[];
  onClose: () => void;
  clearFilters: () => void;
}

export function FilterForm({ 
  statusFilter,
  setStatusFilter,
  clientFilter,
  setClientFilter,
  dateFilter,
  setDateFilter,
  clients,
  onClose,
  clearFilters
}: FilterFormProps) {
  const handleApply = () => {
    onClose();
  };
  
  // Fix the type comparison by only checking for null
  const hasActiveFilter = statusFilter !== null;
  
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm mb-1">Statut</Label>
        <StatusSelector
          value={statusFilter || ""}
          onChange={(value) => {
            // Check if the value is the empty option and set to null
            if (value === "empty") {
              setStatusFilter(null);
            } else {
              setStatusFilter(value);
            }
          }}
          includeEmpty
        />
      </div>

      <div>
        <Label className="text-sm mb-1">Client</Label>
        <ClientSelector
          clients={clients}
          value={clientFilter || ""}
          onChange={(value) => setClientFilter(value === "" ? null : value)}
          includeEmpty
        />
      </div>

      <div>
        <Label className="text-sm mb-1">Date</Label>
        <div className="mt-1">
          <Calendar
            mode="single"
            selected={dateFilter || undefined}
            onSelect={setDateFilter}
            locale={fr}
            className="border rounded-md"
          />
        </div>
        {dateFilter && (
          <div className="mt-2 text-sm text-gray-500">
            Date sélectionnée: {format(dateFilter, "dd/MM/yyyy", { locale: fr })}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearFilters}
        >
          Réinitialiser
        </Button>
        <Button 
          size="sm" 
          onClick={handleApply}
          className="bg-[#84A98C] hover:bg-[#6B8E74] text-white"
        >
          Appliquer
        </Button>
      </div>
    </div>
  );
};

export default FilterForm;
