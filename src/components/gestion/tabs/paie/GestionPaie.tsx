
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Printer, Download, FileText, Plus, Edit, Trash2, ChevronDown } from "lucide-react";
import { Client } from "@/types/client";
import { PayrollCalculator } from "./PayrollCalculator";
import { formatMoney } from "./utils";
import { Employee, PayrollItem } from "./types";
import { useToast } from "@/components/ui/use-toast";

interface GestionPaieProps {
  client: Client;
}

export function GestionPaie({ client }: GestionPaieProps) {
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [reportType, setReportType] = useState<string>("monthly");
  const [reportPeriod, setReportPeriod] = useState<string>("1");
  const [showReport, setShowReport] = useState(false);
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [isPayslipDialogOpen, setIsPayslipDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollItem | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrollData, setPayrollData] = useState<PayrollItem[]>([]);
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    firstname: "",
    lastname: "",
    position: "",
    department: "",
    baseSalary: 0,
    hireDate: new Date().toISOString().split('T')[0]
  });

  // Charger les données initiales (simulées)
  useEffect(() => {
    // Données employés
    const initialEmployees = [
      { id: 1, firstname: "Jean", lastname: "Dupont", department: "Direction", position: "Directeur", baseSalary: 450000, hireDate: "2023-01-15" },
      { id: 2, firstname: "Sophie", lastname: "Martin", department: "Finance", position: "Comptable", baseSalary: 380000, hireDate: "2023-03-01" },
      { id: 3, firstname: "Pierre", lastname: "Leroy", department: "Ventes", position: "Commercial", baseSalary: 320000, hireDate: "2023-06-10" },
      { id: 4, firstname: "Marie", lastname: "Dubois", department: "Administration", position: "Assistante", baseSalary: 280000, hireDate: "2023-08-22" },
      { id: 5, firstname: "Paul", lastname: "Moreau", department: "Production", position: "Technicien", baseSalary: 350000, hireDate: "2022-11-05" }
    ] as Employee[];
    setEmployees(initialEmployees);

    // Données de paie
    const initialPayrollData = [
      { id: 1, employeeId: 1, month: 1, year: 2025, grossSalary: 450000, cnpsEmployee: 18900, irpp: 25000, netSalary: 406100 },
      { id: 2, employeeId: 2, month: 1, year: 2025, grossSalary: 380000, cnpsEmployee: 15960, irpp: 19000, netSalary: 345040 },
      { id: 3, employeeId: 3, month: 1, year: 2025, grossSalary: 320000, cnpsEmployee: 13440, irpp: 15000, netSalary: 291560 },
      { id: 4, employeeId: 4, month: 1, year: 2025, grossSalary: 280000, cnpsEmployee: 11760, irpp: 12000, netSalary: 256240 },
      { id: 5, employeeId: 5, month: 1, year: 2025, grossSalary: 350000, cnpsEmployee: 14700, irpp: 18000, netSalary: 317300 }
    ] as PayrollItem[];
    setPayrollData(initialPayrollData);
  }, []);

  // Convertir le mois en texte
  const getMonthName = (monthNumber: number) => {
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return monthNames[monthNumber - 1];
  };

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

  // Générer la paie
  const handleGeneratePayroll = () => {
    const month = parseInt(selectedMonth) + 1;
    const year = parseInt(selectedYear);
    const calculator = new PayrollCalculator();
    
    // Vérifier si la paie existe déjà pour ce mois
    const existingPayroll = payrollData.some(
      item => item.month === month && item.year === year
    );
    
    if (existingPayroll) {
      toast({
        title: "Paie déjà générée",
        description: `La paie pour ${getMonthName(month)} ${year} existe déjà.`,
        variant: "destructive"
      });
      return;
    }
    
    // Générer la nouvelle paie
    const newPayrollData = employees.map(employee => {
      return calculator.calculatePayroll(employee, month, year);
    });
    
    setPayrollData(prev => [...prev, ...newPayrollData]);
    
    toast({
      title: "Paie générée",
      description: `La paie pour ${getMonthName(month)} ${year} a été générée avec succès.`,
      variant: "default"
    });
  };

  // Générer le rapport
  const generateReport = () => {
    setShowReport(true);
    
    toast({
      title: "Rapport généré",
      description: `Le rapport a été généré avec succès.`,
      variant: "default"
    });
  };
  
  // Ajouter un nouvel employé
  const handleAddEmployee = () => {
    if (!newEmployee.firstname || !newEmployee.lastname || !newEmployee.position || !newEmployee.baseSalary) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    const employeeToAdd = {
      ...newEmployee,
      id: newId
    } as Employee;
    
    setEmployees(prev => [...prev, employeeToAdd]);
    setIsEmployeeDialogOpen(false);
    setNewEmployee({
      firstname: "",
      lastname: "",
      position: "",
      department: "",
      baseSalary: 0,
      hireDate: new Date().toISOString().split('T')[0]
    });
    
    toast({
      title: "Employé ajouté",
      description: `L'employé ${employeeToAdd.firstname} ${employeeToAdd.lastname} a été ajouté avec succès.`,
      variant: "default"
    });
  };

  // Supprimer un employé
  const handleDeleteEmployee = (id: number) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    setPayrollData(prev => prev.filter(item => item.employeeId !== id));
    
    toast({
      title: "Employé supprimé",
      description: "L'employé a été supprimé avec succès.",
      variant: "default"
    });
  };

  // Voir le bulletin de paie
  const handleViewPayslip = (payroll: PayrollItem) => {
    setSelectedPayroll(payroll);
    setSelectedEmployee(employees.find(emp => emp.id === payroll.employeeId) || null);
    setIsPayslipDialogOpen(true);
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
            <TabsTrigger value="employees">Employés</TabsTrigger>
            <TabsTrigger value="payslips">Bulletins de paie</TabsTrigger>
            <TabsTrigger value="reports">Rapports et déclarations</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>
          
          {/* Tab Content: Traitement de paie */}
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
              
              <Button className="mt-8" onClick={handleGeneratePayroll}>
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
                    {payrollData
                      .filter(item => item.month === parseInt(selectedMonth) + 1 && item.year === parseInt(selectedYear))
                      .map(item => {
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
                              <Button variant="outline" size="sm" className="mr-1" onClick={() => handleViewPayslip(item)}>
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
          
          {/* Tab Content: Employés */}
          <TabsContent value="employees" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Liste des employés</h3>
              <Button onClick={() => setIsEmployeeDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un employé
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Date d'embauche</TableHead>
                  <TableHead>Salaire de base</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map(employee => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.lastname}</TableCell>
                    <TableCell>{employee.firstname}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{formatDate(employee.hireDate)}</TableCell>
                    <TableCell>{formatMoney(employee.baseSalary)} FCFA</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-1">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteEmployee(employee.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          {/* Tab Content: Bulletins de paie */}
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
                          <Button variant="outline" size="sm" className="mr-1" onClick={() => handleViewPayslip(item)}>
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
          
          {/* Tab Content: Rapports et déclarations */}
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
                    {payrollData
                      .filter(item => item.month === parseInt(reportPeriod))
                      .map(item => {
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
          
          {/* Tab Content: Paramètres */}
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
                  
                  <Button>
                    Enregistrer les informations
                  </Button>
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
                  
                  <Button>
                    Enregistrer les Paramètres
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Dialog pour ajouter/modifier un employé */}
      <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un employé</DialogTitle>
            <DialogDescription>
              Entrez les informations de l'employé ci-dessous
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee-lastname">Nom</Label>
                <Input 
                  id="employee-lastname"
                  value={newEmployee.lastname || ""}
                  onChange={(e) => setNewEmployee({...newEmployee, lastname: e.target.value})}
                  placeholder="Nom de famille"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-firstname">Prénom</Label>
                <Input 
                  id="employee-firstname"
                  value={newEmployee.firstname || ""}
                  onChange={(e) => setNewEmployee({...newEmployee, firstname: e.target.value})}
                  placeholder="Prénom"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee-position">Poste</Label>
                <Input 
                  id="employee-position"
                  value={newEmployee.position || ""}
                  onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                  placeholder="Intitulé du poste"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-department">Département</Label>
                <Input 
                  id="employee-department"
                  value={newEmployee.department || ""}
                  onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                  placeholder="Département"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee-hire-date">Date d'embauche</Label>
                <Input 
                  id="employee-hire-date"
                  type="date"
                  value={newEmployee.hireDate || ""}
                  onChange={(e) => setNewEmployee({...newEmployee, hireDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-base-salary">Salaire de base (FCFA)</Label>
                <Input 
                  id="employee-base-salary"
                  type="number"
                  value={newEmployee.baseSalary || 0}
                  onChange={(e) => setNewEmployee({...newEmployee, baseSalary: Number(e.target.value)})}
                  placeholder="Montant en FCFA"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEmployeeDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleAddEmployee}>Ajouter</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Dialog pour afficher le bulletin de paie */}
      <Dialog open={isPayslipDialogOpen} onOpenChange={setIsPayslipDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Bulletin de paie</DialogTitle>
            <DialogDescription>
              {selectedEmployee && selectedPayroll && (
                `${selectedEmployee.firstname} ${selectedEmployee.lastname} - ${getMonthName(selectedPayroll.month)} ${selectedPayroll.year}`
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmployee && selectedPayroll && (
            <div className="payslip bg-white border border-gray-200 p-6 rounded-lg">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold">{client.nom || client.raisonsociale}</h3>
                <p className="text-sm text-gray-500">{client.adresse?.ville || "Yaoundé, Cameroun"}</p>
                <div className="text-lg font-bold mt-4 border-t border-b py-2">
                  BULLETIN DE PAIE
                </div>
                <p className="text-sm mt-2">Période: {getMonthName(selectedPayroll.month)} {selectedPayroll.year}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-bold mb-2">Employé</h4>
                  <p><span className="font-medium">Nom:</span> {selectedEmployee.lastname} {selectedEmployee.firstname}</p>
                  <p><span className="font-medium">Poste:</span> {selectedEmployee.position}</p>
                  <p><span className="font-medium">Département:</span> {selectedEmployee.department}</p>
                  <p><span className="font-medium">Date d'embauche:</span> {formatDate(selectedEmployee.hireDate)}</p>
                </div>
                
                <div>
                  <h4 className="font-bold mb-2">Identifiants</h4>
                  <p><span className="font-medium">N° CNPS:</span> {selectedEmployee.cnpsNumber || "Non renseigné"}</p>
                  <p><span className="font-medium">N° Employé:</span> {selectedEmployee.id}</p>
                </div>
              </div>
              
              <div className="border-t border-b py-4 space-y-2">
                <div className="grid grid-cols-2">
                  <div className="font-medium">Salaire de base</div>
                  <div className="text-right">{formatMoney(selectedPayroll.grossSalary)} FCFA</div>
                </div>
                
                <div className="grid grid-cols-2">
                  <div className="font-medium">Cotisation CNPS (4.2%)</div>
                  <div className="text-right">-{formatMoney(selectedPayroll.cnpsEmployee)} FCFA</div>
                </div>
                
                <div className="grid grid-cols-2">
                  <div className="font-medium">Impôt sur le revenu (IRPP)</div>
                  <div className="text-right">-{formatMoney(selectedPayroll.irpp)} FCFA</div>
                </div>
                
                <div className="grid grid-cols-2 font-bold pt-2 border-t">
                  <div>Net à payer</div>
                  <div className="text-right">{formatMoney(selectedPayroll.netSalary)} FCFA</div>
                </div>
              </div>
              
              <div className="mt-6 text-center text-sm text-gray-500">
                Document généré le {formatDate(new Date().toISOString())}
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 mt-4">
            <Button>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer le bulletin
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
