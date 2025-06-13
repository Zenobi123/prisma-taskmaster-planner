
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface CriteriaSelectionProps {
  criteria: {
    type: string;
    regimeFiscal: string;
    secteurActivite: string;
    centreRattachement: string;
    statut: string;
  };
  onCriteriaChange: (criteria: any) => void;
}

export function CriteriaSelection({ criteria, onCriteriaChange }: CriteriaSelectionProps) {
  const handleCriteriaUpdate = (field: string, value: string) => {
    onCriteriaChange({
      ...criteria,
      [field]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Critères de Sélection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Type de Client</Label>
          <Select 
            value={criteria.type} 
            onValueChange={(value) => handleCriteriaUpdate('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les types</SelectItem>
              <SelectItem value="physique">Personne Physique</SelectItem>
              <SelectItem value="morale">Personne Morale</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Régime Fiscal</Label>
          <Select 
            value={criteria.regimeFiscal} 
            onValueChange={(value) => handleCriteriaUpdate('regimeFiscal', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les régimes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les régimes</SelectItem>
              <SelectItem value="reel">Régime Réel</SelectItem>
              <SelectItem value="igs">IGS</SelectItem>
              <SelectItem value="non_professionnel">Non Professionnel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Secteur d'Activité</Label>
          <Select 
            value={criteria.secteurActivite} 
            onValueChange={(value) => handleCriteriaUpdate('secteurActivite', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les secteurs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les secteurs</SelectItem>
              <SelectItem value="commerce">Commerce</SelectItem>
              <SelectItem value="industrie">Industrie</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="agriculture">Agriculture</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="btp">BTP</SelectItem>
              <SelectItem value="restauration">Restauration</SelectItem>
              <SelectItem value="hotellerie">Hôtellerie</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Centre de Rattachement</Label>
          <Select 
            value={criteria.centreRattachement} 
            onValueChange={(value) => handleCriteriaUpdate('centreRattachement', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les centres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les centres</SelectItem>
              <SelectItem value="Centre des Impôts de Libreville">Centre des Impôts de Libreville</SelectItem>
              <SelectItem value="Centre des Impôts de Port-Gentil">Centre des Impôts de Port-Gentil</SelectItem>
              <SelectItem value="Centre des Impôts de Franceville">Centre des Impôts de Franceville</SelectItem>
              <SelectItem value="Centre des Impôts d'Oyem">Centre des Impôts d'Oyem</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Statut</Label>
          <Select 
            value={criteria.statut} 
            onValueChange={(value) => handleCriteriaUpdate('statut', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Statut du client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="actif">Actif</SelectItem>
              <SelectItem value="inactif">Inactif</SelectItem>
              <SelectItem value="archive">Archivé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
