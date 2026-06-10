import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Agence, RegimeFiscal } from "@/types/client";
import {
  computeAgencyImmo,
  buildImmoTaxLabel,
  formatMoney,
  type AgenceSpec,
} from "@/lib/spec/fiscal";

interface AgencesEditorProps {
  agences: Agence[];
  ville: string;        // Hérité de l'adresse client (pour le siège)
  quartier: string;
  regimefiscal: RegimeFiscal;
  // Valeurs « à plat » utilisées pour initialiser le siège si pas encore d'agences
  fallbackCA?: string;
  fallbackLoyerMensuel?: number;
  fallbackValeurBien?: number;
  fallbackStatutImmo?: Agence["statutImmo"];
  onChange: (name: string, value: unknown) => void;
}

const REGIME_MAP: Record<RegimeFiscal, "IGS" | "Reel" | "NonPro" | "OBNL"> = {
  igs: "IGS",
  reel: "Reel",
  non_professionnel: "NonPro",
  obnl: "OBNL",
};

export function AgencesEditor({
  agences,
  ville,
  quartier,
  regimefiscal,
  fallbackCA,
  fallbackLoyerMensuel,
  fallbackValeurBien,
  fallbackStatutImmo,
  onChange,
}: AgencesEditorProps) {
  // Vue affichée : on garantit toujours au moins le siège
  const displayed: Agence[] = useMemo(() => {
    if (agences && agences.length > 0) {
      // Le siège hérite toujours de la ville/quartier de l'adresse client
      const next = [...agences];
      next[0] = {
        ...next[0],
        principale: true,
        ville: ville || next[0].ville || "",
        quartier: quartier || next[0].quartier || "",
        libelle: next[0].libelle || `Siège (${ville || "—"})`,
      };
      return next;
    }
    // Pas encore matérialisé : on synthétise un siège depuis les champs à plat
    return [
      {
        libelle: `Siège (${ville || "—"})`,
        ville: ville || "",
        quartier: quartier || "",
        principale: true,
        chiffreAffaires: parseFloat(fallbackCA || "0") || 0,
        statutImmo: fallbackStatutImmo || "locataire",
        loyerMensuel: fallbackLoyerMensuel || 0,
        valeurBien: fallbackValeurBien || 0,
      },
    ];
  }, [agences, ville, quartier, fallbackCA, fallbackLoyerMensuel, fallbackValeurBien, fallbackStatutImmo]);

  const regimeSpec = REGIME_MAP[regimefiscal];

  const commit = (next: Agence[]) => onChange("agences", next);

  const updateAgence = (idx: number, patch: Partial<Agence>) => {
    const next = displayed.map((a, i) => (i === idx ? { ...a, ...patch } : a));
    commit(next);
  };

  const addAgence = () => {
    const next: Agence[] = [
      ...displayed,
      {
        libelle: "",
        ville: "",
        quartier: "",
        principale: false,
        chiffreAffaires: 0,
        statutImmo: "locataire",
        loyerMensuel: 0,
        valeurBien: 0,
      },
    ];
    commit(next);
  };

  const removeAgence = (idx: number) => {
    if (idx === 0) return; // siège non supprimable
    commit(displayed.filter((_, i) => i !== idx));
  };

  // Cumuls
  const totalCA = displayed.reduce((s, a) => s + (a.chiffreAffaires || 0), 0);
  const immoLines = displayed.map((a) => {
    const r = computeAgencyImmo(a as AgenceSpec, regimeSpec);
    return { agence: a, ...r };
  });
  const totalImmo = immoLines.reduce((s, l) => s + l.psl + l.bail + l.tf, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Agences / Établissements & impôts immobiliers
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={addAgence}>
          <Plus className="h-4 w-4 mr-1" /> Ajouter une agence
        </Button>
      </div>

      {displayed.map((a, idx) => {
        const isSiege = idx === 0;
        const showLoyer = a.statutImmo === "locataire" || a.statutImmo === "les_deux";
        const showValeur = a.statutImmo === "proprietaire" || a.statutImmo === "les_deux";
        const r = computeAgencyImmo(a as AgenceSpec, regimeSpec);
        return (
          <div key={idx} className="border rounded-lg p-3 space-y-3 bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {isSiege ? "Siège (principal)" : `Agence ${idx + 1}`}
              </span>
              {!isSiege && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAgence(idx)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-3">
                <Label>Libellé</Label>
                <Input
                  value={a.libelle}
                  onChange={(e) => updateAgence(idx, { libelle: e.target.value })}
                  placeholder={isSiege ? `Siège (${ville || "Ville"})` : "Ex. Agence Bonanjo"}
                />
              </div>
              <div>
                <Label>Ville</Label>
                <Input
                  value={a.ville}
                  onChange={(e) => updateAgence(idx, { ville: e.target.value })}
                  disabled={isSiege}
                />
              </div>
              <div>
                <Label>Quartier</Label>
                <Input
                  value={a.quartier}
                  onChange={(e) => updateAgence(idx, { quartier: e.target.value })}
                  disabled={isSiege}
                />
              </div>
              <div>
                <Label>Chiffre d'affaires (F CFA)</Label>
                <Input
                  type="number"
                  value={a.chiffreAffaires || ""}
                  onChange={(e) => updateAgence(idx, { chiffreAffaires: Number(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Statut immobilier</Label>
                <Select
                  value={a.statutImmo || ""}
                  onValueChange={(value) =>
                    updateAgence(idx, { statutImmo: value as Agence["statutImmo"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="locataire">Locataire</SelectItem>
                    <SelectItem value="proprietaire">Propriétaire</SelectItem>
                    <SelectItem value="les_deux">Les deux</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {showLoyer && (
                <div>
                  <Label>Loyer mensuel (F CFA)</Label>
                  <Input
                    type="number"
                    value={a.loyerMensuel || ""}
                    onChange={(e) => updateAgence(idx, { loyerMensuel: Number(e.target.value) || 0 })}
                  />
                </div>
              )}
              {showValeur && (
                <div>
                  <Label>Valeur du bien (F CFA)</Label>
                  <Input
                    type="number"
                    value={a.valeurBien || ""}
                    onChange={(e) => updateAgence(idx, { valeurBien: Number(e.target.value) || 0 })}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-2 text-xs">
              {r.psl > 0 && (
                <span className="px-2 py-1 rounded bg-blue-100 text-blue-800">
                  {buildImmoTaxLabel("PSL", a)} : {formatMoney(r.psl)}
                </span>
              )}
              {r.bail > 0 && (
                <span className="px-2 py-1 rounded bg-teal-100 text-teal-800">
                  {buildImmoTaxLabel("Bail", a)} : {formatMoney(r.bail)}
                </span>
              )}
              {r.tf > 0 && (
                <span className="px-2 py-1 rounded bg-orange-100 text-orange-800">
                  {buildImmoTaxLabel("TPF", a)} : {formatMoney(r.tf)}
                </span>
              )}
            </div>
          </div>
        );
      })}

      <div className="flex flex-wrap gap-4 text-sm text-gray-700 border-t pt-3">
        <span>
          <strong>CA cumulé :</strong> {formatMoney(totalCA)}
        </span>
        <span>
          <strong>Total impôts immobiliers :</strong> {formatMoney(totalImmo)}
        </span>
      </div>
    </div>
  );
}
