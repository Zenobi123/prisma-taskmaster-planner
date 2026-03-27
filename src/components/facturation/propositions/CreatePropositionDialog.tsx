
import { useState, useEffect, useMemo } from "react";
import { PropositionFormData, PropositionLigne } from "@/types/proposition";
import { Client } from "@/types/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Loader2 } from "lucide-react";

interface CreatePropositionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Client[];
  onSubmit: (data: PropositionFormData) => void;
  isSubmitting?: boolean;
}

const predefinedLignes: { designation: string; type: "impot" | "honoraire" }[] = [
  // Impots
  { designation: "IGS", type: "impot" },
  { designation: "Patente", type: "impot" },
  { designation: "TDL", type: "impot" },
  { designation: "PSL", type: "impot" },
  { designation: "Bail Commercial", type: "impot" },
  { designation: "Taxe Fonci\u00e8re", type: "impot" },
  { designation: "DSF", type: "impot" },
  { designation: "DARP", type: "impot" },
  // Honoraires
  { designation: "Tenue de comptabilit\u00e9", type: "honoraire" },
  { designation: "Conseil fiscal", type: "honoraire" },
  { designation: "\u00c9tats financiers", type: "honoraire" },
  { designation: "Assistance contr\u00f4le", type: "honoraire" },
];

const formatMontant = (montant: number): string => {
  return new Intl.NumberFormat("fr-FR").format(montant) + " F CFA";
};

const getDefaultDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

const CreatePropositionDialog = ({
  open,
  onOpenChange,
  clients,
  onSubmit,
  isSubmitting = false,
}: CreatePropositionDialogProps) => {
  const [clientId, setClientId] = useState("");
  const [dateManuelle, setDateManuelle] = useState(false);
  const [date, setDate] = useState(getDefaultDate());
  const [lignes, setLignes] = useState<PropositionLigne[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setClientId("");
      setDateManuelle(false);
      setDate(getDefaultDate());
      setLignes([]);
      setNotes("");
    }
  }, [open]);

  const addLigne = () => {
    setLignes((prev) => [
      ...prev,
      { type: "impot", designation: "", base_annuelle: 0, fraction: 100, montant: 0 },
    ]);
  };

  const addPredefinedLigne = (predefined: { designation: string; type: "impot" | "honoraire" }) => {
    setLignes((prev) => [
      ...prev,
      {
        type: predefined.type,
        designation: predefined.designation,
        base_annuelle: 0,
        fraction: 100,
        montant: 0,
      },
    ]);
  };

  const removeLigne = (index: number) => {
    setLignes((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLigne = (
    index: number,
    field: keyof PropositionLigne,
    value: string | number
  ) => {
    setLignes((prev) => {
      const updated = [...prev];
      const item = { ...updated[index] };

      if (field === "designation") {
        item.designation = value as string;
      } else if (field === "type") {
        item.type = value as "impot" | "honoraire";
      } else if (field === "base_annuelle") {
        item.base_annuelle = Number(value) || 0;
        item.montant = Math.round(item.base_annuelle * item.fraction / 100);
      } else if (field === "fraction") {
        item.fraction = Math.min(100, Math.max(0, Number(value) || 0));
        item.montant = Math.round(item.base_annuelle * item.fraction / 100);
      }

      updated[index] = item;
      return updated;
    });
  };

  const totals = useMemo(() => {
    const totalImpots = lignes
      .filter((l) => l.type === "impot")
      .reduce((sum, l) => sum + Math.round(l.base_annuelle * l.fraction / 100), 0);
    const totalHonoraires = lignes
      .filter((l) => l.type === "honoraire")
      .reduce((sum, l) => sum + Math.round(l.base_annuelle * l.fraction / 100), 0);
    return {
      impots: totalImpots,
      honoraires: totalHonoraires,
      total: totalImpots + totalHonoraires,
    };
  }, [lignes]);

  const handleSubmit = () => {
    const formData: PropositionFormData = {
      client_id: clientId,
      date: dateManuelle ? date : getDefaultDate(),
      date_manuelle: dateManuelle,
      lignes: lignes.map((l) => ({
        ...l,
        montant: Math.round(l.base_annuelle * l.fraction / 100),
      })),
      notes: notes || undefined,
      status: "brouillon",
    };
    onSubmit(formData);
  };

  const isValid = clientId && lignes.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle proposition de paiement</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Client & date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="S\u00e9lectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="date_manuelle"
                  checked={dateManuelle}
                  onCheckedChange={(checked) => setDateManuelle(checked === true)}
                />
                <Label htmlFor="date_manuelle" className="cursor-pointer">
                  Date manuelle
                </Label>
              </div>
              {dateManuelle ? (
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              ) : (
                <p className="text-sm text-gray-500 h-10 flex items-center">
                  Date automatique : {new Date().toLocaleDateString("fr-FR")}
                </p>
              )}
            </div>
          </div>

          {/* Source document import */}
          <div className="space-y-2">
            <Label>Import depuis un document source</Label>
            <p className="text-sm text-gray-400 italic border rounded-md p-3 bg-gray-50">
              Import depuis devis/facture disponible prochainement
            </p>
          </div>

          {/* Quick-add buttons */}
          <div className="space-y-2">
            <Label>Ajout rapide de lignes</Label>
            <div className="flex flex-wrap gap-2">
              {predefinedLignes.map((p) => (
                <Button
                  key={p.designation}
                  type="button"
                  variant="outline"
                  size="sm"
                  className={
                    p.type === "impot"
                      ? "border-orange-300 text-orange-700 hover:bg-orange-50"
                      : "border-blue-300 text-blue-700 hover:bg-blue-50"
                  }
                  onClick={() => addPredefinedLigne(p)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {p.designation}
                </Button>
              ))}
            </div>
          </div>

          {/* Lignes de paiement */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Lignes de paiement</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLigne}
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter une ligne
              </Button>
            </div>

            {lignes.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4 border rounded-md">
                Aucune ligne ajout\u00e9e. Utilisez les boutons ci-dessus ou ajoutez manuellement.
              </p>
            )}

            {lignes.map((ligne, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-2 items-end p-3 border rounded-md bg-gray-50"
              >
                <div className="col-span-6 md:col-span-2 space-y-1">
                  <Label className="text-xs">Type</Label>
                  <Select
                    value={ligne.type}
                    onValueChange={(val) => updateLigne(index, "type", val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="impot">Imp\u00f4t</SelectItem>
                      <SelectItem value="honoraire">Honoraire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-6 md:col-span-3 space-y-1">
                  <Label className="text-xs">D\u00e9signation</Label>
                  <Input
                    value={ligne.designation}
                    onChange={(e) =>
                      updateLigne(index, "designation", e.target.value)
                    }
                    placeholder="D\u00e9signation"
                  />
                </div>

                <div className="col-span-4 md:col-span-2 space-y-1">
                  <Label className="text-xs">Base annuelle (F CFA)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={ligne.base_annuelle}
                    onChange={(e) =>
                      updateLigne(index, "base_annuelle", e.target.value)
                    }
                  />
                </div>

                <div className="col-span-3 md:col-span-2 space-y-1">
                  <Label className="text-xs">Fraction (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={ligne.fraction}
                    onChange={(e) =>
                      updateLigne(index, "fraction", e.target.value)
                    }
                  />
                </div>

                <div className="col-span-3 md:col-span-2 space-y-1">
                  <Label className="text-xs">Montant</Label>
                  <div className="h-10 flex items-center px-3 bg-white border rounded-md text-sm font-medium">
                    {formatMontant(Math.round(ligne.base_annuelle * ligne.fraction / 100))}
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1 flex justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLigne(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          {lignes.length > 0 && (
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Imp\u00f4ts :</span>
                <span className="font-medium">{formatMontant(totals.impots)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Honoraires :</span>
                <span className="font-medium">{formatMontant(totals.honoraires)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold border-t pt-2">
                <span>Total G\u00e9n\u00e9ral :</span>
                <span>{formatMontant(totals.total)}</span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes ou remarques..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="bg-[#84A98C] hover:bg-[#6B8F73] text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Cr\u00e9ation...
              </>
            ) : (
              "Cr\u00e9er la proposition"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePropositionDialog;
