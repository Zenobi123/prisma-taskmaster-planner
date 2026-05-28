import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Prestation } from "@/types/facture";
import { Trash } from "lucide-react";
import type { PrestationDef } from "@/lib/spec/facturePrestations";

interface PrestationFieldsProps {
  prestations: Prestation[];
  onPrestationsChange: (prestations: Prestation[]) => void;
  // Désignations prédéfinies fidèles à la référence (selon le client / régime)
  impotsOptions?: PrestationDef[];
  honorairesOptions?: PrestationDef[];
}

const PrestationFields = ({
  prestations,
  onPrestationsChange,
  impotsOptions = [],
  honorairesOptions = [],
}: PrestationFieldsProps) => {
  const updatePrestation = (index: number, field: keyof Prestation, value) => {
    const updatedPrestations = [...prestations];
    const p = { ...updatedPrestations[index] };

    if (field === 'description') {
      p.description = value;
    } else if (field === 'type') {
      p.type = value as "impot" | "honoraire";
    } else if (field === 'quantite') {
      p.quantite = Math.max(1, Number(value) || 1);
    } else if (field === 'prix_unitaire') {
      p.prix_unitaire = Math.max(0, Number(value) || 0);
    }

    p.montant = p.quantite * p.prix_unitaire;

    updatedPrestations[index] = p;
    onPrestationsChange(updatedPrestations);
  };

  // Sélection d'une désignation prédéfinie : renseigne le libellé et le prix.
  const selectPredefined = (index: number, designation: string) => {
    const p = prestations[index];
    const options = p.type === 'impot' ? impotsOptions : honorairesOptions;
    const found = options.find((o) => o.designation === designation);
    if (!found) return;
    const updated = [...prestations];
    const next = { ...updated[index], description: found.designation };
    if (found.montant > 0) {
      next.prix_unitaire = found.montant;
    }
    next.montant = next.quantite * next.prix_unitaire;
    updated[index] = next;
    onPrestationsChange(updated);
  };

  const removePrestation = (index: number) => {
    const updatedPrestations = prestations.filter((_, i) => i !== index);
    onPrestationsChange(updatedPrestations);
  };

  if (prestations.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-4 border rounded-md">
        Aucune prestation ajoutée. Utilisez les boutons ci-dessus ou ajoutez manuellement.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {prestations.map((prestation, index) => {
        const options = prestation.type === 'impot' ? impotsOptions : honorairesOptions;
        const selectValue = options.some((o) => o.designation === prestation.description)
          ? prestation.description
          : '';
        return (
          <div
            key={index}
            className="p-3 border rounded-md bg-gray-50 space-y-2"
          >
            {options.length > 0 && (
              <div className="space-y-1">
                <Label className="text-xs">Désignation prédéfinie</Label>
                <Select value={selectValue} onValueChange={(val) => selectPredefined(index, val)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Choisir une désignation prédéfinie (ou saisie libre ci-dessous)" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((o) => (
                      <SelectItem key={o.designation} value={o.designation}>
                        {o.designation}
                        {o.montant > 0 ? ` — ${o.montant.toLocaleString('fr-FR')} F CFA` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-12 md:col-span-4 space-y-1">
                <Label className="text-xs">Description</Label>
                <Input
                  placeholder="Description (saisie libre)"
                  className="text-xs h-8"
                  value={prestation.description}
                  onChange={(e) => updatePrestation(index, "description", e.target.value)}
                />
              </div>

              <div className="col-span-6 md:col-span-2 space-y-1">
                <Label className="text-xs">Type</Label>
                <Select
                  value={prestation.type}
                  onValueChange={(val) => updatePrestation(index, "type", val)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="impot">Impôt</SelectItem>
                    <SelectItem value="honoraire">Honoraire</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-3 md:col-span-1 space-y-1">
                <Label className="text-xs">Qté</Label>
                <Input
                  type="number"
                  min={1}
                  className="text-xs h-8"
                  value={prestation.quantite}
                  onChange={(e) => updatePrestation(index, "quantite", e.target.value)}
                />
              </div>

              <div className="col-span-3 md:col-span-2 space-y-1">
                <Label className="text-xs">Prix unitaire</Label>
                <Input
                  type="number"
                  min={0}
                  className="text-xs h-8"
                  value={prestation.prix_unitaire}
                  onChange={(e) => updatePrestation(index, "prix_unitaire", e.target.value)}
                />
              </div>

              <div className="col-span-4 md:col-span-2 space-y-1">
                <Label className="text-xs">Montant</Label>
                <div className="h-8 flex items-center px-3 bg-white border rounded-md text-xs font-medium">
                  {(prestation.quantite * prestation.prix_unitaire).toLocaleString('fr-FR')} F CFA
                </div>
              </div>

              <div className="col-span-2 md:col-span-1 flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePrestation(index)}
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PrestationFields;
