
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Employe } from "@/services/rhService";
import { Paie } from "@/services/paieService";

interface EmployeeListProps {
  filteredEmployes: Employe[];
  isLoading: boolean;
  fichesPaie: Paie[];
  formatMontant: (montant?: number) => string;
  onCreateClick: (employe: Employe) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  filteredEmployes,
  isLoading,
  fichesPaie,
  formatMontant,
  onCreateClick
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employé</TableHead>
          <TableHead>Poste</TableHead>
          <TableHead>Salaire base</TableHead>
          <TableHead>Fiches de paie</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2">Chargement...</span>
              </div>
            </TableCell>
          </TableRow>
        ) : filteredEmployes.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              <p className="text-muted-foreground">Aucun employé trouvé</p>
            </TableCell>
          </TableRow>
        ) : (
          filteredEmployes.map((employe) => (
            <TableRow key={employe.id}>
              <TableCell>
                <div className="font-medium">{employe.prenom} {employe.nom}</div>
              </TableCell>
              <TableCell>{employe.poste}</TableCell>
              <TableCell>{formatMontant(employe.salaire_base)}</TableCell>
              <TableCell>
                {fichesPaie.filter(f => f.employe_id === employe.id).length}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => onCreateClick(employe)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Créer fiche
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
