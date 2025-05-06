
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Client } from "@/types/client";

interface GestionAdminProps {
  client: Client;
}

export function GestionAdmin({ client }: GestionAdminProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  
  // Documents administratifs fictifs pour démonstration
  const documents = [
    { id: 1, nom: "Immatriculation entreprise", date: "15/01/2025", statut: "Valide", type: "Document légal" },
    { id: 2, nom: "Attestation fiscale", date: "22/03/2025", statut: "En attente", type: "Document fiscal" },
    { id: 3, nom: "Autorisation d'exploitation", date: "05/02/2025", statut: "Valide", type: "Document légal" },
    { id: 4, nom: "Certificat de conformité", date: "10/04/2025", statut: "Expiré", type: "Document légal" },
    { id: 5, nom: "Registre commercial", date: "28/02/2025", statut: "Valide", type: "Document légal" },
  ];
  
  // Procédures administratives fictives pour démonstration
  const procedures = [
    { id: 1, nom: "Renouvellement licence", echeance: "15/06/2025", responsable: "Direction", statut: "En cours" },
    { id: 2, nom: "Révision statuts", echeance: "22/08/2025", responsable: "Service juridique", statut: "Planifié" },
    { id: 3, nom: "Demande autorisation", echeance: "30/05/2025", responsable: "Direction", statut: "Urgent" },
  ];

  // Filtrer les documents en fonction du terme de recherche
  const filteredDocuments = documents.filter(doc =>
    doc.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Administration - {client.nom || client.raisonsociale}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="documents">
          <TabsList>
            <TabsTrigger value="documents">Documents administratifs</TabsTrigger>
            <TabsTrigger value="procedures">Procédures</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un document..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.nom}</TableCell>
                        <TableCell>{doc.type}</TableCell>
                        <TableCell>{doc.date}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            doc.statut === "Valide" ? "bg-green-100 text-green-800" :
                            doc.statut === "En attente" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {doc.statut}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 ml-2">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="procedures" className="space-y-4">
            <div className="flex justify-end">
              <Button size="sm">
                <Upload className="h-4 w-4 mr-1" />
                Nouvelle procédure
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Procédure</TableHead>
                      <TableHead>Échéance</TableHead>
                      <TableHead>Responsable</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {procedures.map((proc) => (
                      <TableRow key={proc.id}>
                        <TableCell>{proc.nom}</TableCell>
                        <TableCell>{proc.echeance}</TableCell>
                        <TableCell>{proc.responsable}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            proc.statut === "En cours" ? "bg-blue-100 text-blue-800" :
                            proc.statut === "Planifié" ? "bg-purple-100 text-purple-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {proc.statut}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
