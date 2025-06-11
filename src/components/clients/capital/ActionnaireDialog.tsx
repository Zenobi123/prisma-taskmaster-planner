
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Actionnaire } from '@/types/capitalSocial';

interface ActionnaireDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  actionnaire: Actionnaire | null;
  onSave: (data: Omit<Actionnaire, 'id' | 'client_id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
}

export const ActionnaireDialog: React.FC<ActionnaireDialogProps> = ({
  isOpen,
  onOpenChange,
  actionnaire,
  onSave
}) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    date_naissance: '',
    lieu_habitation: '',
    nombre_actions_parts: 0,
    valeur_capital: 0,
    pourcentage: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (actionnaire) {
      setFormData({
        nom: actionnaire.nom,
        prenom: actionnaire.prenom || '',
        date_naissance: actionnaire.date_naissance || '',
        lieu_habitation: actionnaire.lieu_habitation || '',
        nombre_actions_parts: actionnaire.nombre_actions_parts,
        valeur_capital: actionnaire.valeur_capital,
        pourcentage: actionnaire.pourcentage
      });
    } else {
      setFormData({
        nom: '',
        prenom: '',
        date_naissance: '',
        lieu_habitation: '',
        nombre_actions_parts: 0,
        valeur_capital: 0,
        pourcentage: 0
      });
    }
  }, [actionnaire, isOpen]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom.trim()) {
      alert('Le nom est obligatoire');
      return;
    }

    if (formData.pourcentage < 0 || formData.pourcentage > 100) {
      alert('Le pourcentage doit être entre 0 et 100');
      return;
    }

    setIsSubmitting(true);
    
    const success = await onSave({
      nom: formData.nom.trim(),
      prenom: formData.prenom.trim() || undefined,
      date_naissance: formData.date_naissance || undefined,
      lieu_habitation: formData.lieu_habitation.trim() || undefined,
      nombre_actions_parts: formData.nombre_actions_parts,
      valeur_capital: formData.valeur_capital,
      pourcentage: formData.pourcentage
    });

    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {actionnaire ? 'Modifier l\'actionnaire' : 'Ajouter un actionnaire'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                placeholder="Nom de famille"
                required
              />
            </div>

            <div>
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) => handleChange('prenom', e.target.value)}
                placeholder="Prénom"
              />
            </div>

            <div>
              <Label htmlFor="date_naissance">Date de naissance</Label>
              <Input
                id="date_naissance"
                type="date"
                value={formData.date_naissance}
                onChange={(e) => handleChange('date_naissance', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="lieu_habitation">Lieu d'habitation</Label>
              <Input
                id="lieu_habitation"
                value={formData.lieu_habitation}
                onChange={(e) => handleChange('lieu_habitation', e.target.value)}
                placeholder="Ville, pays"
              />
            </div>

            <div>
              <Label htmlFor="nombre_actions_parts">Nombre d'actions/parts</Label>
              <Input
                id="nombre_actions_parts"
                type="number"
                min="0"
                value={formData.nombre_actions_parts}
                onChange={(e) => handleChange('nombre_actions_parts', Number(e.target.value))}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="valeur_capital">Valeur du capital (FCFA)</Label>
              <Input
                id="valeur_capital"
                type="number"
                min="0"
                value={formData.valeur_capital}
                onChange={(e) => handleChange('valeur_capital', Number(e.target.value))}
                placeholder="0"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="pourcentage">Pourcentage (%)</Label>
              <Input
                id="pourcentage"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.pourcentage}
                onChange={(e) => handleChange('pourcentage', Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
