
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, FileText, Edit } from "lucide-react";
import { Client } from "@/types/client";

interface GestionRHProps {
  client: Client;
}

export function GestionRH({ client }: GestionRHProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  
  // Données d'exemple pour les employés
  const employees = [
    { id: 1, nom: "Dupont", prenom: "Jean", poste: "Directeur", dateEmbauche: "12/01/2022", statut: "Actif", departement: "Direction" },
    { id: 2, nom: "Martin", prenom: "Sophie", poste: "Comptable", dateEmbauche: "05/03/2022", statut: "Actif", departement: "Finance" },
    { id: 3, nom: "Leroy", prenom: "Pierre", poste: "Commercial", dateEmbauche: "18/05/2023", statut: "Actif", departement: "Ventes" },
    { id: 4, nom: "Dubois", prenom: "Marie", poste: "Assistante", dateEmbauche: "22/08/2023", statut: "Congé", departement: "Administration" },
    { id: 5, nom: "Moreau", prenom: "Paul", poste: "Technicien", dateEmbauche: "10/11/2021", statut: "Actif", departement: "Production" }
  ];

  // Données d'exemple pour les contrats
  const contracts = [
    { id: 1, type: "CDI", employe: "Dupont Jean", debut: "12/01/2022", fin: "Indéterminée", statut: "En cours" },
    { id: 2, type: "CDI", employe: "Martin Sophie", debut: "05/03/2022", fin: "Indéterminée", statut: "En cours" },
    { id: 3, type: "CDD", employe: "Leroy Pierre", debut: "18/05/2023", fin: "17/05/2025", statut: "En cours" },
    { id: 4, type: "CDI", employe: "Dubois Marie", debut: "22/08/2023", fin: "Indéterminée", statut: "En cours" },
    { id: 5, type: "CDI", employe: "Moreau Paul", debut: "10/11/2021", fin: "Indéterminée", statut: "En cours" }
  ];

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
              <Button>
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
                    <TableCell>{employee.dateEmbauche}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        employee.statut === "Actif" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {employee.statut}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-1">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
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
              <Button>
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
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>{contract.type}</TableCell>
                    <TableCell>{contract.employe}</TableCell>
                    <TableCell>{contract.debut}</TableCell>
                    <TableCell>{contract.fin}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        contract.statut === "En cours" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {contract.statut}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-1">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="absences">
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium">Module de gestion des congés et absences</h3>
              <p className="text-muted-foreground mt-2">
                Cette fonctionnalité sera disponible dans une prochaine mise à jour.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
