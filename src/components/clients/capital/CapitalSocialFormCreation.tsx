
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { CapitalSocial, Actionnaire } from '@/types/capitalSocial';

interface CapitalSocialFormCreationProps {
  onCapitalChange: (data: Partial<CapitalSocial>) => void;
  onActionnaireChange: (data: Actionnaire[]) => void;
}

interface ActionnaireFormData {
  nom: string;
  prenom: string;
  date_naissance: string;
  lieu_habitation: string;
  nombre_actions_parts: number;
  valeur_capital: number;
  pourcentage: number;
}

export const CapitalSocialFormCreation: React.FC<CapitalSocialFormCreationProps> = ({
  onCapitalChange,
  onActionnaireChange
}) => {
  const [capitalData, setCapitalData] = useState<Partial<CapitalSocial>>({
    montant_capital: 0,
    valeur_action_part: 0,
    nombre_actions_parts: 0,
    type_capital: 'actions'
  });

  const [actionnaires, setActionnaires] = useState<Actionnaire[]>([]);
  const [showActionnaireForm, setShowActionnaireForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [actionnaireForm, setActionnaireForm] = useState<ActionnaireFormData>({
    nom: '',
    prenom: '',
    date_naissance: '',
    lieu_habitation: '',
    nombre_actions_parts: 0,
    valeur_capital: 0,
    pourcentage: 0
  });

  const handleCapitalChange = (field: keyof CapitalSocial, value: string | number) => {
    const newData = { ...capitalData, [field]: value };
    setCapitalData(newData);
    onCapitalChange(newData);
  };

  const handleActionnaireFormChange = (field: string, value: string | number) => {
    setActionnaireForm(prev => ({ ...prev, [field]: value }));
  };

  const addOrUpdateActionnaire = () => {
    const newActionnaire = {
      ...actionnaireForm,
      id: editingIndex >= 0 ? actionnaires[editingIndex].id : `temp-${Date.now()}`,
      client_id: ''
    } as Actionnaire;

    let newActionnaires;
    if (editingIndex >= 0) {
      newActionnaires = [...actionnaires];
      newActionnaires[editingIndex] = newActionnaire;
    } else {
      newActionnaires = [...actionnaires, newActionnaire];
    }

    setActionnaires(newActionnaires);
    onActionnaireChange(newActionnaires);
    resetActionnaireForm();
  };

  const editActionnaire = (index: number) => {
    const actionnaire = actionnaires[index];
    setActionnaireForm({
      nom: actionnaire.nom,
      prenom: actionnaire.prenom || '',
      date_naissance: actionnaire.date_naissance || '',
      lieu_habitation: actionnaire.lieu_habitation || '',
      nombre_actions_parts: actionnaire.nombre_actions_parts,
      valeur_capital: actionnaire.valeur_capital,
      pourcentage: actionnaire.pourcentage
    });
    setEditingIndex(index);
    setShowActionnaireForm(true);
  };

  const deleteActionnaire = (index: number) => {
    const newActionnaires = actionnaires.filter((_, i) => i !== index);
    setActionnaires(newActionnaires);
    onActionnaireChange(newActionnaires);
  };

  const resetActionnaireForm = () => {
    setActionnaireForm({
      nom: '',
      prenom: '',
      date_naissance: '',
      lieu_habitation: '',
      nombre_actions_parts: 0,
      valeur_capital: 0,
      pourcentage: 0
    });
    setEditingIndex(-1);
    setShowActionnaireForm(false);
  };

  const totalPourcentage = actionnaires.reduce((sum, a) => sum + a.pourcentage, 0);

  return (
    <div className="space-y-6">
      {/* Capital Social Form */}
      <Card>
        <CardHeader>
          <CardTitle>Capital Social</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="montant_capital">Montant du capital (FCFA)</Label>
              <Input
                id="montant_capital"
                type="number"
                value={capitalData.montant_capital || ''}
                onChange={(e) => handleCapitalChange('montant_capital', Number(e.target.value))}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="type_capital">Type de capital</Label>
              <Select 
                value={capitalData.type_capital || 'actions'} 
                onValueChange={(value) => handleCapitalChange('type_capital', value)}
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
                Valeur par {capitalData.type_capital === 'actions' ? 'action' : 'part'} (FCFA)
              </Label>
              <Input
                id="valeur_action_part"
                type="number"
                value={capitalData.valeur_action_part || ''}
                onChange={(e) => handleCapitalChange('valeur_action_part', Number(e.target.value))}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="nombre_actions_parts">
                Nombre d'{capitalData.type_capital === 'actions' ? 'actions' : 'parts'}
              </Label>
              <Input
                id="nombre_actions_parts"
                type="number"
                value={capitalData.nombre_actions_parts || ''}
                onChange={(e) => handleCapitalChange('nombre_actions_parts', Number(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actionnaires Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Actionnaires / Associés</CardTitle>
              {actionnaires.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Total des pourcentages: {totalPourcentage.toFixed(2)}%
                  {totalPourcentage !== 100 && (
                    <span className="text-orange-600 ml-2">
                      ⚠️ Le total devrait être 100%
                    </span>
                  )}
                </p>
              )}
            </div>
            <Button 
              type="button"
              onClick={() => setShowActionnaireForm(true)} 
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {actionnaires.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun actionnaire enregistré</p>
            </div>
          ) : (
            <div className="space-y-2">
              {actionnaires.map((actionnaire, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{actionnaire.nom} {actionnaire.prenom}</p>
                    <p className="text-sm text-gray-600">
                      {actionnaire.pourcentage}% - {actionnaire.nombre_actions_parts} {capitalData.type_capital === 'actions' ? 'actions' : 'parts'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => editActionnaire(index)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => deleteActionnaire(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Formulaire d'ajout/modification d'actionnaire */}
          {showActionnaireForm && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium mb-3">
                {editingIndex >= 0 ? 'Modifier' : 'Ajouter'} un actionnaire
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nom</Label>
                  <Input
                    value={actionnaireForm.nom}
                    onChange={(e) => handleActionnaireFormChange('nom', e.target.value)}
                    placeholder="Nom de l'actionnaire"
                  />
                </div>
                <div>
                  <Label>Prénom</Label>
                  <Input
                    value={actionnaireForm.prenom}
                    onChange={(e) => handleActionnaireFormChange('prenom', e.target.value)}
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <Label>Date de naissance</Label>
                  <Input
                    type="date"
                    value={actionnaireForm.date_naissance}
                    onChange={(e) => handleActionnaireFormChange('date_naissance', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Lieu d'habitation</Label>
                  <Input
                    value={actionnaireForm.lieu_habitation}
                    onChange={(e) => handleActionnaireFormChange('lieu_habitation', e.target.value)}
                    placeholder="Lieu d'habitation"
                  />
                </div>
                <div>
                  <Label>Nombre d'{capitalData.type_capital === 'actions' ? 'actions' : 'parts'}</Label>
                  <Input
                    type="number"
                    value={actionnaireForm.nombre_actions_parts}
                    onChange={(e) => handleActionnaireFormChange('nombre_actions_parts', Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Valeur du capital (FCFA)</Label>
                  <Input
                    type="number"
                    value={actionnaireForm.valeur_capital}
                    onChange={(e) => handleActionnaireFormChange('valeur_capital', Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Pourcentage (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={actionnaireForm.pourcentage}
                    onChange={(e) => handleActionnaireFormChange('pourcentage', Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button type="button" onClick={addOrUpdateActionnaire}>
                  {editingIndex >= 0 ? 'Modifier' : 'Ajouter'}
                </Button>
                <Button type="button" variant="outline" onClick={resetActionnaireForm}>
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
