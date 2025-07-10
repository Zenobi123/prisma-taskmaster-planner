
import { Input } from "@/components/ui/input";
import { ClientType, RegimeFiscal } from "@/types/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Client } from "@/types/client";
import { ClientExportButton } from "./ClientExportButton";

interface ClientFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: ClientType | "all";
  onTypeChange: (value: ClientType | "all") => void;
  selectedSecteur: string;
  onSecteurChange: (value: string) => void;
  selectedRegimeFiscal: RegimeFiscal | "all";
  onRegimeFiscalChange: (value: RegimeFiscal | "all") => void;
  showArchived: boolean;
  onShowArchivedChange: (value: boolean) => void;
  clients?: Client[];
  isMobile?: boolean;
}

export function ClientFilters({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedSecteur,
  onSecteurChange,
  selectedRegimeFiscal,
  onRegimeFiscalChange,
  showArchived,
  onShowArchivedChange,
  clients = [],
  isMobile,
}: ClientFiltersProps) {
  const getRegimeFiscalLabel = (regime: RegimeFiscal) => {
    switch (regime) {
      case 'reel':
        return 'Réel';
      case 'igs':
        return 'IGS';
      case 'non_professionnel':
        return 'Non Professionnel';
      default:
        return regime;
    }
  };

  return (
    <div className="space-y-4 mb-6">
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row flex-wrap'} gap-4`}>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Type de client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="physique">Personne physique</SelectItem>
            <SelectItem value="morale">Personne morale</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSecteur} onValueChange={onSecteurChange}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Secteur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les secteurs</SelectItem>
            <SelectItem value="commerce">Commerce</SelectItem>
            <SelectItem value="service">Service</SelectItem>
            <SelectItem value="industrie">Industrie</SelectItem>
            <SelectItem value="agriculture">Agriculture</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedRegimeFiscal} onValueChange={onRegimeFiscalChange}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Régime Fiscal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les régimes</SelectItem>
            <SelectItem value="reel">Réel</SelectItem>
            <SelectItem value="igs">IGS</SelectItem>
            <SelectItem value="non_professionnel">Non Professionnel</SelectItem>
          </SelectContent>
        </Select>
        
        {clients && clients.length > 0 && 
          <ClientExportButton clients={clients} isMobile={isMobile} />
        }
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="show-archived" 
          checked={showArchived} 
          onCheckedChange={(checked) => onShowArchivedChange(checked as boolean)}
        />
        <Label htmlFor="show-archived">Afficher les clients archivés</Label>
      </div>
    </div>
  );
}
