
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, FileText, Edit, ChevronRight } from "lucide-react";
import { Client } from "@/types/client";
import { useIsMobile } from "@/hooks/use-mobile";

interface GestionRHProps {
  client: Client;
}

export function GestionRH({ client }: GestionRHProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const isMobile = useIsMobile();
  
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

  // Rendu de la ligne employé adapté pour mobile
  const renderEmployeeRow = (employee: any) => {
    if (isMobile) {
      return (
        <TableRow key={employee.id} className="hover:bg-gray-50">
          <TableCell className="p-3">
            <div className="flex flex-col">
              <div className="font-medium">{employee.nom} {employee.prenom}</div>
              <div className="text-xs text-muted-foreground">{employee.poste}</div>
              <div className="text-xs text-muted-foreground mt-1">{employee.departement}</div>
              <div className="text-xs mt-2">Embauché le: {employee.dateEmbauche}</div>
              <div className="mt-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  employee.statut === "Actif" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>
                  {employee.statut}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm">
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Modifier
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-3.5 w-3.5 mr-1" />
                  Documents
                </Button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return (
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
    );
  };

  // Rendu de la ligne contrat adapté pour mobile
  const renderContractRow = (contract: any) => {
    if (isMobile) {
      return (
        <TableRow key={contract.id} className="hover:bg-gray-50">
          <TableCell className="p-3">
            <div className="flex flex-col">
              <div className="font-medium">{contract.employe}</div>
              <div className="flex items-center mt-1">
                <span className={`px-2 py-1 rounded-full text-xs mr-2 ${
                  contract.statut === "En cours" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {contract.statut}
                </span>
                <span className="text-xs font-medium">{contract.type}</span>
              </div>
              <div className="text-xs mt-2">
                <div>Début: {contract.debut}</div>
                <div>Fin: {contract.fin}</div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm">
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Modifier
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-3.5 w-3.5 mr-1" />
                  Voir
                </Button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return (
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
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Ressources Humaines - {client.nom || client.raisonsociale}</CardTitle>
        <CardDescription className="text-sm">
          Gestion des employés, contrats et congés
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="employees">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="employees" className="flex-1">Employés</TabsTrigger>
            <TabsTrigger value="contracts" className="flex-1">Contrats</TabsTrigger>
            <TabsTrigger value="absences" className="flex-1">Congés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="employees" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un employé..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="w-full sm:w-auto">
                <UserPlus className="mr-2 h-4 w-4" />
                Ajouter un employé
              </Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <Table>
                {!isMobile && (
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
                )}
                <TableBody>
                  {filteredEmployees.map(renderEmployeeRow)}
                  {filteredEmployees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={isMobile ? 1 : 7} className="text-center py-6 text-muted-foreground">
                        Aucun employé trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="contracts" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un contrat..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="w-full sm:w-auto">
                <FileText className="mr-2 h-4 w-4" />
                Nouveau contrat
              </Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <Table>
                {!isMobile && (
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
                )}
                <TableBody>
                  {filteredContracts.map(renderContractRow)}
                  {filteredContracts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={isMobile ? 1 : 6} className="text-center py-6 text-muted-foreground">
                        Aucun contrat trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
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
