
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Filter } from "lucide-react";

interface CriteriaSelectionProps {
  selectedCriteria: {
    type: string;
    regimeFiscal: string;
    secteurActivite: string;
    centreRattachement: string;
    statut: string;
  };
  onCriteriaChange: (criteria: any) => void;
  generationType: string;
  onGenerationTypeChange: (type: string) => void;
}

export const CriteriaSelection = ({
  selectedCriteria,
  onCriteriaChange,
  generationType,
  onGenerationTypeChange
}: CriteriaSelectionProps) => {
  const handleCriteriaChange = (field: string, value: string) => {
    onCriteriaChange({
      ...selectedCriteria,
      [field]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Critères de sélection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type de client</Label>
            <Select
              value={selectedCriteria.type}
              onValueChange={(value) => handleCriteriaChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="physique">Personne physique</SelectItem>
                <SelectItem value="morale">Personne morale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="regime">Régime fiscal</Label>
            <Select
              value={selectedCriteria.regimeFiscal}
              onValueChange={(value) => handleCriteriaChange("regimeFiscal", value)}
            >
              <SelectTrigger>
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
            <Label htmlFor="secteur">Secteur d'activité</Label>
            <Select
              value={selectedCriteria.secteurActivite}
              onValueChange={(value) => handleCriteriaChange("secteurActivite", value)}
            >
              <SelectTrigger>
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
            <Label htmlFor="centre">Centre de rattachement</Label>
            <Select
              value={selectedCriteria.centreRattachement}
              onValueChange={(value) => handleCriteriaChange("centreRattachement", value)}
            >
              <SelectTrigger>
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

        <div className="space-y-3">
          <Label>Type de génération</Label>
          <RadioGroup value={generationType} onValueChange={onGenerationTypeChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="publipostage" id="publipostage" />
              <Label htmlFor="publipostage">Publipostage (tous les clients sélectionnés)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individuel" id="individuel" />
              <Label htmlFor="individuel">Courriers individuels</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};
