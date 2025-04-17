
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2 } from "lucide-react";
import { Etablissement } from "@/hooks/fiscal/types/igsTypes";

interface IGSEstablishmentsSectionProps {
  etablissements: Etablissement[];
  chiffreAffairesAnnuel: number;
  onChiffreAffairesChange: (value: number) => void;
  onEtablissementsChange: (etablissements: Etablissement[]) => void;
}

export function IGSEstablishmentsSection({
  etablissements,
  chiffreAffairesAnnuel,
  onChiffreAffairesChange,
  onEtablissementsChange
}: IGSEstablishmentsSectionProps) {
  const [localEtablissements, setLocalEtablissements] = useState<Etablissement[]>(
    etablissements && etablissements.length > 0 
      ? etablissements 
      : [{
          nom: "Établissement principal",
          activite: "",
          ville: "",
          departement: "",
          quartier: "",
          chiffreAffaires: 0
        }]
  );

  // Update CA when any establishment CA changes
  const handleEtablissementChange = (index: number, field: keyof Etablissement, value: string | number) => {
    const updatedEtablissements = [...localEtablissements];
    
    // Update the specific field
    updatedEtablissements[index] = {
      ...updatedEtablissements[index],
      [field]: value
    };
    
    setLocalEtablissements(updatedEtablissements);
    onEtablissementsChange(updatedEtablissements);
    
    // If we're updating chiffreAffaires, recalculate the total
    if (field === 'chiffreAffaires') {
      const totalCA = updatedEtablissements.reduce(
        (sum, etab) => sum + (typeof etab.chiffreAffaires === 'number' ? etab.chiffreAffaires : 0), 
        0
      );
      onChiffreAffairesChange(totalCA);
    }
  };

  const addEtablissement = () => {
    const newEtablissements = [
      ...localEtablissements,
      {
        nom: `Établissement ${localEtablissements.length + 1}`,
        activite: "",
        ville: "",
        departement: "",
        quartier: "",
        chiffreAffaires: 0
      }
    ];
    
    setLocalEtablissements(newEtablissements);
    onEtablissementsChange(newEtablissements);
  };

  const removeEtablissement = (index: number) => {
    if (localEtablissements.length <= 1) {
      return; // Always keep at least one establishment
    }
    
    const updatedEtablissements = localEtablissements.filter((_, i) => i !== index);
    setLocalEtablissements(updatedEtablissements);
    onEtablissementsChange(updatedEtablissements);
    
    // Recalculate total CA
    const totalCA = updatedEtablissements.reduce(
      (sum, etab) => sum + (typeof etab.chiffreAffaires === 'number' ? etab.chiffreAffaires : 0), 
      0
    );
    onChiffreAffairesChange(totalCA);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-md font-medium">Établissements et Chiffre d'Affaires</h4>
      
      {/* Chiffre d'affaires annuel */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="chiffreAffairesAnnuel">Chiffre d'affaires annuel</Label>
          <Input
            id="chiffreAffairesAnnuel"
            type="number"
            value={chiffreAffairesAnnuel || 0}
            onChange={(e) => onChiffreAffairesChange(Number(e.target.value))}
            className="mt-1"
          />
        </div>
      </div>
      
      <Separator className="my-4" />
      
      {/* Liste des établissements */}
      {localEtablissements.map((etablissement, index) => (
        <Card key={index} className="mb-4">
          <CardContent className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-medium">{etablissement.nom}</h5>
              {localEtablissements.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeEtablissement(index)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`nom-${index}`}>Nom</Label>
                <Input
                  id={`nom-${index}`}
                  value={etablissement.nom}
                  onChange={(e) => handleEtablissementChange(index, 'nom', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor={`activite-${index}`}>Activité</Label>
                <Input
                  id={`activite-${index}`}
                  value={etablissement.activite}
                  onChange={(e) => handleEtablissementChange(index, 'activite', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor={`ville-${index}`}>Ville</Label>
                <Input
                  id={`ville-${index}`}
                  value={etablissement.ville}
                  onChange={(e) => handleEtablissementChange(index, 'ville', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor={`departement-${index}`}>Département</Label>
                <Input
                  id={`departement-${index}`}
                  value={etablissement.departement}
                  onChange={(e) => handleEtablissementChange(index, 'departement', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor={`quartier-${index}`}>Quartier</Label>
                <Input
                  id={`quartier-${index}`}
                  value={etablissement.quartier}
                  onChange={(e) => handleEtablissementChange(index, 'quartier', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor={`chiffreAffaires-${index}`}>Chiffre d'affaires</Label>
                <Input
                  id={`chiffreAffaires-${index}`}
                  type="number"
                  value={etablissement.chiffreAffaires || 0}
                  onChange={(e) => handleEtablissementChange(index, 'chiffreAffaires', Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button 
        variant="outline" 
        onClick={addEtablissement}
        className="w-full justify-center"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Ajouter un établissement
      </Button>
    </div>
  );
}
