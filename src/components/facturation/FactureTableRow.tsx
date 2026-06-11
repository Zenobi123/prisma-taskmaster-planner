
import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '@/utils/factureUtils';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Copy, Edit, FileText, MoreHorizontal, Send, Trash } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { Facture } from '@/types/facture';
import FacturePrintButton from '@/components/printable/connectors/FacturePrintButton';
import { useDocumentPreview } from '@/components/printable/DocumentPreviewProvider';

interface FactureTableRowProps {
  facture: Facture;
  onDelete: (id: string) => void;
}

export const FactureTableRow: React.FC<FactureTableRowProps> = ({ facture, onDelete }) => {
  const { id, client, date, echeance, montant, status_paiement } = facture;
  const clientName = client?.nom || 'N/A';
  const { previewNote } = useDocumentPreview();

  return (
    <tr>
      <td>
        <Link to={`/factures/${id}`} className="font-medium hover:underline">
          {id}
        </Link>
      </td>
      <td>{clientName}</td>
      <td>{formatDate(date)}</td>
      <td>{formatDate(echeance)}</td>
      <td>{formatCurrency(montant)}</td>
      <td><StatusBadge status={facture.status} type="document"/></td>
      <td><StatusBadge status={status_paiement} type="paiement"/></td>
      <td className="text-right">
        <FacturePrintButton facture={facture} variant="icon" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Copy className="mr-2 h-4 w-4" />
              Copier
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Send className="mr-2 h-4 w-4" />
              Envoyer la facture
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => previewNote(facture)}>
              <FileText className="mr-2 h-4 w-4" />
              Note explicative
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={`/factures/edit/${id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(id)} className="text-red-500 focus:text-red-500">
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};

export default FactureTableRow;
