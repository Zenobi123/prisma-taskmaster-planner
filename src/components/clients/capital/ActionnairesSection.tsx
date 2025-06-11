
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Actionnaire } from '@/types/capitalSocial';
import { ActionnairesTable } from './ActionnairesTable';
import { ActionnaireDialog } from './ActionnaireDialog';

interface ActionnairesSectionProps {
  actionnaires: Actionnaire[];
  onAdd: (data: Omit<Actionnaire, 'id' | 'client_id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  onUpdate: (id: string, data: Partial<Actionnaire>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export const ActionnairesSection: React.FC<ActionnairesSectionProps> = ({
  actionnaires,
  onAdd,
  onUpdate,
  onDelete
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActionnaire, setEditingActionnaire] = useState<Actionnaire | null>(null);

  const handleEdit = (actionnaire: Actionnaire) => {
    setEditingActionnaire(actionnaire);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingActionnaire(null);
    setIsDialogOpen(true);
  };

  const handleSave = async (data: Omit<Actionnaire, 'id' | 'client_id' | 'created_at' | 'updated_at'>) => {
    if (editingActionnaire) {
      const success = await onUpdate(editingActionnaire.id!, data);
      if (success) {
        setIsDialogOpen(false);
        setEditingActionnaire(null);
      }
      return success;
    } else {
      const success = await onAdd(data);
      if (success) {
        setIsDialogOpen(false);
      }
      return success;
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet actionnaire ?')) {
      await onDelete(id);
    }
  };

  const totalPourcentage = actionnaires.reduce((sum, a) => sum + a.pourcentage, 0);

  return (
    <div className="w-full">
      <Card className="w-full">
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
            <Button onClick={handleAdd} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {actionnaires.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun actionnaire enregistré</p>
              <Button onClick={handleAdd} variant="outline" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter le premier actionnaire
              </Button>
            </div>
          ) : (
            <ActionnairesTable
              actionnaires={actionnaires}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          <ActionnaireDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            actionnaire={editingActionnaire}
            onSave={handleSave}
          />
        </CardContent>
      </Card>
    </div>
  );
};
