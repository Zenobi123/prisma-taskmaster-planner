
import { useState, useEffect, useMemo } from "react";
import { DevisFormData, DevisPrestation } from "@/types/devis";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { PREDEFINED_PRESTATIONS } from "@/utils/fiscalReferenceData";

interface CreateDevisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Client[];
  onSubmit: (data: DevisFormData) => void;
  isSubmitting?: boolean;
}

const predefinedPrestations = PREDEFINED_PRESTATIONS;

const formatMontant = (montant: number): string => {
  return new Intl.NumberFormat("fr-FR").format(montant) + " F CFA";
};

const getDefaultDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

const getDefaultValidite = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split("T")[0];
};

const CreateDevisDialog = ({
  open,
  onOpenChange,
  clients,
  onSubmit,
  isSubmitting = false,
}: CreateDevisDialogProps) => {
  const [clientId, setClientId] = useState("");
  const [date, setDate] = useState(getDefaultDate());
  const [dateValidite, setDateValidite] = useState(getDefaultValidite());
  const [objet, setObjet] = useState("Devis de prestations comptables");
  const [prestations, setPrestations] = useState<DevisPrestation[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setClientId("");
      setDate(getDefaultDate());
      setDateValidite(getDefaultValidite());
      setObjet("Devis de prestations comptables");
      setPrestations([]);
      setNotes("");
    }
  }, [open]);

  const addPrestation = () => {
    setPrestations((prev) => [
      ...prev,
      { description: "", type: "impot", quantite: 1, prix_unitaire: 0, montant: 0 },
    ]);
  };

  const addPredefinedPrestation = (predefined: { description: string; type: "impot" | "honoraire" }) => {
    setPrestations((prev) => [
      ...prev,
      {
        description: predefined.description,
        type: predefined.type,
        quantite: 1,
        prix_unitaire: 0,
        montant: 0,
      },
    ]);
  };

  const removePrestation = (index: number) => {
    setPrestations((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePrestation = (
    index: number,
    field: keyof DevisPrestation,
    value: string | number
  ) => {
    setPrestations((prev) => {
      const updated = [...prev];
      const item = { ...updated[index] };

      if (field === "description") {
        item.description = value as string;
      } else if (field === "type") {
        item.type = value as "impot" | "honoraire";
      } else if (field === "quantite") {
        item.quantite = Number(value) || 0;
        item.montant = item.quantite * item.prix_unitaire;
      } else if (field === "prix_unitaire") {
        item.prix_unitaire = Number(value) || 0;
        item.montant = item.quantite * item.prix_unitaire;
      }

      updated[index] = item;
      return updated;
    });
  };

  const totals = useMemo(() => {
    const totalImpots = prestations
      .filter((p) => p.type === "impot")
      .reduce((sum, p) => sum + p.quantite * p.prix_unitaire, 0);
    const totalHonoraires = prestations
      .filter((p) => p.type === "honoraire")
      .reduce((sum, p) => sum + p.quantite * p.prix_unitaire, 0);
    return {
      impots: totalImpots,
      honoraires: totalHonoraires,
      total: totalImpots + totalHonoraires,
    };
  }, [prestations]);

  const handleSubmit = () => {
    const formData: DevisFormData = {
      client_id: clientId,
      date,
      date_validite: dateValidite,
      objet,
      status: "brouillon",
      prestations: prestations.map((p) => ({
        ...p,
        montant: p.quantite * p.prix_unitaire,
      })),
      notes: notes || undefined,
    };
    onSubmit(formData);
  };

  const isValid = clientId && objet && prestations.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouveau devis</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Client & dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_validite">Date de validit\u00e9</Label>
              <Input
                id="date_validite"
                type="date"
                value={dateValidite}
                onChange={(e) => setDateValidite(e.target.value)}
              />
            </div>
          </div>

          {/* Objet */}
          <div className="space-y-2">
            <Label htmlFor="objet">Objet</Label>
            <Input
              id="objet"
              value={objet}
              onChange={(e) => setObjet(e.target.value)}
              placeholder="Objet du devis"
            />
          </div>

          {/* Predefined prestations quick-add */}
          <div className="space-y-2">
            <Label>Ajout rapide de prestations</Label>
            <div className="flex flex-wrap gap-2">
              {predefinedPrestations.map((p) => (
                <Button
                  key={p.description}
                  type="button"
                  variant="outline"
                  size="sm"
                  className={
                    p.type === "impot"
                      ? "border-orange-300 text-orange-700 hover:bg-orange-50"
                      : "border-blue-300 text-blue-700 hover:bg-blue-50"
                  }
                  onClick={() => addPredefinedPrestation(p)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {p.description}
                </Button>
              ))}
            </div>
          </div>

          {/* Prestations list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Prestations</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPrestation}
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter une prestation
              </Button>
            </div>

            {prestations.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4 border rounded-md">
                Aucune prestation ajout\u00e9e. Utilisez les boutons ci-dessus ou ajoutez manuellement.
              </p>
            )}

            {prestations.map((prestation, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-2 items-end p-3 border rounded-md bg-gray-50"
              >
                <div className="col-span-12 md:col-span-4 space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Input
                    value={prestation.description}
                    onChange={(e) =>
                      updatePrestation(index, "description", e.target.value)
                    }
                    placeholder="Description"
                  />
                </div>

                <div className="col-span-6 md:col-span-2 space-y-1">
                  <Label className="text-xs">Type</Label>
                  <Select
                    value={prestation.type}
                    onValueChange={(val) => updatePrestation(index, "type", val)}
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

                <div className="col-span-3 md:col-span-1 space-y-1">
                  <Label className="text-xs">Qt\u00e9</Label>
                  <Input
                    type="number"
                    min={1}
                    value={prestation.quantite}
                    onChange={(e) =>
                      updatePrestation(index, "quantite", e.target.value)
                    }
                  />
                </div>

                <div className="col-span-3 md:col-span-2 space-y-1">
                  <Label className="text-xs">Prix unitaire</Label>
                  <Input
                    type="number"
                    min={0}
                    value={prestation.prix_unitaire}
                    onChange={(e) =>
                      updatePrestation(index, "prix_unitaire", e.target.value)
                    }
                  />
                </div>

                <div className="col-span-4 md:col-span-2 space-y-1">
                  <Label className="text-xs">Montant</Label>
                  <div className="h-10 flex items-center px-3 bg-white border rounded-md text-sm font-medium">
                    {formatMontant(prestation.quantite * prestation.prix_unitaire)}
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1 flex justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePrestation(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          {prestations.length > 0 && (
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
              "Cr\u00e9er le devis"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDevisDialog;
