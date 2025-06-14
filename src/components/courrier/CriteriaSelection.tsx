
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Target, Zap } from "lucide-react";

export interface Criteria {
  type?: string;
  regimeFiscal?: string;
  secteurActivite?: string;
  centreRattachement?: string;
  statut?: string;
}

interface CriteriaSelectionProps {
  selectedCriteria: Criteria;
  onCriteriaChange: (criteria: Criteria) => void;
  generationType?: "individuel" | "masse";
  onGenerationTypeChange?: (type: "individuel" | "masse") => void;
}

const CriteriaSelection = ({
  selectedCriteria,
  onCriteriaChange,
  generationType = "individuel",
  onGenerationTypeChange
}: CriteriaSelectionProps) => {
  const handleCriteriaChange = (field: string, value: string) => {
    onCriteriaChange({
      ...selectedCriteria,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      {/* Type de génération */}
      {onGenerationTypeChange && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Type de génération
          </Label>
          <RadioGroup value={generationType} onValueChange={onGenerationTypeChange}>
            <div className="flex items-center space-x-3 p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="masse" id="masse" />
              <Label htmlFor="masse" className="flex-1 cursor-pointer">
                <div className="font-medium text-gray-900">Publipostage</div>
                <div className="text-sm text-gray-500">Tous les clients correspondant aux critères</div>
              </Label>
              <Zap className="w-4 h-4 text-[#84A98C]" />
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="individuel" id="individuel" />
              <Label htmlFor="individuel" className="flex-1 cursor-pointer">
                <div className="font-medium text-gray-900">Courriers individuels</div>
                <div className="text-sm text-gray-500">Sélection manuelle des clients</div>
              </Label>
              <Target className="w-4 h-4 text-[#84A98C]" />
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Filtres */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium text-gray-700">Type de client</Label>
          <Select
            value={selectedCriteria.type || ""}
            onValueChange={(value) => handleCriteriaChange("type", value)}
          >
            <SelectTrigger className="border-gray-300 focus:border-[#84A98C] focus:ring-[#84A98C]">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="physique">Personne physique</SelectItem>
              <SelectItem value="morale">Personne morale</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="regime" className="text-sm font-medium text-gray-700">Régime fiscal</Label>
          <Select
            value={selectedCriteria.regimeFiscal || ""}
            onValueChange={(value) => handleCriteriaChange("regimeFiscal", value)}
          >
            <SelectTrigger className="border-gray-300 focus:border-[#84A98C] focus:ring-[#84A98C]">
              <SelectValue placeholder="Tous les régimes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reel">Régime réel</SelectItem>
              <SelectItem value="igs">IGS</SelectItem>
              <SelectItem value="non_professionnel">Non professionnel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="secteur" className="text-sm font-medium text-gray-700">Secteur d'activité</Label>
          <Select
            value={selectedCriteria.secteurActivite || ""}
            onValueChange={(value) => handleCriteriaChange("secteurActivite", value)}
          >
            <SelectTrigger className="border-gray-300 focus:border-[#84A98C] focus:ring-[#84A98C]">
              <SelectValue placeholder="Tous les secteurs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="commerce">Commerce</SelectItem>
              <SelectItem value="industrie">Industrie</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="agriculture">Agriculture</SelectItem>
              <SelectItem value="btp">BTP</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="hotellerie">Hôtellerie</SelectItem>
              <SelectItem value="restauration">Restauration</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="centre" className="text-sm font-medium text-gray-700">Centre de rattachement</Label>
          <Select
            value={selectedCriteria.centreRattachement || ""}
            onValueChange={(value) => handleCriteriaChange("centreRattachement", value)}
          >
            <SelectTrigger className="border-gray-300 focus:border-[#84A98C] focus:ring-[#84A98C]">
              <SelectValue placeholder="Tous les centres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Centre des Impôts de Libreville">Centre des Impôts de Libreville</SelectItem>
              <SelectItem value="Centre des Impôts de Port-Gentil">Centre des Impôts de Port-Gentil</SelectItem>
              <SelectItem value="Centre des Impôts de Franceville">Centre des Impôts de Franceville</SelectItem>
              <SelectItem value="Centre des Impôts d'Oyem">Centre des Impôts d'Oyem</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CriteriaSelection;
