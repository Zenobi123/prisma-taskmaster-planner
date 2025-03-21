import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import ModePaiementSelector from "../factures/ModePaiementSelector";
import { useState } from "react";

interface AdvancedFilterFormProps {
  // Période
  periodeDebut: Date | null;
  periodeFin: Date | null;
  setPeriodeDebut: (value: Date | null) => void;
  setPeriodeFin: (value: Date | null) => void;
  
  // Montant
  montantMin: number | null;
  montantMax: number | null;
  setMontantMin: (value: number | null) => void;
  setMontantMax: (value: number | null) => void;
  
  // Mode de paiement
  modePaiement: string | null;
  setModePaiement: (value: string | null) => void;
  
  // Actions
  onClose: () => void;
  clearFilters: () => void;
}

const AdvancedFilterForm = ({
  periodeDebut,
  periodeFin,
  setPeriodeDebut,
  setPeriodeFin,
  montantMin,
  montantMax,
  setMontantMin,
  setMontantMax,
  modePaiement,
  setModePaiement,
  onClose,
  clearFilters
}: AdvancedFilterFormProps) => {
  const [tempMontantMin, setTempMontantMin] = useState<string>(montantMin?.toString() || "");
  const [tempMontantMax, setTempMontantMax] = useState<string>(montantMax?.toString() || "");

  const handleApply = () => {
    // Convertir les montants
    setMontantMin(tempMontantMin ? Number(tempMontantMin) : null);
    setMontantMax(tempMontantMax ? Number(tempMontantMax) : null);
    onClose();
  };

  const handleResetFilters = () => {
    setTempMontantMin("");
    setTempMontantMax("");
    clearFilters();
  };

  return (
    
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Période</Label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <Label className="text-xs text-gray-500 mb-1">Du</Label>
            <Calendar
              mode="single"
              selected={periodeDebut || undefined}
              onSelect={setPeriodeDebut}
              locale={fr}
              className="border rounded-md"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1">Au</Label>
            <Calendar
              mode="single"
              selected={periodeFin || undefined}
              onSelect={setPeriodeFin}
              locale={fr}
              className="border rounded-md"
            />
          </div>
        </div>
        {(periodeDebut || periodeFin) && (
          <div className="mt-2 text-sm text-gray-500">
            {periodeDebut && (
              <span>
                Du {format(periodeDebut, "dd/MM/yyyy", { locale: fr })}
              </span>
            )}
            {periodeDebut && periodeFin && " "}
            {periodeFin && (
              <span>
                au {format(periodeFin, "dd/MM/yyyy", { locale: fr })}
              </span>
            )}
          </div>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium">Montant</Label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <Label className="text-xs text-gray-500 mb-1">Minimum</Label>
            <Input
              type="number"
              placeholder="Montant min"
              value={tempMontantMin}
              onChange={(e) => setTempMontantMin(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1">Maximum</Label>
            <Input
              type="number"
              placeholder="Montant max"
              value={tempMontantMax}
              onChange={(e) => setTempMontantMax(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Mode de paiement</Label>
        <div className="mt-1">
          <ModePaiementSelector
            value={modePaiement || ""}
            onChange={(value) => setModePaiement(value === "" ? null : value)}
            includeEmpty
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleResetFilters}
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

export default AdvancedFilterForm;
