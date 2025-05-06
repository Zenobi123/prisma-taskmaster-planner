
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Printer, ChevronDown } from "lucide-react";
import { Client } from "@/types/client";
import { Label } from "@/components/ui/label";
import { PayrollCalculator } from "./PayrollCalculator";
import { formatMoney } from "./utils";
import { Employee, PayrollItem } from "./types";

interface GestionPaieProps {
  client: Client;
}

export function GestionPaie({ client }: GestionPaieProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [reportType, setReportType] = useState<string>("monthly");
  const [reportPeriod, setReportPeriod] = useState<string>("1");
  const [showReport, setShowReport] = useState(false);

  // Données de paie fictives
  const payrollData = [
    { id: 1, employeeId: 1, month: 1, year: 2025, grossSalary: 450000, cnpsEmployee: 18900, irpp: 25000, netSalary: 406100 },
    { id: 2, employeeId: 2, month: 1, year: 2025, grossSalary: 380000, cnpsEmployee: 15960, irpp: 19000, netSalary: 345040 },
    { id: 3, employeeId: 3, month: 1, year: 2025, grossSalary: 320000, cnpsEmployee: 13440, irpp: 15000, netSalary: 291560 },
    { id: 4, employeeId: 4, month: 1, year: 2025, grossSalary: 280000, cnpsEmployee: 11760, irpp: 12000, netSalary: 256240 },
    { id: 5, employeeId: 5, month: 1, year: 2025, grossSalary: 350000, cnpsEmployee: 14700, irpp: 18000, netSalary: 317300 }
  ];

  // Données employés
  const employees = [
    { id: 1, firstname: "Jean", lastname: "Dupont", department: "Direction", position: "Directeur", baseSalary: 450000, hireDate: "2023-01-15" },
    { id: 2, firstname: "Sophie", lastname: "Martin", department: "Finance", position: "Comptable", baseSalary: 380000, hireDate: "2023-03-01" },
    { id: 3, firstname: "Pierre", lastname: "Leroy", department: "Ventes", position: "Commercial", baseSalary: 320000, hireDate: "2023-06-10" },
    { id: 4, firstname: "Marie", lastname: "Dubois", department: "Administration", position: "Assistante", baseSalary: 280000, hireDate: "2023-08-22" },
    { id: 5, firstname: "Paul", lastname: "Moreau", department: "Production", position: "Technicien", baseSalary: 350000, hireDate: "2022-11-05" }
  ];

  // Structure pour le rapport de paie
  const payrolls = [
    {
      month: 1,
      year: 2025,
      items: payrollData
    }
  ];

  // Calculer les totaux
  const calculateTotals = () => {
    let totalGross = 0;
    let totalCNPS = 0;
    let totalIRPP = 0;
    let totalNet = 0;
    
    payrollData.forEach(item => {
      totalGross += item.grossSalary;
      totalCNPS += item.cnpsEmployee;
      totalIRPP += item.irpp;
      totalNet += item.netSalary;
    });
    
    return { totalGross, totalCNPS, totalIRPP, totalNet };
  };

  const totals = calculateTotals();

  // Convertir le mois en texte
  const getMonthName = (monthNumber: number) => {
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return monthNames[monthNumber - 1];
  };

  // Générer le rapport
  const generateReport = () => {
    setShowReport(true);
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gestion de la Paie - {client.nom || client.raisonsociale}</CardTitle>
        <CardDescription>
          Traitement des salaires, bulletins de paie et déclarations sociales/fiscales
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="payroll">
          <TabsList>
            <TabsTrigger value="payroll">Traitement de la paie</TabsTrigger>
            <TabsTrigger value="payslips">Bulletins de paie</TabsTrigger>
            <TabsTrigger value="reports">Rapports et déclarations</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>
          
          <TabsContent value="payroll" className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="space-y-2">
                <Label htmlFor="payroll-month">Mois</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sélectionner le mois" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Janvier</SelectItem>
                    <SelectItem value="1">Février</SelectItem>
                    <SelectItem value="2">Mars</SelectItem>
                    <SelectItem value="3">Avril</SelectItem>
                    <SelectItem value="4">Mai</SelectItem>
                    <SelectItem value="5">Juin</SelectItem>
                    <SelectItem value="6">Juillet</SelectItem>
                    <SelectItem value="7">Août</SelectItem>
                    <SelectItem value="8">Septembre</SelectItem>
                    <SelectItem value="9">Octobre</SelectItem>
                    <SelectItem value="10">Novembre</SelectItem>
                    <SelectItem value="11">Décembre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payroll-year">Année</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sélectionner l'année" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="mt-8">
                Générer la paie
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Salaire Brut</TableHead>
                      <TableHead>CNPS</TableHead>
                      <TableHead>IRPP</TableHead>
                      <TableHead>Salaire Net</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollData.map(item => {
                      const employee = employees.find(emp => emp.id === item.employeeId);
                      if (!employee) return null;
                      
                      return (
                        <TableRow key={item.id}>
                          <TableCell>{employee.lastname} {employee.firstname}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>{formatMoney(item.grossSalary)} FCFA</TableCell>
                          <TableCell>{formatMoney(item.cnpsEmployee)} FCFA</TableCell>
                          <TableCell>{formatMoney(item.irpp)} FCFA</TableCell>
                          <TableCell>{formatMoney(item.netSalary)} FCFA</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" className="mr-1">
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  <tfoot className="bg-primary text-white">
                    <tr>
                      <th colSpan={2} className="p-2">TOTAL</th>
                      <th className="p-2">{formatMoney(totals.totalGross)} FCFA</th>
                      <th className="p-2">{formatMoney(totals.totalCNPS)} FCFA</th>
                      <th className="p-2">{formatMoney(totals.totalIRPP)} FCFA</th>
                      <th className="p-2">{formatMoney(totals.totalNet)} FCFA</th>
                      <th></th>
                    </tr>
                  </tfoot>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payslips">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="space-y-2">
                    <Label htmlFor="payslip-month">Mois</Label>
                    <Select defaultValue="0">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sélectionner le mois" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Janvier</SelectItem>
                        <SelectItem value="1">Février</SelectItem>
                        <SelectItem value="2">Mars</SelectItem>
                        <SelectItem value="3">Avril</SelectItem>
                        <SelectItem value="4">Mai</SelectItem>
                        <SelectItem value="5">Juin</SelectItem>
                        <SelectItem value="6">Juillet</SelectItem>
                        <SelectItem value="7">Août</SelectItem>
                        <SelectItem value="8">Septembre</SelectItem>
                        <SelectItem value="9">Octobre</SelectItem>
                        <SelectItem value="10">Novembre</SelectItem>
                        <SelectItem value="11">Décembre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="payslip-year">Année</Label>
                    <Select defaultValue="2025">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sélectionner l'année" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Button>
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimer tous les bulletins
                  </Button>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Salaire Net</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollData.map(item => {
                    const employee = employees.find(emp => emp.id === item.employeeId);
                    if (!employee) return null;
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell>{employee.lastname} {employee.firstname}</TableCell>
                        <TableCell>{getMonthName(item.month)} {item.year}</TableCell>
                        <TableCell>{formatMoney(item.netSalary)} FCFA</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="mr-1">
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Type de Rapport</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type de rapport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Rapport Mensuel</SelectItem>
                      <SelectItem value="quarterly">Rapport Trimestriel</SelectItem>
                      <SelectItem value="annual">Rapport Annuel</SelectItem>
                      <SelectItem value="cnps">Déclaration CNPS</SelectItem>
                      <SelectItem value="tax">Déclaration Fiscale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="report-period">Période</Label>
                  <Select value={reportPeriod} onValueChange={setReportPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Janvier 2025</SelectItem>
                      <SelectItem value="2">Février 2025</SelectItem>
                      <SelectItem value="3">Mars 2025</SelectItem>
                      <SelectItem value="q1">T1 2025</SelectItem>
                      <SelectItem value="q2">T2 2025</SelectItem>
                      <SelectItem value="2025">Année 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Button onClick={generateReport}>
                  Générer le Rapport
                </Button>
              </div>
            </div>
            
            {showReport && reportType === "monthly" && (
              <div className="report bg-white p-6 rounded-lg border mt-4">
                <h3 className="text-center text-xl font-bold text-primary mb-6">
                  Rapport Mensuel de Paie - {getMonthName(parseInt(reportPeriod))} 2025
                </h3>
                
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-sm font-medium text-gray-500 mb-2">Total Brut</div>
                    <div className="text-lg font-bold">{formatMoney(totals.totalGross)} FCFA</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-sm font-medium text-gray-500 mb-2">Total CNPS</div>
                    <div className="text-lg font-bold">{formatMoney(totals.totalCNPS)} FCFA</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-sm font-medium text-gray-500 mb-2">Total IRPP</div>
                    <div className="text-lg font-bold">{formatMoney(totals.totalIRPP)} FCFA</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-sm font-medium text-gray-500 mb-2">Total Net</div>
                    <div className="text-lg font-bold">{formatMoney(totals.totalNet)} FCFA</div>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Salaire Brut</TableHead>
                      <TableHead>CNPS</TableHead>
                      <TableHead>IRPP</TableHead>
                      <TableHead>Salaire Net</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollData.map(item => {
                      const employee = employees.find(emp => emp.id === item.employeeId);
                      if (!employee) return null;
                      
                      return (
                        <TableRow key={item.id}>
                          <TableCell>{employee.lastname} {employee.firstname}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>{formatMoney(item.grossSalary)} FCFA</TableCell>
                          <TableCell>{formatMoney(item.cnpsEmployee)} FCFA</TableCell>
                          <TableCell>{formatMoney(item.irpp)} FCFA</TableCell>
                          <TableCell>{formatMoney(item.netSalary)} FCFA</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  <tfoot className="bg-primary text-white">
                    <tr>
                      <th colSpan={2} className="p-2">TOTAL</th>
                      <th className="p-2">{formatMoney(totals.totalGross)} FCFA</th>
                      <th className="p-2">{formatMoney(totals.totalCNPS)} FCFA</th>
                      <th className="p-2">{formatMoney(totals.totalIRPP)} FCFA</th>
                      <th className="p-2">{formatMoney(totals.totalNet)} FCFA</th>
                    </tr>
                  </tfoot>
                </Table>
                
                <div className="text-right text-sm text-gray-500 italic mt-4">
                  Rapport généré le {formatDate(new Date().toISOString())}
                </div>
              </div>
            )}
            
            {showReport && reportType !== "monthly" && (
              <div className="alert bg-red-100 text-red-800 p-4 rounded-lg mt-4 text-center">
                Le rapport {reportType === "quarterly" ? "trimestriel" : 
                            reportType === "annual" ? "annuel" : 
                            reportType === "cnps" ? "de déclaration CNPS" : "fiscal"} 
                sera disponible dans une prochaine version.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Paramètres de l'Entreprise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nom de l'Entreprise</Label>
                    <Input id="company-name" defaultValue={client.raisonsociale || client.nom} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-address">Adresse</Label>
                    <Input id="company-address" defaultValue={client.adresse?.ville || "Yaoundé, Cameroun"} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-nif">NIU/NIF</Label>
                    <Input id="company-nif" defaultValue={client.niu || ""} placeholder="Numéro d'Identification Unique" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-cnps">N° CNPS</Label>
                    <Input id="company-cnps" defaultValue={client.numerocnps || ""} placeholder="Numéro CNPS" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Paramètres de Calcul</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cnps-rate-employee">Taux CNPS Employé (%)</Label>
                    <Input id="cnps-rate-employee" type="number" defaultValue="4.2" step="0.1" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cnps-rate-employer">Taux CNPS Employeur (%)</Label>
                    <Input id="cnps-rate-employer" type="number" defaultValue="12.95" step="0.1" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tax-abatement">Abattement Forfaitaire (%)</Label>
                    <Input id="tax-abatement" type="number" defaultValue="30" step="0.1" />
                  </div>
                  
                  <Button className="mt-4">
                    Enregistrer les Paramètres
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
