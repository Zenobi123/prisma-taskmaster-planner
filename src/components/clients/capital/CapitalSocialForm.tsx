
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CapitalSocial } from '@/types/capitalSocial';

interface CapitalSocialFormProps {
  capitalSocial: CapitalSocial | null;
  onSave: (data: Partial<CapitalSocial>) => Promise<boolean>;
  onDataChange: () => void;
}

export const CapitalSocialForm: React.FC<CapitalSocialFormProps> = ({
  capitalSocial,
  onSave,
  onDataChange
}) => {
  const [formData, setFormData] = useState<Partial<CapitalSocial>>({
    montant_capital: 0,
    valeur_action_part: 0,
    nombre_actions_parts: 0,
    type_capital: 'actions'
  });

  useEffect(() => {
    if (capitalSocial) {
      setFormData(capitalSocial);
    }
  }, [capitalSocial]);

  const handleChange = (field: keyof CapitalSocial, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onDataChange();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Capital Social</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="montant_capital">Montant du capital (FCFA)</Label>
              <Input
                id="montant_capital"
                type="number"
                value={formData.montant_capital || ''}
                onChange={(e) => handleChange('montant_capital', Number(e.target.value))}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="type_capital">Type de capital</Label>
              <Select 
                value={formData.type_capital || 'actions'} 
                onValueChange={(value) => handleChange('type_capital', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actions">Actions</SelectItem>
                  <SelectItem value="parts">Parts sociales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="valeur_action_part">
                Valeur par {formData.type_capital === 'actions' ? 'action' : 'part'} (FCFA)
              </Label>
              <Input
                id="valeur_action_part"
                type="number"
                value={formData.valeur_action_part || ''}
                onChange={(e) => handleChange('valeur_action_part', Number(e.target.value))}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="nombre_actions_parts">
                Nombre d'{formData.type_capital === 'actions' ? 'actions' : 'parts'}
              </Label>
              <Input
                id="nombre_actions_parts"
                type="number"
                value={formData.nombre_actions_parts || ''}
                onChange={(e) => handleChange('nombre_actions_parts', Number(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Sauvegarder le capital social
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
