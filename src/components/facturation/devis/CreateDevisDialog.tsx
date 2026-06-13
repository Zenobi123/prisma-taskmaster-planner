
import { useState, useEffect, useMemo } from "react";
import { DevisFormData, DevisPrestation } from "@/types/devis";
import { Client } from "@/types/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";
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
import { toast } from "sonner";
import { adaptClient, getMissingClientFields, type ExistingClientLike } from "@/lib/spec/fiscal";
import {
  getImpotsForSelect,
  getHonorairesForClient,
  getQuickImpotButtons,
  type QuickImpotButton,
  type PrestationDef,
} from "@/lib/spec/facturePrestations";
import { toSpecPrestation, toFormPrestation } from "@/lib/spec/prestationBridge";

interface CreateDevisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Client[];
  onSubmit: (data: DevisFormData) => void;
  isSubmitting?: boolean;
}

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

  const clientSpec = useMemo(() => {
    const c = clients.find((cl) => cl.id === clientId);
    return c ? adaptClient(c as ExistingClientLike) : null;
  }, [clients, clientId]);

  // Référence : avertissement non bloquant dès la sélection du client si sa
  // fiche est incomplète (le blocage intervient à l'émission du devis).
  const handleClientChange = (id: string) => {
    setClientId(id);
    const c = clients.find((cl) => cl.id === id);
    if (c) {
      const manquants = getMissingClientFields(adaptClient(c as ExistingClientLike));
      if (manquants.length > 0) {
        toast.warning(`Fiche client incomplète ! Champs manquants : ${manquants.join(', ')}`);
      }
    }
  };
  const impotsOptions = useMemo(() => getImpotsForSelect(clientSpec), [clientSpec]);
  const honorairesOptions = useMemo(() => getHonorairesForClient(clientSpec), [clientSpec]);
  const impotButtons = useMemo(
    () => getQuickImpotButtons(clientSpec),
    [clientSpec],
  );

  const applyImpotButton = (btn: QuickImpotButton) => {
    if (!clientSpec) return;
    const next = btn.apply(prestations.map(toSpecPrestation), clientSpec);
    setPrestations(next.map(toFormPrestation));
  };

  const addHonoraire = (def: PrestationDef) => {
    setPrestations((prev) => {
      if (prev.some((p) => p.description === def.designation)) return prev;
      return [
        ...prev,
        {
          description: def.designation,
          type: "honoraire",
          quantite: 1,
          prix_unitaire: def.montant,
          montant: def.montant,
        },
      ];
    });
  };

  const selectPredefined = (index: number, designation: string) => {
    const p = prestations[index];
    const options = p.type === "impot" ? impotsOptions : honorairesOptions;
    const found = options.find((o) => o.designation === designation);
    if (!found) return;
    setPrestations((prev) => {
      const updated = [...prev];
      const next = { ...updated[index], description: found.designation };
      if (found.montant > 0) next.prix_unitaire = found.montant;
      next.montant = next.quantite * next.prix_unitaire;
      updated[index] = next;
      return updated;
    });
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
    // Référence : l'émission est bloquée tant que la fiche client est incomplète.
    const champsManquants = getMissingClientFields(clientSpec);
    if (clientSpec && champsManquants.length > 0) {
      toast.error(`Impossible d'émettre le devis. Fiche client incomplète : ${champsManquants.join(', ')}`);
      return;
    }

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
      <DialogContent className="max-w-[95vw] sm:max-w-4xl overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-border/50">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Nouveau devis
          </DialogTitle>
          <DialogDescription>
            Créez un nouveau devis pour un client avec les prestations associées.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Client & dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select value={clientId} onValueChange={handleClientChange}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Sélectionner un client" />
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
              <Label htmlFor="date_validite">Date de validité</Label>
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

          {/* Ajout rapide — Impôts du client & CGA (montants réels calculés) */}
          <div className="space-y-2">
            <Label>Impôts du client &amp; CGA</Label>
            {clientSpec ? (
              impotButtons.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {impotButtons.map((btn) => (
                    <Button
                      key={btn.key}
                      type="button"
                      size="sm"
                      variant="outline"
                      className={btn.color}
                      onClick={() => applyImpotButton(btn)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {btn.label.replace(/^\+\s*/, "")}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">Aucun impôt calculé pour ce client.</p>
              )
            ) : (
              <p className="text-xs text-gray-500">Sélectionnez un client pour proposer ses impôts.</p>
            )}
          </div>

          {/* Ajout rapide — Honoraires selon le régime fiscal */}
          <div className="space-y-2">
            <Label>Honoraires selon le régime{!clientId ? " (IGS par défaut)" : ""}</Label>
            <div className="flex flex-wrap gap-2">
              {honorairesOptions.map((def) => (
                <Button
                  key={def.designation}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  onClick={() => addHonoraire(def)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {def.designation}
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
                Aucune prestation ajoutée. Utilisez les boutons ci-dessus ou ajoutez manuellement.
              </p>
            )}

            {prestations.map((prestation, index) => {
              const options = prestation.type === "impot" ? impotsOptions : honorairesOptions;
              const selectValue = options.some((o) => o.designation === prestation.description)
                ? prestation.description
                : "";
              return (
              <div key={index} className="p-3 border rounded-md bg-gray-50 space-y-2">
                {options.length > 0 && (
                  <div className="space-y-1">
                    <Label className="text-xs">Désignation prédéfinie</Label>
                    <Select value={selectValue} onValueChange={(val) => selectPredefined(index, val)}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Choisir une désignation prédéfinie (ou saisie libre ci-dessous)" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((o) => (
                          <SelectItem key={o.designation} value={o.designation}>
                            {o.designation}
                            {o.montant > 0 ? ` — ${o.montant.toLocaleString("fr-FR")} F CFA` : ""}
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
              </div>
              );
            })}
          </div>

          {/* Totals */}
          {prestations.length > 0 && (
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Impôts :</span>
                <span className="font-medium">{formatMontant(totals.impots)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Honoraires :</span>
                <span className="font-medium">{formatMontant(totals.honoraires)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold border-t pt-2">
                <span>Total Général :</span>
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
                Création...
              </>
            ) : (
              "Créer le devis"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDevisDialog;
