
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash2, Send, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from './StatusBadge';
import { Facture } from '@/types/facture';
import { formatCurrency, formatDate } from '@/utils/factureUtils';

interface FactureTableRowProps {
  facture: Facture;
  onView: (facture: Facture) => void;
  onEdit: (facture: Facture) => void;
  onDelete: (factureId: string) => void;
  onSend: (factureId: string) => void;
  onCancel: (factureId: string) => void;
}

export const FactureTableRow: React.FC<FactureTableRowProps> = ({
  facture,
  onView,
  onEdit,
  onDelete,
  onSend,
  onCancel,
}) => {
  const clientName = facture.client?.nom || 'Client inconnu';
  const solde = facture.montant - (facture.montant_paye || 0);

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium">{facture.id}</TableCell>
      <TableCell>{clientName}</TableCell>
      <TableCell>{formatDate(facture.date)}</TableCell>
      <TableCell>{formatDate(facture.echeance)}</TableCell>
      <TableCell className="text-right font-medium">
        {formatCurrency(facture.montant)}
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(facture.montant_paye || 0)}
      </TableCell>
      <TableCell className="text-right font-medium">
        {formatCurrency(solde)}
      </TableCell>
      <TableCell>
        <StatusBadge status={facture.status} type="document" />
      </TableCell>
      <TableCell>
        <StatusBadge status={facture.status_paiement} type="paiement" />
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(facture)}>
              <Eye className="mr-2 h-4 w-4" />
              Voir
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(facture)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {facture.status === 'brouillon' && (
              <DropdownMenuItem onClick={() => onSend(facture.id)}>
                <Send className="mr-2 h-4 w-4" />
                Envoyer
              </DropdownMenuItem>
            )}
            {facture.status === 'envoyée' && (
              <DropdownMenuItem onClick={() => onCancel(facture.id)}>
                <X className="mr-2 h-4 w-4" />
                Annuler
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(facture.id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
