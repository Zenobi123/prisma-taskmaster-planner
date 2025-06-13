
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { X, Filter } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Client, ClientType } from "@/types/client";

interface FilterCriteria {
  types: ClientType[];
  secteurs: string[];
  statuts: string[];
  regimesFiscaux: string[];
  centresRattachement: string[];
}

interface MultiCriteriaFilterProps {
  clients: Client[];
  onFilterChange: (filteredClients: Client[]) => void;
  isMobile?: boolean;
}

export function MultiCriteriaFilter({ 
  clients, 
  onFilterChange, 
  isMobile 
}: MultiCriteriaFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [criteria, setCriteria] = useState<FilterCriteria>({
    types: [],
    secteurs: [],
    statuts: [],
    regimesFiscaux: [],
    centresRattachement: []
  });

  // Extract unique values from clients
  const uniqueValues = {
    secteurs: [...new Set(clients.map(c => c.secteuractivite).filter(Boolean))],
    statuts: [...new Set(clients.map(c => c.statut))],
    regimesFiscaux: [...new Set(clients.map(c => c.regimefiscal))],
    centresRattachement: [...new Set(clients.map(c => c.centrerattachement).filter(Boolean))]
  };

  const applyFilters = () => {
    const filtered = clients.filter(client => {
      // Filter by type
      if (criteria.types.length > 0 && !criteria.types.includes(client.type)) {
        return false;
      }

      // Filter by secteur
      if (criteria.secteurs.length > 0 && !criteria.secteurs.includes(client.secteuractivite)) {
        return false;
      }

      // Filter by statut
      if (criteria.statuts.length > 0 && !criteria.statuts.includes(client.statut)) {
        return false;
      }

      // Filter by regime fiscal
      if (criteria.regimesFiscaux.length > 0 && !criteria.regimesFiscaux.includes(client.regimefiscal)) {
        return false;
      }

      // Filter by centre rattachement
      if (criteria.centresRattachement.length > 0 && !criteria.centresRattachement.includes(client.centrerattachement)) {
        return false;
      }

      return true;
    });

    onFilterChange(filtered);
  };

  const clearFilters = () => {
    setCriteria({
      types: [],
      secteurs: [],
      statuts: [],
      regimesFiscaux: [],
      centresRattachement: []
    });
    onFilterChange(clients);
  };

  const updateCriteria = (key: keyof FilterCriteria, value: string, checked: boolean) => {
    setCriteria(prev => {
      const currentArray = prev[key] as string[];
      const newArray = checked 
        ? [...currentArray, value]
        : currentArray.filter(item => item !== value);
      
      const newCriteria = { ...prev, [key]: newArray };
      return newCriteria;
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(criteria).reduce((count, arr) => count + arr.length, 0);
  };

  return (
    <div className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="gap-2"
            size={isMobile ? "sm" : "default"}
          >
            <Filter className="h-4 w-4" />
            Filtres multicritères
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-1">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Filtres avancés</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={applyFilters}
                  >
                    Appliquer
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Effacer
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} gap-4`}>
                
                {/* Type de client */}
                <div className="space-y-2">
                  <Label className="font-medium">Type de client</Label>
                  <div className="space-y-2">
                    {(['physique', 'morale'] as ClientType[]).map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={criteria.types.includes(type)}
                          onCheckedChange={(checked) => 
                            updateCriteria('types', type, checked as boolean)
                          }
                        />
                        <Label htmlFor={`type-${type}`} className="text-sm">
                          {type === 'physique' ? 'Personne physique' : 'Personne morale'}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Secteur d'activité */}
                <div className="space-y-2">
                  <Label className="font-medium">Secteur d'activité</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {uniqueValues.secteurs.map(secteur => (
                      <div key={secteur} className="flex items-center space-x-2">
                        <Checkbox
                          id={`secteur-${secteur}`}
                          checked={criteria.secteurs.includes(secteur)}
                          onCheckedChange={(checked) => 
                            updateCriteria('secteurs', secteur, checked as boolean)
                          }
                        />
                        <Label htmlFor={`secteur-${secteur}`} className="text-sm capitalize">
                          {secteur}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Statut */}
                <div className="space-y-2">
                  <Label className="font-medium">Statut</Label>
                  <div className="space-y-2">
                    {uniqueValues.statuts.map(statut => (
                      <div key={statut} className="flex items-center space-x-2">
                        <Checkbox
                          id={`statut-${statut}`}
                          checked={criteria.statuts.includes(statut)}
                          onCheckedChange={(checked) => 
                            updateCriteria('statuts', statut, checked as boolean)
                          }
                        />
                        <Label htmlFor={`statut-${statut}`} className="text-sm capitalize">
                          {statut}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Régime fiscal */}
                <div className="space-y-2">
                  <Label className="font-medium">Régime fiscal</Label>
                  <div className="space-y-2">
                    {uniqueValues.regimesFiscaux.map(regime => (
                      <div key={regime} className="flex items-center space-x-2">
                        <Checkbox
                          id={`regime-${regime}`}
                          checked={criteria.regimesFiscaux.includes(regime)}
                          onCheckedChange={(checked) => 
                            updateCriteria('regimesFiscaux', regime, checked as boolean)
                          }
                        />
                        <Label htmlFor={`regime-${regime}`} className="text-sm">
                          {regime === 'reel' ? 'Réel' : 
                           regime === 'igs' ? 'IGS' : 
                           regime === 'non_professionnel' ? 'Non Professionnel' : regime}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Centre de rattachement */}
                <div className="space-y-2">
                  <Label className="font-medium">Centre de rattachement</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {uniqueValues.centresRattachement.map(centre => (
                      <div key={centre} className="flex items-center space-x-2">
                        <Checkbox
                          id={`centre-${centre}`}
                          checked={criteria.centresRattachement.includes(centre)}
                          onCheckedChange={(checked) => 
                            updateCriteria('centresRattachement', centre, checked as boolean)
                          }
                        />
                        <Label htmlFor={`centre-${centre}`} className="text-sm">
                          {centre}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active filters display */}
              {getActiveFiltersCount() > 0 && (
                <div className="pt-4 border-t">
                  <Label className="font-medium mb-2 block">Filtres actifs :</Label>
                  <div className="flex flex-wrap gap-2">
                    {criteria.types.map(type => (
                      <Badge key={`type-${type}`} variant="secondary" className="gap-1">
                        {type === 'physique' ? 'Personne physique' : 'Personne morale'}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => updateCriteria('types', type, false)}
                        />
                      </Badge>
                    ))}
                    {criteria.secteurs.map(secteur => (
                      <Badge key={`secteur-${secteur}`} variant="secondary" className="gap-1">
                        {secteur}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => updateCriteria('secteurs', secteur, false)}
                        />
                      </Badge>
                    ))}
                    {criteria.statuts.map(statut => (
                      <Badge key={`statut-${statut}`} variant="secondary" className="gap-1">
                        {statut}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => updateCriteria('statuts', statut, false)}
                        />
                      </Badge>
                    ))}
                    {criteria.regimesFiscaux.map(regime => (
                      <Badge key={`regime-${regime}`} variant="secondary" className="gap-1">
                        {regime}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => updateCriteria('regimesFiscaux', regime, false)}
                        />
                      </Badge>
                    ))}
                    {criteria.centresRattachement.map(centre => (
                      <Badge key={`centre-${centre}`} variant="secondary" className="gap-1">
                        {centre}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => updateCriteria('centresRattachement', centre, false)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
