
import { useState } from "react";
import { Plus, Trash2, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Prestation } from "@/types/facture";

interface NewFactureDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateInvoice: (formData: any) => void;
}

// Prestations prédéfinies basées sur l'image fournie
const PREDEFINED_PRESTATIONS = [
  { id: "irpp2024", description: "AVANCE POUR PAIEMENT SOLDE IRPP 2024", montant: 11000 },
  { id: "bail2025", description: "AVANCE POUR PAIEMENT BAIL 2025", montant: 60000 },
  { id: "loyer2025", description: "AVANCE POUR PAIEMENT PRÉCOMPTE LOYER 2025", montant: 90000 },
  { id: "patente2025", description: "AVANCE POUR PAIEMENT PATENTE 2025", montant: 141500 },
  { id: "revenus2024", description: "DÉCLARATION ANNUELLE DES REVENUS - 2024", montant: 10000 },
  { id: "fiscal2025", description: "RENOUVELLEMENT DU DOSSIER FISCAL 2025", montant: 15000 },
  { id: "dsf2024", description: "MONTAGE ET MISE EN LIGNE DE LA DSF 2024", montant: 75000 },
  { id: "cime2025", description: "FORFAIT SUIVI-GESTION FISCAL CIME EXERCICE 2025", montant: 60000 },
];

export const NewFactureDialog = ({
  isOpen,
  onOpenChange,
  onCreateInvoice,
}: NewFactureDialogProps) => {
  const [clientId, setClientId] = useState("");
  const [dateEmission, setDateEmission] = useState("");
  const [dateEcheance, setDateEcheance] = useState("");
  const [prestations, setPrestations] = useState<Prestation[]>([
    { description: "", montant: 0 }
  ]);
  const [notes, setNotes] = useState("");
  const [openPrestationSelector, setOpenPrestationSelector] = useState(false);

  const handleSubmit = () => {
    const formData = {
      clientId,
      dateEmission,
      dateEcheance,
      prestations: prestations.filter(p => p.description.trim() !== ""),
      notes,
    };
    onCreateInvoice(formData);
    resetForm();
  };

  const resetForm = () => {
    setClientId("");
    setDateEmission("");
    setDateEcheance("");
    setPrestations([{ description: "", montant: 0 }]);
    setNotes("");
  };

  const handleAddPrestation = () => {
    setPrestations([...prestations, { description: "", montant: 0 }]);
  };

  const handleRemovePrestation = (index: number) => {
    if (prestations.length > 1) {
      setPrestations(prestations.filter((_, i) => i !== index));
    }
  };

  const updatePrestation = (index: number, field: keyof Prestation, value: string | number) => {
    const updatedPrestations = [...prestations];
    updatedPrestations[index] = {
      ...updatedPrestations[index],
      [field]: field === 'montant' ? Number(value) : value
    };
    setPrestations(updatedPrestations);
  };

  const addPredefinedPrestation = (prestation: { description: string, montant: number }) => {
    const updatedPrestations = [...prestations];
    // Remplacer la première prestation vide s'il y en a une
    const emptyIndex = updatedPrestations.findIndex(p => p.description === "" && p.montant === 0);
    
    if (emptyIndex !== -1) {
      updatedPrestations[emptyIndex] = {
        description: prestation.description,
        montant: prestation.montant
      };
    } else {
      updatedPrestations.push({
        description: prestation.description,
        montant: prestation.montant
      });
    }
    
    setPrestations(updatedPrestations);
    setOpenPrestationSelector(false);
  };

  const calculateTotal = () => {
    return prestations.reduce((sum, p) => sum + p.montant, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle facture</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer une nouvelle facture client.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="client">Client</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client-001">SARL TechPro</SelectItem>
                <SelectItem value="client-002">SAS WebDev</SelectItem>
                <SelectItem value="client-003">EURL ConseilPlus</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date d'émission</Label>
              <Input 
                id="date" 
                type="date" 
                value={dateEmission}
                onChange={(e) => setDateEmission(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="echeance">Date d'échéance</Label>
              <Input 
                id="echeance" 
                type="date"
                value={dateEcheance}
                onChange={(e) => setDateEcheance(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label>Prestations</Label>
              <Popover open={openPrestationSelector} onOpenChange={setOpenPrestationSelector}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2 gap-1">
                    <Plus className="h-3.5 w-3.5" />
                    <span className="sr-md:inline-block">Ajouter un élément prédéfini</span>
                    <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="end">
                  <Command>
                    <CommandGroup heading="Prestations préefinies">
                      {PREDEFINED_PRESTATIONS.map((item) => (
                        <CommandItem 
                          key={item.id}
                          onSelect={() => addPredefinedPrestation(item)}
                          className="flex justify-between cursor-pointer"
                        >
                          <span>{item.description}</span>
                          <span className="text-muted-foreground">{item.montant.toLocaleString()} FCFA</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="border rounded-md p-3">
              {prestations.map((prestation, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                  <div className="col-span-8">
                    <Input 
                      placeholder="Description" 
                      value={prestation.description}
                      onChange={(e) => updatePrestation(index, 'description', e.target.value)}
                    />
                  </div>
                  <div className="col-span-3">
                    <Input 
                      placeholder="Montant (FCFA)" 
                      type="number" 
                      value={prestation.montant || ''}
                      onChange={(e) => updatePrestation(index, 'montant', e.target.value)}
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemovePrestation(index)}
                      disabled={prestations.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center mt-4">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={handleAddPrestation}
                >
                  <Plus className="w-3 h-3 mr-1" /> Ajouter une prestation
                </Button>
              </div>
              <div className="flex justify-end mt-4 text-sm font-medium">
                Total: {calculateTotal().toLocaleString()} FCFA
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Notes ou informations supplémentaires..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Créer la facture
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
