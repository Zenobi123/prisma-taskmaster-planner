
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Printer, Trash2, PlusCircle } from "lucide-react";
import { Paie } from "@/services/paieService";
import { Employe } from "@/services/rhService";

interface PaySlipListProps {
  fichesPaie: Paie[];
  employes: Employe[];
  isLoading: boolean;
  formatMontant: (montant?: number) => string;
  getNomMois: (mois: number) => string;
  filteredEmployes: Employe[];
  onCreateClick: () => void;
  onViewDetails: (fiche: Paie, employe: Employe | null) => void;
  onDeleteClick: (id: string) => Promise<void>;
}

export const PaySlipList: React.FC<PaySlipListProps> = ({
  fichesPaie,
  employes,
  isLoading,
  formatMontant,
  getNomMois,
  filteredEmployes,
  onCreateClick,
  onViewDetails,
  onDeleteClick
}) => {
  const getPaiementStatutColor = (statut: string) => {
    switch (statut) {
      case 'Payé':
        return "bg-green-100 text-green-800";
      case 'En cours':
        return "bg-yellow-100 text-yellow-800";
      case 'Annulé':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employé</TableHead>
          <TableHead>Période</TableHead>
          <TableHead>Salaire brut</TableHead>
          <TableHead>Charges</TableHead>
          <TableHead>Salaire net</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2">Chargement...</span>
              </div>
            </TableCell>
          </TableRow>
        ) : fichesPaie.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8">
              <p className="text-muted-foreground mb-4">Aucune fiche de paie pour cette période</p>
              <Button onClick={onCreateClick} disabled={filteredEmployes.length === 0}>
                <PlusCircle className="mr-2 h-4 w-4" /> Créer une fiche de paie
              </Button>
            </TableCell>
          </TableRow>
        ) : (
          fichesPaie.map((fiche) => {
            const employe = employes.find(e => e.id === fiche.employe_id);
            return (
              <TableRow key={fiche.id}>
                <TableCell>
                  {employe ? `${employe.prenom} ${employe.nom}` : "Employé inconnu"}
                  <div className="text-xs text-muted-foreground">{employe?.poste}</div>
                </TableCell>
                <TableCell>
                  {getNomMois(fiche.mois)} {fiche.annee}
                </TableCell>
                <TableCell>{formatMontant(fiche.salaire_brut)}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs">Employé: {formatMontant(fiche.cnps_employe || 0)}</span>
                    <span className="text-xs">Employeur: {formatMontant(fiche.cnps_employeur || 0)}</span>
                    <span className="text-xs">IRPP: {formatMontant(fiche.irpp || 0)}</span>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{formatMontant(fiche.salaire_net)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getPaiementStatutColor(fiche.statut)}`}>
                    {fiche.statut}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="outline" size="sm" onClick={() => onViewDetails(fiche, employe)}>
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onDeleteClick(fiche.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};
