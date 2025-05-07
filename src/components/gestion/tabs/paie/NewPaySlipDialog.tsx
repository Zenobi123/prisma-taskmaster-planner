
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Calculator } from "lucide-react";
import { Employe } from "@/services/rhService";
import { Paie } from "@/services/paieService";

interface NewPaySlipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEmploye: Employe | null;
  newFichePaie: Partial<Paie>;
  setNewFichePaie: (fiche: Partial<Paie>) => void;
  calculerFichePaie: () => void;
  handleAddPrime: () => void;
  handleRemovePrime: (index: number) => void;
  handleUpdatePrime: (index: number, field: 'libelle' | 'montant', value: string | number) => void;
  handleAddFichePaie: () => Promise<void>;
  getNomMois: (mois: number) => string;
  formatMontant: (montant?: number) => string;
}

export const NewPaySlipDialog: React.FC<NewPaySlipDialogProps> = ({
  open,
  onOpenChange,
  selectedEmploye,
  newFichePaie,
  setNewFichePaie,
  calculerFichePaie,
  handleAddPrime,
  handleRemovePrime,
  handleUpdatePrime,
  handleAddFichePaie,
  getNomMois,
  formatMontant
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Créer une fiche de paie</DialogTitle>
          <DialogDescription>
            {selectedEmploye ? `Établir la fiche de paie pour ${selectedEmploye.prenom} ${selectedEmploye.nom}` : "Veuillez sélectionner un employé"}
          </DialogDescription>
        </DialogHeader>
        
        {selectedEmploye ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="paie-mois">Mois</Label>
                <Select 
                  value={newFichePaie.mois?.toString()} 
                  onValueChange={(value) => setNewFichePaie({...newFichePaie, mois: parseInt(value)})}
                >
                  <SelectTrigger id="paie-mois">
                    <SelectValue placeholder="Mois" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((mois) => (
                      <SelectItem key={mois} value={mois.toString()}>
                        {getNomMois(mois)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="paie-annee">Année</Label>
                <Select 
                  value={newFichePaie.annee?.toString()} 
                  onValueChange={(value) => setNewFichePaie({...newFichePaie, annee: parseInt(value)})}
                >
                  <SelectTrigger id="paie-annee">
                    <SelectValue placeholder="Année" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((annee) => (
                      <SelectItem key={annee} value={annee.toString()}>
                        {annee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="paie-salaire-base">Salaire de base</Label>
                <Input 
                  id="paie-salaire-base" 
                  type="number" 
                  value={newFichePaie.salaire_base?.toString() || "0"}
                  onChange={(e) => setNewFichePaie({...newFichePaie, salaire_base: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="paie-heures-sup">Heures supplémentaires</Label>
                <Input 
                  id="paie-heures-sup" 
                  type="number" 
                  value={newFichePaie.heures_sup?.toString() || "0"}
                  onChange={(e) => setNewFichePaie({...newFichePaie, heures_sup: parseFloat(e.target.value) || 0})}
                />
              </div>
              
              <div>
                <Label htmlFor="paie-taux-horaire-sup">Taux horaire majoré</Label>
                <Input 
                  id="paie-taux-horaire-sup" 
                  type="number" 
                  value={newFichePaie.taux_horaire_sup?.toString() || "0"}
                  onChange={(e) => setNewFichePaie({...newFichePaie, taux_horaire_sup: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Primes</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddPrime}>
                  <PlusCircle className="h-4 w-4 mr-1" /> Ajouter une prime
                </Button>
              </div>
              
              {Array.isArray(newFichePaie.primes) && newFichePaie.primes.map((prime, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input 
                    placeholder="Libellé de la prime" 
                    value={prime.libelle || ""} 
                    onChange={(e) => handleUpdatePrime(index, "libelle", e.target.value)}
                    className="flex-1"
                  />
                  <Input 
                    type="number" 
                    placeholder="Montant" 
                    value={prime.montant?.toString() || "0"} 
                    onChange={(e) => handleUpdatePrime(index, "montant", parseFloat(e.target.value) || 0)}
                    className="w-32"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemovePrime(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={() => calculerFichePaie()}>
                <Calculator className="h-4 w-4 mr-2" /> Calculer
              </Button>
              <div className="text-right">
                <p className="text-sm font-medium">Brut calculé: {formatMontant(newFichePaie.salaire_brut || 0)}</p>
                <p className="text-sm font-medium">IRPP: {formatMontant(newFichePaie.irpp || 0)}</p>
                <p className="text-sm font-medium">CAC: {formatMontant(newFichePaie.cac || 0)}</p>
                <p className="text-sm font-medium">CFC: {formatMontant(newFichePaie.cfc || 0)}</p>
                <p className="text-sm font-medium">TDL: {formatMontant(newFichePaie.tdl || 0)}</p>
                <p className="text-sm font-medium">RAV: {formatMontant(newFichePaie.rav || 0)}</p>
                <p className="text-sm font-medium">Net calculé: {formatMontant(newFichePaie.salaire_net || 0)}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button onClick={handleAddFichePaie}>Enregistrer la fiche de paie</Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 flex-col gap-2">
            <p className="text-muted-foreground">Veuillez d'abord sélectionner un employé</p>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Fermer</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
