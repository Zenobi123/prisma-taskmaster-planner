
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, FileText, Edit, Trash2, Calendar, Download } from "lucide-react";
import { Client } from "@/types/client";
import { useToast } from "@/components/ui/use-toast";

interface GestionRHProps {
  client: Client;
}

interface Employee {
  id: number;
  nom: string;
  prenom: string;
  poste: string;
  dateEmbauche: string;
  statut: "Actif" | "Congé" | "Arrêt maladie" | "Inactif";
  departement: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  dateNaissance?: string;
  genre?: "Homme" | "Femme";
  typeCni?: string;
  numeroCni?: string;
}

interface Contract {
  id: number;
  type: "CDI" | "CDD" | "Stage" | "Prestation";
  employeId: number;
  employe: string;
  debut: string;
  fin: string;
  statut: "En cours" | "Terminé" | "Rompu";
  salaire: number;
}

interface Leave {
  id: number;
  employeId: number;
  employe: string;
  type: "Congés payés" | "Congé maladie" | "Congé sans solde" | "Congé maternité" | "Congé exceptionnel";
  debut: string;
  fin: string;
  statut: "À venir" | "En cours" | "Terminé" | "Annulé";
  jours: number;
  motif?: string;
}

export function GestionRH({ client }: GestionRHProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    nom: "",
    prenom: "",
    poste: "",
    departement: "",
    statut: "Actif",
    dateEmbauche: new Date().toISOString().split('T')[0]
  });
  
  const [newContract, setNewContract] = useState<Partial<Contract>>({
    type: "CDI",
    debut: new Date().toISOString().split('T')[0],
    fin: "",
    statut: "En cours",
    salaire: 0
  });
  
  const [newLeave, setNewLeave] = useState<Partial<Leave>>({
    type: "Congés payés",
    debut: new Date().toISOString().split('T')[0],
    fin: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    statut: "À venir",
    jours: 14,
    motif: ""
  });
  
  // Données d'exemple pour les employés
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, nom: "Dupont", prenom: "Jean", poste: "Directeur", dateEmbauche: "2022-01-12", statut: "Actif", departement: "Direction" },
    { id: 2, nom: "Martin", prenom: "Sophie", poste: "Comptable", dateEmbauche: "2022-03-05", statut: "Actif", departement: "Finance" },
    { id: 3, nom: "Leroy", prenom: "Pierre", poste: "Commercial", dateEmbauche: "2023-05-18", statut: "Actif", departement: "Ventes" },
    { id: 4, nom: "Dubois", prenom: "Marie", poste: "Assistante", dateEmbauche: "2023-08-22", statut: "Congé", departement: "Administration" },
    { id: 5, nom: "Moreau", prenom: "Paul", poste: "Technicien", dateEmbauche: "2021-11-10", statut: "Actif", departement: "Production" }
  ]);

  // Données d'exemple pour les contrats
  const [contracts, setContracts] = useState<Contract[]>([
    { id: 1, type: "CDI", employeId: 1, employe: "Dupont Jean", debut: "2022-01-12", fin: "", statut: "En cours", salaire: 450000 },
    { id: 2, type: "CDI", employeId: 2, employe: "Martin Sophie", debut: "2022-03-05", fin: "", statut: "En cours", salaire: 380000 },
    { id: 3, type: "CDD", employeId: 3, employe: "Leroy Pierre", debut: "2023-05-18", fin: "2025-05-17", statut: "En cours", salaire: 320000 },
    { id: 4, type: "CDI", employeId: 4, employe: "Dubois Marie", debut: "2023-08-22", fin: "", statut: "En cours", salaire: 280000 },
    { id: 5, type: "CDI", employeId: 5, employe: "Moreau Paul", debut: "2021-11-10", fin: "", statut: "En cours", salaire: 350000 }
  ]);
  
  // Données d'exemple pour les congés
  const [leaves, setLeaves] = useState<Leave[]>([
    { id: 1, employeId: 4, employe: "Dubois Marie", type: "Congés payés", debut: "2025-01-15", fin: "2025-01-29", statut: "En cours", jours: 14 },
    { id: 2, employeId: 2, employe: "Martin Sophie", type: "Congé maladie", debut: "2024-12-10", fin: "2024-12-15", statut: "Terminé", jours: 5, motif: "Grippe" },
    { id: 3, employeId: 5, employe: "Moreau Paul", type: "Congés payés", debut: "2025-02-01", fin: "2025-02-15", statut: "À venir", jours: 14 }
  ]);

  // Filtrer les employés en fonction du terme de recherche
  const filteredEmployees = employees.filter(emp =>
    emp.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.departement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrer les contrats en fonction du terme de recherche
  const filteredContracts = contracts.filter(contract =>
    contract.employe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filtrer les congés en fonction du terme de recherche
  const filteredLeaves = leaves.filter(leave =>
    leave.employe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (leave.motif && leave.motif.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Ajouter un employé
  const handleAddEmployee = () => {
    if (!newEmployee.nom || !newEmployee.prenom || !newEmployee.poste) {
      toast({
        title: "Champs obligatoires",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    const newId = Math.max(...employees.map(e => e.id)) + 1;
    const employeeToAdd = {
      ...newEmployee,
      id: newId,
      statut: newEmployee.statut || "Actif"
    } as Employee;
    
    setEmployees([...employees, employeeToAdd]);
    setIsEmployeeDialogOpen(false);
    setNewEmployee({
      nom: "",
      prenom: "",
      poste: "",
      departement: "",
      statut: "Actif",
      dateEmbauche: new Date().toISOString().split('T')[0]
    });
    
    toast({
      title: "Employé ajouté",
      description: `${employeeToAdd.prenom} ${employeeToAdd.nom} a été ajouté avec succès`,
      variant: "default"
    });
  };
  
  // Ajouter un contrat
  const handleAddContract = () => {
    if (!newContract.employeId || !newContract.debut) {
      toast({
        title: "Champs obligatoires",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    const employee = employees.find(e => e.id === newContract.employeId);
    if (!employee) {
      toast({
        title: "Employé introuvable",
        description: "L'employé sélectionné n'existe pas",
        variant: "destructive"
      });
      return;
    }
    
    const newId = Math.max(...contracts.map(c => c.id)) + 1;
    const contractToAdd = {
      ...newContract,
      id: newId,
      employe: `${employee.nom} ${employee.prenom}`,
      statut: newContract.statut || "En cours",
      salaire: newContract.salaire || 0
    } as Contract;
    
    setContracts([...contracts, contractToAdd]);
    setIsContractDialogOpen(false);
    setNewContract({
      type: "CDI",
      debut: new Date().toISOString().split('T')[0],
      fin: "",
      statut: "En cours",
      salaire: 0
    });
    
    toast({
      title: "Contrat ajouté",
      description: `Le contrat de ${employee.prenom} ${employee.nom} a été ajouté avec succès`,
      variant: "default"
    });
  };
  
  // Ajouter un congé
  const handleAddLeave = () => {
    if (!newLeave.employeId || !newLeave.debut || !newLeave.fin) {
      toast({
        title: "Champs obligatoires",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    const employee = employees.find(e => e.id === newLeave.employeId);
    if (!employee) {
      toast({
        title: "Employé introuvable",
        description: "L'employé sélectionné n'existe pas",
        variant: "destructive"
      });
      return;
    }
    
    // Calculer le nombre de jours entre début et fin
    const startDate = new Date(newLeave.debut);
    const endDate = new Date(newLeave.fin);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 car inclusif
    
    const newId = Math.max(...(leaves.length > 0 ? leaves.map(l => l.id) : [0])) + 1;
    const leaveToAdd = {
      ...newLeave,
      id: newId,
      employe: `${employee.nom} ${employee.prenom}`,
      jours: diffDays,
      statut: newLeave.statut || "À venir"
    } as Leave;
    
    setLeaves([...leaves, leaveToAdd]);
    setIsLeaveDialogOpen(false);
    setNewLeave({
      type: "Congés payés",
      debut: new Date().toISOString().split('T')[0],
      fin: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      statut: "À venir",
      jours: 14,
      motif: ""
    });
    
    // Mettre à jour le statut de l'employé si le congé commence aujourd'hui
    if (new Date(leaveToAdd.debut) <= new Date() && new Date(leaveToAdd.fin) >= new Date()) {
      const updatedEmployees = employees.map(emp => {
        if (emp.id === leaveToAdd.employeId) {
          return {...emp, statut: "Congé"};
        }
        return emp;
      });
      setEmployees(updatedEmployees);
    }
    
    toast({
      title: "Congé ajouté",
      description: `Le congé de ${employee.prenom} ${employee.nom} a été ajouté avec succès`,
      variant: "default"
    });
  };
  
  // Supprimer un employé
  const handleDeleteEmployee = (id: number) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    // Supprimer également les contrats et congés associés
    setContracts(contracts.filter(contract => contract.employeId !== id));
    setLeaves(leaves.filter(leave => leave.employeId !== id));
    
    toast({
      title: "Employé supprimé",
      description: "L'employé a été supprimé avec succès",
      variant: "default"
    });
  };
  
  // Supprimer un contrat
  const handleDeleteContract = (id: number) => {
    setContracts(contracts.filter(contract => contract.id !== id));
    
    toast({
      title: "Contrat supprimé",
      description: "Le contrat a été supprimé avec succès",
      variant: "default"
    });
  };
  
  // Supprimer un congé
  const handleDeleteLeave = (id: number) => {
    const leaveToDelete = leaves.find(leave => leave.id === id);
    setLeaves(leaves.filter(leave => leave.id !== id));
    
    // Mettre à jour le statut de l'employé si nécessaire
    if (leaveToDelete && leaveToDelete.statut === "En cours") {
      const hasOtherActiveLeaves = leaves.some(leave => 
        leave.id !== id && 
        leave.employeId === leaveToDelete.employeId && 
        leave.statut === "En cours"
      );
      
      if (!hasOtherActiveLeaves) {
        const updatedEmployees = employees.map(emp => {
          if (emp.id === leaveToDelete.employeId) {
            return {...emp, statut: "Actif"};
          }
          return emp;
        });
        setEmployees(updatedEmployees);
      }
    }
    
    toast({
      title: "Congé supprimé",
      description: "Le congé a été supprimé avec succès",
      variant: "default"
    });
  };
  
  // Formatter une date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Indéterminée";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ressources Humaines - {client.nom || client.raisonsociale}</CardTitle>
        <CardDescription>
          Gestion des employés, contrats et congés
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="employees">
          <TabsList>
            <TabsTrigger value="employees">Employés</TabsTrigger>
            <TabsTrigger value="contracts">Contrats</TabsTrigger>
            <TabsTrigger value="absences">Congés et absences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="employees" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un employé..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => setIsEmployeeDialogOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
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
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.nom}</TableCell>
                    <TableCell>{employee.prenom}</TableCell>
                    <TableCell>{employee.poste}</TableCell>
                    <TableCell>{employee.departement}</TableCell>
                    <TableCell>{formatDate(employee.dateEmbauche)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        employee.statut === "Actif" ? "bg-green-100 text-green-800" : 
                        employee.statut === "Congé" ? "bg-yellow-100 text-yellow-800" :
                        employee.statut === "Arrêt maladie" ? "bg-orange-100 text-orange-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {employee.statut}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-1" onClick={() => {
                        setSelectedEmployee(employee);
                        setNewEmployee(employee);
                      }}>
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
          
          <TabsContent value="contracts" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un contrat..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => setIsContractDialogOpen(true)}>
                <FileText className="mr-2 h-4 w-4" />
                Nouveau contrat
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Employé</TableHead>
                  <TableHead>Date de début</TableHead>
                  <TableHead>Date de fin</TableHead>
                  <TableHead>Salaire</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>{contract.type}</TableCell>
                    <TableCell>{contract.employe}</TableCell>
                    <TableCell>{formatDate(contract.debut)}</TableCell>
                    <TableCell>{contract.fin ? formatDate(contract.fin) : "Indéterminée"}</TableCell>
                    <TableCell>{contract.salaire.toLocaleString()} FCFA</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        contract.statut === "En cours" ? "bg-green-100 text-green-800" : 
                        contract.statut === "Terminé" ? "bg-blue-100 text-blue-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {contract.statut}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-1">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteContract(contract.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="absences" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un congé..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => setIsLeaveDialogOpen(true)}>
                <Calendar className="mr-2 h-4 w-4" />
                Nouveau congé
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date de début</TableHead>
                  <TableHead>Date de fin</TableHead>
                  <TableHead>Jours</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Motif</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaves.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>{leave.employe}</TableCell>
                    <TableCell>{leave.type}</TableCell>
                    <TableCell>{formatDate(leave.debut)}</TableCell>
                    <TableCell>{formatDate(leave.fin)}</TableCell>
                    <TableCell>{leave.jours}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        leave.statut === "En cours" ? "bg-green-100 text-green-800" : 
                        leave.statut === "À venir" ? "bg-blue-100 text-blue-800" :
                        leave.statut === "Terminé" ? "bg-gray-100 text-gray-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {leave.statut}
                      </span>
                    </TableCell>
                    <TableCell>{leave.motif || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-1">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteLeave(leave.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
        
        {/* Modal pour ajouter un employé */}
        <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter un employé</DialogTitle>
              <DialogDescription>
                Entrez les informations de l'employé
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="employee-lastname">Nom</Label>
                <Input 
                  id="employee-lastname" 
                  value={newEmployee.nom || ""}
                  onChange={(e) => setNewEmployee({...newEmployee, nom: e.target.value})}
                  placeholder="Nom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-firstname">Prénom</Label>
                <Input 
                  id="employee-firstname" 
                  value={newEmployee.prenom || ""}
                  onChange={(e) => setNewEmployee({...newEmployee, prenom: e.target.value})}
                  placeholder="Prénom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-position">Poste</Label>
                <Input 
                  id="employee-position" 
                  value={newEmployee.poste || ""}
                  onChange={(e) => setNewEmployee({...newEmployee, poste: e.target.value})}
                  placeholder="Poste occupé"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-department">Département</Label>
                <Input 
                  id="employee-department" 
                  value={newEmployee.departement || ""}
                  onChange={(e) => setNewEmployee({...newEmployee, departement: e.target.value})}
                  placeholder="Département"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-hire-date">Date d'embauche</Label>
                <Input 
                  id="employee-hire-date" 
                  type="date" 
                  value={newEmployee.dateEmbauche || ""}
                  onChange={(e) => setNewEmployee({...newEmployee, dateEmbauche: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-status">Statut</Label>
                <Select 
                  value={newEmployee.statut} 
                  onValueChange={(value: "Actif" | "Congé" | "Arrêt maladie" | "Inactif") => 
                    setNewEmployee({...newEmployee, statut: value})
                  }
                >
                  <SelectTrigger id="employee-status">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Actif">Actif</SelectItem>
                    <SelectItem value="Congé">Congé</SelectItem>
                    <SelectItem value="Arrêt maladie">Arrêt maladie</SelectItem>
                    <SelectItem value="Inactif">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-email">Email</Label>
                <Input 
                  id="employee-email" 
                  type="email" 
                  value={newEmployee.email || ""}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  placeholder="Email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-phone">Téléphone</Label>
                <Input 
                  id="employee-phone" 
                  value={newEmployee.telephone || ""}
                  onChange={(e) => setNewEmployee({...newEmployee, telephone: e.target.value})}
                  placeholder="Téléphone"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEmployeeDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleAddEmployee}>Enregistrer</Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Modal pour ajouter un contrat */}
        <Dialog open={isContractDialogOpen} onOpenChange={setIsContractDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Nouveau contrat</DialogTitle>
              <DialogDescription>
                Créer un nouveau contrat pour un employé
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="contract-employee">Employé</Label>
                <Select 
                  value={newContract.employeId?.toString()} 
                  onValueChange={(value) => setNewContract({...newContract, employeId: parseInt(value)})}
                >
                  <SelectTrigger id="contract-employee">
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(emp => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>
                        {emp.prenom} {emp.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contract-type">Type de contrat</Label>
                <Select 
                  value={newContract.type} 
                  onValueChange={(value: "CDI" | "CDD" | "Stage" | "Prestation") => 
                    setNewContract({...newContract, type: value})
                  }
                >
                  <SelectTrigger id="contract-type">
                    <SelectValue placeholder="Type de contrat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDI">CDI</SelectItem>
                    <SelectItem value="CDD">CDD</SelectItem>
                    <SelectItem value="Stage">Stage</SelectItem>
                    <SelectItem value="Prestation">Prestation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contract-start-date">Date de début</Label>
                <Input 
                  id="contract-start-date" 
                  type="date" 
                  value={newContract.debut || ""}
                  onChange={(e) => setNewContract({...newContract, debut: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contract-end-date">Date de fin (si applicable)</Label>
                <Input 
                  id="contract-end-date" 
                  type="date" 
                  value={newContract.fin || ""}
                  onChange={(e) => setNewContract({...newContract, fin: e.target.value})}
                  disabled={newContract.type === "CDI"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contract-salary">Salaire mensuel (FCFA)</Label>
                <Input 
                  id="contract-salary" 
                  type="number" 
                  value={newContract.salaire || ""}
                  onChange={(e) => setNewContract({...newContract, salaire: parseInt(e.target.value)})}
                  placeholder="Montant en FCFA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contract-status">Statut</Label>
                <Select 
                  value={newContract.statut} 
                  onValueChange={(value: "En cours" | "Terminé" | "Rompu") => 
                    setNewContract({...newContract, statut: value})
                  }
                >
                  <SelectTrigger id="contract-status">
                    <SelectValue placeholder="Statut du contrat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="Terminé">Terminé</SelectItem>
                    <SelectItem value="Rompu">Rompu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsContractDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleAddContract}>Enregistrer</Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Modal pour ajouter un congé */}
        <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Nouveau congé</DialogTitle>
              <DialogDescription>
                Enregistrer un congé pour un employé
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="leave-employee">Employé</Label>
                <Select 
                  value={newLeave.employeId?.toString()} 
                  onValueChange={(value) => setNewLeave({...newLeave, employeId: parseInt(value)})}
                >
                  <SelectTrigger id="leave-employee">
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(emp => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>
                        {emp.prenom} {emp.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="leave-type">Type de congé</Label>
                <Select 
                  value={newLeave.type} 
                  onValueChange={(value: "Congés payés" | "Congé maladie" | "Congé sans solde" | "Congé maternité" | "Congé exceptionnel") => 
                    setNewLeave({...newLeave, type: value})
                  }
                >
                  <SelectTrigger id="leave-type">
                    <SelectValue placeholder="Type de congé" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Congés payés">Congés payés</SelectItem>
                    <SelectItem value="Congé maladie">Congé maladie</SelectItem>
                    <SelectItem value="Congé sans solde">Congé sans solde</SelectItem>
                    <SelectItem value="Congé maternité">Congé maternité</SelectItem>
                    <SelectItem value="Congé exceptionnel">Congé exceptionnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="leave-start-date">Date de début</Label>
                <Input 
                  id="leave-start-date" 
                  type="date" 
                  value={newLeave.debut || ""}
                  onChange={(e) => setNewLeave({...newLeave, debut: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leave-end-date">Date de fin</Label>
                <Input 
                  id="leave-end-date" 
                  type="date" 
                  value={newLeave.fin || ""}
                  onChange={(e) => setNewLeave({...newLeave, fin: e.target.value})}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="leave-reason">Motif (optionnel)</Label>
                <Input 
                  id="leave-reason" 
                  value={newLeave.motif || ""}
                  onChange={(e) => setNewLeave({...newLeave, motif: e.target.value})}
                  placeholder="Motif du congé"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsLeaveDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleAddLeave}>Enregistrer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
