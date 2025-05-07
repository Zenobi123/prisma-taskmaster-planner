
import React from 'react';
import { Paie } from "@/services/paieService";
import { Employe } from "@/services/rhService";
import { formatMontant } from "@/utils/formatUtils";
import { formatDate } from "@/utils/formatUtils";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer, Download } from "lucide-react";

interface PaySlipDetailProps {
  fiche: Paie;
  employe: Employe | null;
  client: { nom?: string; raisonsociale?: string };
  getNomMois: (mois: number) => string;
  onStatusChange: (id: string, statut: 'En cours' | 'Payé' | 'Annulé') => Promise<void>;
  onBack: () => void;
}

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

export const PaySlipDetail: React.FC<PaySlipDetailProps> = ({
  fiche,
  employe,
  client,
  getNomMois,
  onStatusChange,
  onBack
}) => {
  // Calculate the total IRPP (IRPP principal + CAC)
  const totalIrpp = (fiche.irpp || 0) + (fiche.cac || 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>Retour</Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" /> Imprimer
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Télécharger
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold">{client.raisonsociale || client.nom}</h2>
            <p className="text-muted-foreground">Bulletin de paie</p>
          </div>
          <div className="text-right">
            <p className="font-medium">Période: {getNomMois(fiche.mois)} {fiche.annee}</p>
            <Badge className={getPaiementStatutColor(fiche.statut)}>
              {fiche.statut}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-2">Informations de l'employé</h3>
            <div className="space-y-1 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Nom:</span>
                <span>{employe ? `${employe.prenom} ${employe.nom}` : "Employé inconnu"}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Poste:</span>
                <span>{employe?.poste || "-"}</span>
              </div>
              {employe?.departement && (
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium">Département:</span>
                  <span>{employe.departement}</span>
                </div>
              )}
              {employe?.numero_cnps && (
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium">N° CNPS:</span>
                  <span>{employe.numero_cnps}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Date d'embauche:</span>
                <span>{employe ? formatDate(employe.date_embauche) : "-"}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Récapitulatif</h3>
            <div className="space-y-1 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Salaire de base:</span>
                <span className="text-right">{formatMontant(fiche.salaire_base)}</span>
              </div>
              {fiche.montant_heures_sup > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium">Heures supplémentaires:</span>
                  <span className="text-right">{formatMontant(fiche.montant_heures_sup)}</span>
                </div>
              )}
              {fiche.total_primes > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium">Primes:</span>
                  <span className="text-right">{formatMontant(fiche.total_primes)}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                <span className="font-medium">Salaire brut:</span>
                <span className="text-right font-medium">{formatMontant(fiche.salaire_brut)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-2">Détails des cotisations</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Désignation</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>CNPS (4.2%)</TableCell>
                  <TableCell className="text-right">{formatMontant(fiche.cnps_employe)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>IRPP (Principal)</TableCell>
                  <TableCell className="text-right">{formatMontant(fiche.irpp)}</TableCell>
                </TableRow>
                {fiche.cac !== undefined && fiche.cac > 0 && (
                  <TableRow>
                    <TableCell>CAC (10% IRPP)</TableCell>
                    <TableCell className="text-right">{formatMontant(fiche.cac)}</TableCell>
                  </TableRow>
                )}
                {(fiche.irpp !== undefined || fiche.cac !== undefined) && (
                  <TableRow>
                    <TableCell className="font-medium">Total IRPP</TableCell>
                    <TableCell className="text-right font-medium">{formatMontant(totalIrpp)}</TableCell>
                  </TableRow>
                )}
                {fiche.cfc !== undefined && fiche.cfc > 0 && (
                  <TableRow>
                    <TableCell>CFC (1%)</TableCell>
                    <TableCell className="text-right">{formatMontant(fiche.cfc)}</TableCell>
                  </TableRow>
                )}
                {fiche.tdl !== undefined && fiche.tdl > 0 && (
                  <TableRow>
                    <TableCell>TDL</TableCell>
                    <TableCell className="text-right">{formatMontant(fiche.tdl)}</TableCell>
                  </TableRow>
                )}
                {fiche.rav !== undefined && fiche.rav > 0 && (
                  <TableRow>
                    <TableCell>RAV (Redevance Audiovisuelle)</TableCell>
                    <TableCell className="text-right">{formatMontant(fiche.rav)}</TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell className="font-medium">Total des retenues</TableCell>
                  <TableCell className="text-right font-medium">{formatMontant(fiche.total_retenues)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          {fiche.primes && fiche.primes.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Détails des primes</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Désignation</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fiche.primes.map((prime: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{prime.libelle || "Prime"}</TableCell>
                      <TableCell className="text-right">{formatMontant(prime.montant)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-medium">Total des primes</TableCell>
                    <TableCell className="text-right font-medium">{formatMontant(fiche.total_primes)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        
        <div className="border-t pt-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Charges patronales:</p>
            <p className="text-sm">CNPS Employeur (12.95%): {formatMontant(fiche.cnps_employeur)}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-medium">Net à payer:</p>
            <p className="text-2xl font-bold">{formatMontant(fiche.salaire_net)}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <Select 
            value={fiche.statut} 
            onValueChange={(value) => onStatusChange(fiche.id, value as 'En cours' | 'Payé' | 'Annulé')}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="En cours">En cours</SelectItem>
              <SelectItem value="Payé">Payé</SelectItem>
              <SelectItem value="Annulé">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
