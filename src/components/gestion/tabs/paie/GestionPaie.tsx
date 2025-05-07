
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Printer, ChevronDown, Info } from "lucide-react";
import { Client } from "@/types/client";
import { Label } from "@/components/ui/label";
import { PayrollCalculator } from "./PayrollCalculator";
import { formatMoney, formatDate } from "./utils";
import { PayrollDetailsCard } from "./PayrollDetailsCard";
import { PayrollCalculationSettings } from "./PayrollCalculationSettings";
import { EmployerChargesCard } from "./EmployerChargesCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface GestionPaieProps {
  client: Client;
}

export function GestionPaie({ client }: GestionPaieProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [reportType, setReportType] = useState<string>("monthly");
  const [reportPeriod, setReportPeriod] = useState<string>("1");
  const [showReport, setShowReport] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  
  // Données de paie fictives avec les nouvelles retenues
  const payrollData = [
    { 
      id: 1, 
      employeeId: 1, 
      month: 1, 
      year: 2025, 
      grossSalary: 450000, 
      cnpsEmployee: PayrollCalculator.calculateCNPSEmployee(450000), 
      irpp: PayrollCalculator.calculateIRPP(450000),
      cac: PayrollCalculator.calculateCAC(PayrollCalculator.calculateIRPP(450000)),
      tdl: PayrollCalculator.calculateTDL(450000),
      rav: PayrollCalculator.calculateRAV(450000),
      cfc: PayrollCalculator.calculateCFCEmployee(450000),
      netSalary: PayrollCalculator.calculateNetSalary(450000)
    },
    { 
      id: 2, 
      employeeId: 2, 
      month: 1, 
      year: 2025, 
      grossSalary: 380000, 
      cnpsEmployee: PayrollCalculator.calculateCNPSEmployee(380000), 
      irpp: PayrollCalculator.calculateIRPP(380000),
      cac: PayrollCalculator.calculateCAC(PayrollCalculator.calculateIRPP(380000)),
      tdl: PayrollCalculator.calculateTDL(380000),
      rav: PayrollCalculator.calculateRAV(380000),
      cfc: PayrollCalculator.calculateCFCEmployee(380000),
      netSalary: PayrollCalculator.calculateNetSalary(380000)
    },
    { 
      id: 3, 
      employeeId: 3, 
      month: 1, 
      year: 2025, 
      grossSalary: 320000, 
      cnpsEmployee: PayrollCalculator.calculateCNPSEmployee(320000), 
      irpp: PayrollCalculator.calculateIRPP(320000),
      cac: PayrollCalculator.calculateCAC(PayrollCalculator.calculateIRPP(320000)),
      tdl: PayrollCalculator.calculateTDL(320000),
      rav: PayrollCalculator.calculateRAV(320000),
      cfc: PayrollCalculator.calculateCFCEmployee(320000),
      netSalary: PayrollCalculator.calculateNetSalary(320000)
    },
    { 
      id: 4, 
      employeeId: 4, 
      month: 1, 
      year: 2025, 
      grossSalary: 280000, 
      cnpsEmployee: PayrollCalculator.calculateCNPSEmployee(280000), 
      irpp: PayrollCalculator.calculateIRPP(280000),
      cac: PayrollCalculator.calculateCAC(PayrollCalculator.calculateIRPP(280000)),
      tdl: PayrollCalculator.calculateTDL(280000),
      rav: PayrollCalculator.calculateRAV(280000),
      cfc: PayrollCalculator.calculateCFCEmployee(280000),
      netSalary: PayrollCalculator.calculateNetSalary(280000)
    },
    { 
      id: 5, 
      employeeId: 5, 
      month: 1, 
      year: 2025, 
      grossSalary: 350000, 
      cnpsEmployee: PayrollCalculator.calculateCNPSEmployee(350000), 
      irpp: PayrollCalculator.calculateIRPP(350000),
      cac: PayrollCalculator.calculateCAC(PayrollCalculator.calculateIRPP(350000)),
      tdl: PayrollCalculator.calculateTDL(350000),
      rav: PayrollCalculator.calculateRAV(350000),
      cfc: PayrollCalculator.calculateCFCEmployee(350000),
      netSalary: PayrollCalculator.calculateNetSalary(350000)
    }
  ];

  // Données employés
  const employees = [
    { id: 1, firstname: "Jean", lastname: "Dupont", department: "Direction" },
    { id: 2, firstname: "Sophie", lastname: "Martin", department: "Finance" },
    { id: 3, firstname: "Pierre", lastname: "Leroy", department: "Ventes" },
    { id: 4, firstname: "Marie", lastname: "Dubois", department: "Administration" },
    { id: 5, firstname: "Paul", lastname: "Moreau", department: "Production" }
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
    let totalCAC = 0;
    let totalTDL = 0;
    let totalRAV = 0;
    let totalCFC = 0;
    let totalNet = 0;
    
    payrollData.forEach(item => {
      totalGross += item.grossSalary;
      totalCNPS += item.cnpsEmployee;
      totalIRPP += item.irpp;
      totalCAC += item.cac;
      totalTDL += item.tdl;
      totalRAV += item.rav;
      totalCFC += item.cfc;
      totalNet += item.netSalary;
    });
    
    return { 
      totalGross, 
      totalCNPS, 
      totalIRPP, 
      totalCAC, 
      totalTDL, 
      totalRAV, 
      totalCFC,
      totalNet 
    };
  };

  const totals = calculateTotals();
  
  // Calculer les charges patronales
  const calculateEmployerCharges = () => {
    let totalFNE = 0;
    let totalCFCEmployer = 0;
    let totalCNPSEmployer = 0;
    
    payrollData.forEach(item => {
      totalFNE += (item.grossSalary * PayrollCalculator.CHARGES_SOCIALES.fne) / 100;
      totalCFCEmployer += (item.grossSalary * PayrollCalculator.CHARGES_SOCIALES.cfcEmployeur) / 100;
      totalCNPSEmployer += PayrollCalculator.calculateCNPSEmployer(item.grossSalary);
    });
    
    return {
      totalFNE: Math.round(totalFNE),
      totalCFCEmployer: Math.round(totalCFCEmployer),
      totalCNPSEmployer: Math.round(totalCNPSEmployer)
    };
  };
  
  const employerCharges = calculateEmployerCharges();

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
                      <TableHead>IRPP+CAC</TableHead>
                      <TableHead>Autres</TableHead>
                      <TableHead>Salaire Net</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollData.map(item => {
                      const employee = employees.find(emp => emp.id === item.employeeId);
                      if (!employee) return null;
                      
                      const autresRetenues = item.tdl + item.rav + item.cfc;
                      
                      return (
                        <TableRow key={item.id}>
                          <TableCell>{employee.lastname} {employee.firstname}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>{formatMoney(item.grossSalary)} FCFA</TableCell>
                          <TableCell>{formatMoney(item.cnpsEmployee)} FCFA</TableCell>
                          <TableCell>{formatMoney(item.irpp + item.cac)} FCFA</TableCell>
                          <TableCell>{formatMoney(autresRetenues)} FCFA</TableCell>
                          <TableCell>{formatMoney(item.netSalary)} FCFA</TableCell>
                          <TableCell className="text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setSelectedEmployee(item.employeeId)}
                                  className="mr-1"
                                >
                                  <Info className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    Détails de la paie - {employee.lastname} {employee.firstname}
                                  </DialogTitle>
                                </DialogHeader>
                                
                                <PayrollDetailsCard
                                  employeeId={item.employeeId}
                                  grossSalary={item.grossSalary}
                                  cnpsEmployee={item.cnpsEmployee}
                                  irpp={item.irpp}
                                  cac={item.cac}
                                  tdl={item.tdl}
                                  rav={item.rav}
                                  cfc={item.cfc}
                                  netSalary={item.netSalary}
                                />
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
                      );
                    })}
                  </TableBody>
                  <tfoot className="bg-primary text-white">
                    <tr>
                      <th colSpan={2} className="p-2">TOTAL</th>
                      <th className="p-2">{formatMoney(totals.totalGross)} FCFA</th>
                      <th className="p-2">{formatMoney(totals.totalCNPS)} FCFA</th>
                      <th className="p-2">{formatMoney(totals.totalIRPP + totals.totalCAC)} FCFA</th>
                      <th className="p-2">{formatMoney(totals.totalTDL + totals.totalRAV + totals.totalCFC)} FCFA</th>
                      <th className="p-2">{formatMoney(totals.totalNet)} FCFA</th>
                      <th></th>
                    </tr>
                  </tfoot>
                </Table>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <EmployerChargesCard
                totalGrossSalary={totals.totalGross}
                cnpsEmployer={employerCharges.totalCNPSEmployer}
                fne={employerCharges.totalFNE}
                cfcEmployer={employerCharges.totalCFCEmployer}
              />
            </div>
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
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-sm font-medium text-gray-500 mb-2">Total Brut</div>
                    <div className="text-lg font-bold">{formatMoney(totals.totalGross)} FCFA</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-sm font-medium text-gray-500 mb-2">Total CNPS</div>
                    <div className="text-lg font-bold">{formatMoney(totals.totalCNPS)} FCFA</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-sm font-medium text-gray-500 mb-2">Total IRPP+CAC</div>
                    <div className="text-lg font-bold">{formatMoney(totals.totalIRPP + totals.totalCAC)} FCFA</div>
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
                      <TableHead>CAC</TableHead>
                      <TableHead>TDL</TableHead>
                      <TableHead>RAV</TableHead>
                      <TableHead>CFC</TableHead>
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
                          <TableCell>{formatMoney(item.grossSalary)}</TableCell>
                          <TableCell>{formatMoney(item.cnpsEmployee)}</TableCell>
                          <TableCell>{formatMoney(item.irpp)}</TableCell>
                          <TableCell>{formatMoney(item.cac)}</TableCell>
                          <TableCell>{formatMoney(item.tdl)}</TableCell>
                          <TableCell>{formatMoney(item.rav)}</TableCell>
                          <TableCell>{formatMoney(item.cfc)}</TableCell>
                          <TableCell>{formatMoney(item.netSalary)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  <tfoot className="bg-primary text-white">
                    <tr>
                      <th colSpan={2} className="p-2">TOTAL</th>
                      <th className="p-2">{formatMoney(totals.totalGross)}</th>
                      <th className="p-2">{formatMoney(totals.totalCNPS)}</th>
                      <th className="p-2">{formatMoney(totals.totalIRPP)}</th>
                      <th className="p-2">{formatMoney(totals.totalCAC)}</th>
                      <th className="p-2">{formatMoney(totals.totalTDL)}</th>
                      <th className="p-2">{formatMoney(totals.totalRAV)}</th>
                      <th className="p-2">{formatMoney(totals.totalCFC)}</th>
                      <th className="p-2">{formatMoney(totals.totalNet)}</th>
                    </tr>
                  </tfoot>
                </Table>
                
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-4">Charges patronales</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-sm font-medium text-gray-500 mb-2">CNPS Employeur</div>
                      <div className="text-lg font-bold">{formatMoney(employerCharges.totalCNPSEmployer)} FCFA</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-sm font-medium text-gray-500 mb-2">FNE (1%)</div>
                      <div className="text-lg font-bold">{formatMoney(employerCharges.totalFNE)} FCFA</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-sm font-medium text-gray-500 mb-2">CFC Employeur (1.5%)</div>
                      <div className="text-lg font-bold">{formatMoney(employerCharges.totalCFCEmployer)} FCFA</div>
                    </div>
                  </div>
                </div>
                
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
              
              <PayrollCalculationSettings 
                cnpsEmployeeRate={4.2}
                cnpsEmployerRate={12.95}
                cfcEmployeeRate={1.0}
                cfcEmployerRate={1.5}
                fneRate={1.0}
                cacRate={10.0}
                onSave={() => {
                  // Logic to save calculation settings
                }}
              />
            </div>
            
            <div className="mt-8 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Barèmes fiscaux</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-md font-semibold mb-2">Barème RAV (Redevance Audiovisuelle)</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Salaire Brut Mensuel (FCFA)</TableHead>
                          <TableHead>Montant RAV (FCFA)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {PayrollCalculator.CHARGES_FISCALES.baremesRAV.map((tranche, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {tranche.min.toLocaleString()} à {tranche.max === Infinity ? "+ ∞" : tranche.max.toLocaleString()}
                            </TableCell>
                            <TableCell>{tranche.montant.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-semibold mb-2">Barème TDL (Taxe de Développement Local)</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Salaire Brut Mensuel (FCFA)</TableHead>
                          <TableHead>Montant TDL Mensuel (FCFA)</TableHead>
                          <TableHead>Montant TDL Annuel (FCFA)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {PayrollCalculator.CHARGES_FISCALES.baremesTDL.map((tranche, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {tranche.min.toLocaleString()} à {tranche.max === Infinity ? "+ ∞" : tranche.max.toLocaleString()}
                            </TableCell>
                            <TableCell>{tranche.montant.toLocaleString()}</TableCell>
                            <TableCell>{(tranche.montant * 12).toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
