
import { ChevronsUpDown, Plus } from "lucide-react";
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
  openPrestationSelector: boolean;
  setOpenPrestationSelector: (open: boolean) => void;
  onSelectPrestation: (prestation: { description: string; montant: number }) => void;
}

export const PrestationSelector = ({
  openPrestationSelector,
  setOpenPrestationSelector,
  onSelectPrestation,
}: PrestationSelectorProps) => {
  console.log("PrestationSelector rendered, open state:", openPrestationSelector);
  
  return (
    <Popover open={openPrestationSelector} onOpenChange={setOpenPrestationSelector} modal={true}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-2 gap-1"
          onClick={() => {
            console.log("PopoverTrigger clicked, current state:", openPrestationSelector);
            setOpenPrestationSelector(true);
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="sr-md:inline-block">Ajouter un élément prédéfini</span>
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[400px] p-0 z-[1000]" 
        align="start"
        sideOffset={5}
        forceMount
      >
        <Command className="rounded-lg border border-gray-200 shadow-lg bg-white">
          <CommandGroup heading="Prestations prédéfinies">
            {PREDEFINED_PRESTATIONS.map((item) => (
              <CommandItem 
                key={item.id}
                onSelect={() => {
                  console.log("Item selected:", item);
                  onSelectPrestation(item);
                  setOpenPrestationSelector(false);
                }}
                className="flex justify-between cursor-pointer hover:bg-accent hover:text-accent-foreground py-3"
              >
                <span>{item.description}</span>
                <span className="text-muted-foreground">{item.montant.toLocaleString()} FCFA</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
