
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
    return amount.toLocaleString('fr-FR') + ' F CFA';
  };

  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-3 py-2 text-left text-sm">Nom</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm">Prénom</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm">Date de naissance</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm">Lieu d'habitation</th>
              <th className="border border-gray-300 px-3 py-2 text-right text-sm">Nb Actions/Parts</th>
              <th className="border border-gray-300 px-3 py-2 text-right text-sm">Valeur capital</th>
              <th className="border border-gray-300 px-3 py-2 text-right text-sm">Pourcentage</th>
              <th className="border border-gray-300 px-3 py-2 text-center text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {actionnaires.map((actionnaire) => (
              <tr key={actionnaire.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2 text-sm">{actionnaire.nom}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{actionnaire.prenom || '-'}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{formatDate(actionnaire.date_naissance)}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{actionnaire.lieu_habitation || '-'}</td>
                <td className="border border-gray-300 px-3 py-2 text-right text-sm">{actionnaire.nombre_actions_parts}</td>
                <td className="border border-gray-300 px-3 py-2 text-right text-sm">{formatAmount(actionnaire.valeur_capital)}</td>
                <td className="border border-gray-300 px-3 py-2 text-right text-sm">{actionnaire.pourcentage.toFixed(2)}%</td>
                <td className="border border-gray-300 px-3 py-2">
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" variant="outline" onClick={() => onEdit(actionnaire)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(actionnaire.id!)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden space-y-3">
        {actionnaires.map((actionnaire) => (
          <div key={actionnaire.id} className="border rounded-lg p-3 bg-gray-50/50">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <p className="font-medium text-sm">{actionnaire.nom} {actionnaire.prenom || ''}</p>
                {actionnaire.lieu_habitation && (
                  <p className="text-xs text-muted-foreground truncate">{actionnaire.lieu_habitation}</p>
                )}
              </div>
              <div className="flex gap-1.5 shrink-0">
                <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => onEdit(actionnaire)}>
                  <Edit className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="destructive" className="h-7 w-7 p-0" onClick={() => onDelete(actionnaire.id!)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div>
                <span className="text-muted-foreground">Naissance: </span>
                <span>{formatDate(actionnaire.date_naissance)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Actions: </span>
                <span>{actionnaire.nombre_actions_parts}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Capital: </span>
                <span>{formatAmount(actionnaire.valeur_capital)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Part: </span>
                <span>{actionnaire.pourcentage.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
