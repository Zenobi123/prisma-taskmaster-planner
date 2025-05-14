import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Paie } from "@/types/paie";
import { formatMoney, formatCurrency } from "./utils";
import { Printer, Eye, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PayrollDetailsCard } from "./PayrollDetailsCard";
import { EmployerChargesCard } from "./EmployerChargesCard";

interface EmployeePaieTableProps {
  paies: Paie[];
  title?: string;
  onDelete?: (paie: Paie) => void;
  onEdit?: (paie: Paie) => void;
}

export function EmployeePaieTable({ paies, title = "Fiches de paie", onDelete, onEdit }: EmployeePaieTableProps) {
  // Fonction pour obtenir le nom du mois
  const getMonthName = (monthNumber: number) => {
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return monthNames[monthNumber - 1];
  };
  
  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "Payé":
        return <Badge className="bg-green-500">Payé</Badge>;
      case "Annulé":
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge variant="outline">En cours</Badge>;
    }
  };
  
  const renderEmployerCharges = (paie: Paie) => (
    <div className="mt-3">
      <h3 className="font-semibold text-sm mb-2">Charges patronales</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="text-muted-foreground text-xs">CNPS (14%):</span>
          <span className="font-medium ml-1 text-sm">{formatCurrency(paie.cnps_employeur || 0)}</span>
        </div>
        <div>
          <span className="text-muted-foreground text-xs">CFC (1%):</span>
          <span className="font-medium ml-1 text-sm">{formatCurrency(paie.cfc || 0)}</span>
        </div>
      </div>
    </div>
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {paies.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Aucune fiche de paie disponible
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Période</TableHead>
                <TableHead>Salaire brut</TableHead>
                <TableHead>Salaire net</TableHead>
                <TableHead>Mode paiement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paies.map((paie) => (
                <TableRow key={paie.id}>
                  <TableCell>
                    {getMonthName(paie.mois)} {paie.annee}
                  </TableCell>
                  <TableCell>{formatMoney(paie.salaire_brut)} FCFA</TableCell>
                  <TableCell>{formatMoney(paie.salaire_net)} FCFA</TableCell>
                  <TableCell>{paie.mode_paiement}</TableCell>
                  <TableCell>{getStatutBadge(paie.statut)}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="mr-1">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>
                            Fiche de paie - {getMonthName(paie.mois)} {paie.annee}
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <PayrollDetailsCard
                            employeeId={parseInt(paie.employe_id)}
                            grossSalary={paie.salaire_brut}
                            cnpsEmployee={paie.cnps_employe}
                            irpp={paie.irpp}
                            cac={paie.cac}
                            tdl={paie.tdl}
                            rav={paie.rav}
                            cfc={paie.cfc}
                            netSalary={paie.salaire_net}
                          />
                          
                          <EmployerChargesCard
                            totalGrossSalary={paie.salaire_brut}
                            cnpsEmployer={paie.cnps_employeur}
                            cfcEmployer={paie.cfc_employeur}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline" size="sm" className="mr-1">
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
