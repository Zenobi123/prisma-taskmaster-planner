
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Prestation } from "@/types/facture";

// Prestations prédéfinies
export const PREDEFINED_PRESTATIONS = [
  { id: "irpp2024", description: "AVANCE POUR PAIEMENT SOLDE IRPP 2024", montant: 11000 },
  { id: "bail2025", description: "AVANCE POUR PAIEMENT BAIL 2025", montant: 60000 },
  { id: "loyer2025", description: "AVANCE POUR PAIEMENT PRÉCOMPTE LOYER 2025", montant: 90000 },
  { id: "patente2025", description: "AVANCE POUR PAIEMENT PATENTE 2025", montant: 141500 },
  { id: "revenus2024", description: "DÉCLARATION ANNUELLE DES REVENUS - 2024", montant: 10000 },
  { id: "fiscal2025", description: "RENOUVELLEMENT DU DOSSIER FISCAL 2025", montant: 15000 },
  { id: "dsf2024", description: "MONTAGE ET MISE EN LIGNE DE LA DSF 2024", montant: 75000 },
  { id: "cime2025", description: "FORFAIT SUIVI-GESTION FISCAL CIME EXERCICE 2025", montant: 60000 },
];

interface PrestationSelectorProps {
  onSelectPrestation: (prestation: { description: string; montant: number }) => void;
  descriptionValue: string;
}

export const PrestationSelector = ({
  onSelectPrestation,
  descriptionValue
}: PrestationSelectorProps) => {
  const handleItemSelect = (item: typeof PREDEFINED_PRESTATIONS[0]) => {
    console.log("Item selected:", item);
    onSelectPrestation(item);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative flex items-center w-full">
          <input
            placeholder="Description de la prestation"
            value={descriptionValue}
            readOnly
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm cursor-pointer"
          />
          <ChevronsUpDown className="absolute right-3 h-4 w-4 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[400px] p-0" 
        align="start"
        alignOffset={0}
        sideOffset={5}
        forceMount
      >
        <Command className="rounded-lg border shadow-md">
          <CommandGroup heading="Prestations prédéfinies">
            {PREDEFINED_PRESTATIONS.map((item) => (
              <CommandItem 
                key={item.id}
                onSelect={() => handleItemSelect(item)}
                className="flex justify-between cursor-pointer py-3 px-2 hover:bg-slate-100"
              >
                <span className="font-medium">{item.description}</span>
                <span className="text-muted-foreground font-semibold">{item.montant.toLocaleString()} FCFA</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
