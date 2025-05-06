
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, PlusCircle, FileText, Edit, Trash2, FileUp, Download } from "lucide-react";
import { Client } from "@/types/client";
import { useToast } from "@/components/ui/use-toast";

interface GestionAdminProps {
  client: Client;
}

interface Document {
  id: number;
  nom: string;
  type: "Administratif" | "Juridique" | "Fiscal" | "Autre";
  dateCreation: string;
  dateExpiration?: string;
  statut: "Valide" | "En attente" | "Expiré" | "À renouveler";
  reference?: string;
  description?: string;
  fichier?: string;
}

interface Procedure {
  id: number;
  nom: string;
  type: "Administrative" | "Juridique" | "Fiscale" | "Sociale" | "Autre";
  dateCreation: string;
  dateEcheance?: string;
  statut: "En cours" | "Terminée" | "En attente" | "Problème";
  responsable?: string;
  description: string;
}

export function GestionAdmin({ client }: GestionAdminProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [isProcedureDialogOpen, setIsProcedureDialogOpen] = useState(false);
  
  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    nom: "",
    type: "Administratif",
    dateCreation: new Date().toISOString().split('T')[0],
    statut: "Valide"
  });
  
  const [newProcedure, setNewProcedure] = useState<Partial<Procedure>>({
    nom: "",
    type: "Administrative",
    dateCreation: new Date().toISOString().split('T')[0],
    statut: "En cours",
    description: ""
  });
  
  // Données d'exemple pour documents
  const [documents, setDocuments] = useState<Document[]>([
    { id: 1, nom: "Registre du Commerce", type: "Administratif", dateCreation: "2022-06-15", dateExpiration: "2032-06-15", statut: "Valide", reference: "RC12345-2022" },
    { id: 2, nom: "Attestation de Contribution du Contribuable", type: "Fiscal", dateCreation: "2024-01-05", dateExpiration: "2025-01-04", statut: "Valide", reference: "ACC-2024-789" },
    { id: 3, nom: "Contrat de Bail", type: "Juridique", dateCreation: "2023-05-10", dateExpiration: "2028-05-09", statut: "Valide", reference: "BAIL-2023-42" },
    { id: 4, nom: "Patente", type: "Fiscal", dateCreation: "2024-01-15", dateExpiration: "2024-12-31", statut: "Valide", reference: "PAT-2024-567" },
    { id: 5, nom: "Attestation CNPS", type: "Social", dateCreation: "2023-11-20", dateExpiration: "2024-11-19", statut: "Valide", reference: "CNPS-2023-891" }
  ]);

  // Données d'exemple pour procédures
  const [procedures, setProcedures] = useState<Procedure[]>([
    { id: 1, nom: "Déclaration statistique et fiscale", type: "Fiscale", dateCreation: "2024-02-10", dateEcheance: "2024-04-30", statut: "En cours", responsable: "Jean Dupont", description: "Préparation de la DSF pour l'année fiscale 2023" },
    { id: 2, nom: "Renouvellement Autorisation", type: "Administrative", dateCreation: "2024-01-05", dateEcheance: "2024-03-15", statut: "Terminée", responsable: "Marie Martin", description: "Renouvellement de l'autorisation d'exploitation" },
    { id: 3, nom: "Déclaration CNPS", type: "Sociale", dateCreation: "2024-02-01", dateEcheance: "2024-02-15", statut: "Terminée", responsable: "Paul Leroy", description: "Déclaration mensuelle des cotisations sociales" }
  ]);
  
  // Filtrer les documents en fonction du terme de recherche
  const filteredDocuments = documents.filter(doc =>
    doc.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.reference && doc.reference.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filtrer les procédures en fonction du terme de recherche
  const filteredProcedures = procedures.filter(proc =>
    proc.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (proc.responsable && proc.responsable.toLowerCase().includes(searchTerm.toLowerCase())) ||
    proc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Ajouter un document
  const handleAddDocument = () => {
    if (!newDocument.nom || !newDocument.type || !newDocument.dateCreation) {
      toast({
        title: "Champs obligatoires",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    const newId = Math.max(...documents.map(d => d.id)) + 1;
    const documentToAdd = {
      ...newDocument,
      id: newId
    } as Document;
    
    setDocuments([...documents, documentToAdd]);
    setIsDocumentDialogOpen(false);
    setNewDocument({
      nom: "",
      type: "Administratif",
      dateCreation: new Date().toISOString().split('T')[0],
      statut: "Valide"
    });
    
    toast({
      title: "Document ajouté",
      description: `Le document ${documentToAdd.nom} a été ajouté avec succès`,
      variant: "default"
    });
  };
  
  // Ajouter une procédure
  const handleAddProcedure = () => {
    if (!newProcedure.nom || !newProcedure.type || !newProcedure.description) {
      toast({
        title: "Champs obligatoires",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    const newId = Math.max(...procedures.map(p => p.id)) + 1;
    const procedureToAdd = {
      ...newProcedure,
      id: newId
    } as Procedure;
    
    setProcedures([...procedures, procedureToAdd]);
    setIsProcedureDialogOpen(false);
    setNewProcedure({
      nom: "",
      type: "Administrative",
      dateCreation: new Date().toISOString().split('T')[0],
      statut: "En cours",
      description: ""
    });
    
    toast({
      title: "Procédure ajoutée",
      description: `La procédure ${procedureToAdd.nom} a été ajoutée avec succès`,
      variant: "default"
    });
  };
  
  // Supprimer un document
  const handleDeleteDocument = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    
    toast({
      title: "Document supprimé",
      description: "Le document a été supprimé avec succès",
      variant: "default"
    });
  };
  
  // Supprimer une procédure
  const handleDeleteProcedure = (id: number) => {
    setProcedures(procedures.filter(proc => proc.id !== id));
    
    toast({
      title: "Procédure supprimée",
      description: "La procédure a été supprimée avec succès",
      variant: "default"
    });
  };
  
  // Formatter une date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };
  
  // Vérifier si un document est expiré ou proche de l'expiration
  const checkExpirationStatus = (dateExpiration?: string) => {
    if (!dateExpiration) return "Valide";
    
    const today = new Date();
    const expirationDate = new Date(dateExpiration);
    const monthDiff = (expirationDate.getTime() - today.getTime()) / (1000 * 3600 * 24 * 30);
    
    if (expirationDate < today) {
      return "Expiré";
    } else if (monthDiff <= 3) {
      return "À renouveler";
    } else {
      return "Valide";
    }
  };
  
  // Mettre à jour le statut des documents en fonction de leur date d'expiration
  React.useEffect(() => {
    const updatedDocuments = documents.map(doc => {
      const newStatus = checkExpirationStatus(doc.dateExpiration);
      if (doc.statut !== newStatus) {
        return { ...doc, statut: newStatus as Document["statut"] };
      }
      return doc;
    });
    
    if (JSON.stringify(updatedDocuments) !== JSON.stringify(documents)) {
      setDocuments(updatedDocuments);
    }
  }, [documents]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Administration - {client.nom || client.raisonsociale}</CardTitle>
        <CardDescription>
          Gestion des documents administratifs, procédures et échéances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="documents">
          <TabsList>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="procedures">Procédures</TabsTrigger>
            <TabsTrigger value="echeancier">Échéancier</TabsTrigger>
          </TabsList>
          
          {/* Tab Content: Documents */}
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
              <Button onClick={() => setIsDocumentDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un document
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Date d'expiration</TableHead>
                  <TableHead>Référence</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>{document.nom}</TableCell>
                    <TableCell>{document.type}</TableCell>
                    <TableCell>{formatDate(document.dateCreation)}</TableCell>
                    <TableCell>{formatDate(document.dateExpiration)}</TableCell>
                    <TableCell>{document.reference || "-"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        document.statut === "Valide" ? "bg-green-100 text-green-800" : 
                        document.statut === "En attente" ? "bg-yellow-100 text-yellow-800" :
                        document.statut === "À renouveler" ? "bg-orange-100 text-orange-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {document.statut}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-1">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="mr-1">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteDocument(document.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          {/* Tab Content: Procédures */}
          <TabsContent value="procedures" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une procédure..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => setIsProcedureDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter une procédure
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcedures.map((procedure) => (
                  <TableRow key={procedure.id}>
                    <TableCell>{procedure.nom}</TableCell>
                    <TableCell>{procedure.type}</TableCell>
                    <TableCell>{formatDate(procedure.dateCreation)}</TableCell>
                    <TableCell>{formatDate(procedure.dateEcheance)}</TableCell>
                    <TableCell>{procedure.responsable || "-"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        procedure.statut === "Terminée" ? "bg-green-100 text-green-800" : 
                        procedure.statut === "En cours" ? "bg-blue-100 text-blue-800" :
                        procedure.statut === "En attente" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {procedure.statut}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-1">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="mr-1">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteProcedure(procedure.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          {/* Tab Content: Échéancier */}
          <TabsContent value="echeancier" className="space-y-4">
            <div className="bg-primary/10 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-lg mb-2">Échéances à venir</h3>
              <p className="text-sm text-muted-foreground">Retrouvez ici toutes les échéances administratives et réglementaires à traiter</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Documents à renouveler</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document</TableHead>
                        <TableHead>Expiration</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents
                        .filter(doc => doc.statut === "À renouveler" || doc.statut === "Expiré")
                        .sort((a, b) => {
                          if (!a.dateExpiration) return 1;
                          if (!b.dateExpiration) return -1;
                          return new Date(a.dateExpiration).getTime() - new Date(b.dateExpiration).getTime();
                        })
                        .map(doc => (
                          <TableRow key={`expiry-${doc.id}`}>
                            <TableCell>{doc.nom}</TableCell>
                            <TableCell>{formatDate(doc.dateExpiration)}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                doc.statut === "À renouveler" ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"
                              }`}>
                                {doc.statut}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      }
                      {documents.filter(doc => doc.statut === "À renouveler" || doc.statut === "Expiré").length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                            Aucun document à renouveler
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Procédures à échéance</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Procédure</TableHead>
                        <TableHead>Échéance</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {procedures
                        .filter(proc => proc.dateEcheance && new Date(proc.dateEcheance) >= new Date() && proc.statut !== "Terminée")
                        .sort((a, b) => {
                          if (!a.dateEcheance) return 1;
                          if (!b.dateEcheance) return -1;
                          return new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime();
                        })
                        .map(proc => (
                          <TableRow key={`proc-${proc.id}`}>
                            <TableCell>{proc.nom}</TableCell>
                            <TableCell>{formatDate(proc.dateEcheance)}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                proc.statut === "En cours" ? "bg-blue-100 text-blue-800" : 
                                proc.statut === "En attente" ? "bg-yellow-100 text-yellow-800" : 
                                "bg-red-100 text-red-800"
                              }`}>
                                {proc.statut}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      }
                      {procedures.filter(proc => proc.dateEcheance && new Date(proc.dateEcheance) >= new Date() && proc.statut !== "Terminée").length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                            Aucune procédure avec échéance proche
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Calendrier des obligations</CardTitle>
                <CardDescription>Récapitulatif des obligations administratives annuelles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Premier trimestre</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center justify-between">
                        <span>Patente</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">15 mars</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Déclaration fiscale acompte</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">15 mars</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Cotisations CNPS</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Mensuel</span>
                      </li>
                    </ul>
                  </div>
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Deuxième trimestre</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center justify-between">
                        <span>DSF (30 juin max)</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">15 juin</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Déclaration fiscale acompte</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">15 juin</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Cotisations CNPS</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Mensuel</span>
                      </li>
                    </ul>
                  </div>
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Troisième trimestre</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center justify-between">
                        <span>Déclaration fiscale acompte</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">15 sept.</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Cotisations CNPS</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Mensuel</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Modal pour ajouter un document */}
        <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter un document</DialogTitle>
              <DialogDescription>
                Enregistrer un nouveau document administratif
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="document-name">Nom du document</Label>
                <Input 
                  id="document-name" 
                  value={newDocument.nom}
                  onChange={(e) => setNewDocument({...newDocument, nom: e.target.value})}
                  placeholder="Nom du document"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document-type">Type de document</Label>
                <Select 
                  value={newDocument.type} 
                  onValueChange={(value: Document["type"]) => setNewDocument({...newDocument, type: value})}
                >
                  <SelectTrigger id="document-type">
                    <SelectValue placeholder="Type de document" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administratif">Administratif</SelectItem>
                    <SelectItem value="Juridique">Juridique</SelectItem>
                    <SelectItem value="Fiscal">Fiscal</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="document-creation-date">Date de création</Label>
                <Input 
                  id="document-creation-date" 
                  type="date" 
                  value={newDocument.dateCreation}
                  onChange={(e) => setNewDocument({...newDocument, dateCreation: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document-expiration-date">Date d'expiration (optionnel)</Label>
                <Input 
                  id="document-expiration-date" 
                  type="date" 
                  value={newDocument.dateExpiration || ""}
                  onChange={(e) => setNewDocument({...newDocument, dateExpiration: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document-reference">Référence (optionnel)</Label>
                <Input 
                  id="document-reference" 
                  value={newDocument.reference || ""}
                  onChange={(e) => setNewDocument({...newDocument, reference: e.target.value})}
                  placeholder="Référence du document"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document-status">Statut</Label>
                <Select 
                  value={newDocument.statut} 
                  onValueChange={(value: Document["statut"]) => setNewDocument({...newDocument, statut: value})}
                >
                  <SelectTrigger id="document-status">
                    <SelectValue placeholder="Statut du document" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Valide">Valide</SelectItem>
                    <SelectItem value="En attente">En attente</SelectItem>
                    <SelectItem value="Expiré">Expiré</SelectItem>
                    <SelectItem value="À renouveler">À renouveler</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="document-file">Fichier</Label>
                <div className="flex items-center space-x-2">
                  <Input id="document-file" type="file" className="w-full" />
                  <Button type="button" size="sm">
                    <FileUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="document-description">Description (optionnel)</Label>
                <Input 
                  id="document-description" 
                  value={newDocument.description || ""}
                  onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
                  placeholder="Description du document"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDocumentDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleAddDocument}>Enregistrer</Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Modal pour ajouter une procédure */}
        <Dialog open={isProcedureDialogOpen} onOpenChange={setIsProcedureDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter une procédure</DialogTitle>
              <DialogDescription>
                Enregistrer une nouvelle procédure administrative
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="procedure-name">Nom de la procédure</Label>
                <Input 
                  id="procedure-name" 
                  value={newProcedure.nom}
                  onChange={(e) => setNewProcedure({...newProcedure, nom: e.target.value})}
                  placeholder="Nom de la procédure"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="procedure-type">Type de procédure</Label>
                <Select 
                  value={newProcedure.type} 
                  onValueChange={(value: Procedure["type"]) => setNewProcedure({...newProcedure, type: value})}
                >
                  <SelectTrigger id="procedure-type">
                    <SelectValue placeholder="Type de procédure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrative">Administrative</SelectItem>
                    <SelectItem value="Juridique">Juridique</SelectItem>
                    <SelectItem value="Fiscale">Fiscale</SelectItem>
                    <SelectItem value="Sociale">Sociale</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="procedure-creation-date">Date de création</Label>
                <Input 
                  id="procedure-creation-date" 
                  type="date" 
                  value={newProcedure.dateCreation}
                  onChange={(e) => setNewProcedure({...newProcedure, dateCreation: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="procedure-deadline">Date d'échéance (optionnel)</Label>
                <Input 
                  id="procedure-deadline" 
                  type="date" 
                  value={newProcedure.dateEcheance || ""}
                  onChange={(e) => setNewProcedure({...newProcedure, dateEcheance: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="procedure-manager">Responsable (optionnel)</Label>
                <Input 
                  id="procedure-manager" 
                  value={newProcedure.responsable || ""}
                  onChange={(e) => setNewProcedure({...newProcedure, responsable: e.target.value})}
                  placeholder="Responsable de la procédure"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="procedure-status">Statut</Label>
                <Select 
                  value={newProcedure.statut} 
                  onValueChange={(value: Procedure["statut"]) => setNewProcedure({...newProcedure, statut: value})}
                >
                  <SelectTrigger id="procedure-status">
                    <SelectValue placeholder="Statut de la procédure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="Terminée">Terminée</SelectItem>
                    <SelectItem value="En attente">En attente</SelectItem>
                    <SelectItem value="Problème">Problème</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="procedure-description">Description</Label>
                <Input 
                  id="procedure-description" 
                  value={newProcedure.description}
                  onChange={(e) => setNewProcedure({...newProcedure, description: e.target.value})}
                  placeholder="Description de la procédure"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsProcedureDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleAddProcedure}>Enregistrer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
