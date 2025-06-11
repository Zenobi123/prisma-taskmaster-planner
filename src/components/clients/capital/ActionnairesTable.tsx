
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Actionnaire } from '@/types/capitalSocial';

interface ActionnairesTableProps {
  actionnaires: Actionnaire[];
  onEdit: (actionnaire: Actionnaire) => void;
  onDelete: (id: string) => void;
}

export const ActionnairesTable: React.FC<ActionnairesTableProps> = ({
  actionnaires,
  onEdit,
  onDelete
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('fr-FR') + ' FCFA';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 px-4 py-2 text-left">Nom</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Prénom</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Date de naissance</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Lieu d'habitation</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Nb Actions/Parts</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Valeur capital</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Pourcentage</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {actionnaires.map((actionnaire) => (
            <tr key={actionnaire.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{actionnaire.nom}</td>
              <td className="border border-gray-300 px-4 py-2">{actionnaire.prenom || '-'}</td>
              <td className="border border-gray-300 px-4 py-2">{formatDate(actionnaire.date_naissance)}</td>
              <td className="border border-gray-300 px-4 py-2">{actionnaire.lieu_habitation || '-'}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{actionnaire.nombre_actions_parts}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{formatAmount(actionnaire.valeur_capital)}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{actionnaire.pourcentage.toFixed(2)}%</td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="flex gap-2 justify-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(actionnaire)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(actionnaire.id!)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
