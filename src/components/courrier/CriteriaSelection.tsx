
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Filter, Target, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  const activeCriteriaCount = Object.values(selectedCriteria).filter(Boolean).length;

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Critères de sélection
          </div>
          {activeCriteriaCount > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {activeCriteriaCount} filtre{activeCriteriaCount > 1 ? 's' : ''} actif{activeCriteriaCount > 1 ? 's' : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Type de génération */}
        {onGenerationTypeChange && (
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Target className="w-4 h-4" />
              Type de génération
            </Label>
            <RadioGroup value={generationType} onValueChange={onGenerationTypeChange}>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="masse" id="masse" />
                <Label htmlFor="masse" className="flex-1 cursor-pointer">
                  <div className="font-medium">Publipostage</div>
                  <div className="text-sm text-gray-500">Tous les clients correspondant aux critères</div>
                </Label>
                <Zap className="w-4 h-4 text-purple-500" />
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="individuel" id="individuel" />
                <Label htmlFor="individuel" className="flex-1 cursor-pointer">
                  <div className="font-medium">Courriers individuels</div>
                  <div className="text-sm text-gray-500">Sélection manuelle des clients</div>
                </Label>
                <Target className="w-4 h-4 text-green-500" />
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Filtres */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">Type de client</Label>
            <Select
              value={selectedCriteria.type || ""}
              onValueChange={(value) => handleCriteriaChange("type", value)}
            >
              <SelectTrigger className="border-gray-200 focus:border-blue-400">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="physique">Personne physique</SelectItem>
                <SelectItem value="morale">Personne morale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="regime" className="text-sm font-medium">Régime fiscal</Label>
            <Select
              value={selectedCriteria.regimeFiscal || ""}
              onValueChange={(value) => handleCriteriaChange("regimeFiscal", value)}
            >
              <SelectTrigger className="border-gray-200 focus:border-blue-400">
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
            <Label htmlFor="secteur" className="text-sm font-medium">Secteur d'activité</Label>
            <Select
              value={selectedCriteria.secteurActivite || ""}
              onValueChange={(value) => handleCriteriaChange("secteurActivite", value)}
            >
              <SelectTrigger className="border-gray-200 focus:border-blue-400">
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
            <Label htmlFor="centre" className="text-sm font-medium">Centre de rattachement</Label>
            <Select
              value={selectedCriteria.centreRattachement || ""}
              onValueChange={(value) => handleCriteriaChange("centreRattachement", value)}
            >
              <SelectTrigger className="border-gray-200 focus:border-blue-400">
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
      </CardContent>
    </Card>
  );
};

export default CriteriaSelection;
