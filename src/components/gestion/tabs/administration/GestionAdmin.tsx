
import React from "react";
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
import { useAdministration } from "@/hooks/useAdministration";
import { DocumentAdministratif, ProcedureAdministrative } from "@/services/administrationService";

interface GestionAdminProps {
  client: Client;
}

export function GestionAdmin({ client }: GestionAdminProps) {
  const {
    isLoading,
    searchTerm,
    setSearchTerm,
    isDocumentDialogOpen,
    setIsDocumentDialogOpen,
    isProcedureDialogOpen,
    setIsProcedureDialogOpen,
    newDocument,
    setNewDocument,
    newProcedure,
    setNewProcedure,
    filteredDocuments,
    filteredProcedures,
    handleAddDocument,
    handleAddProcedure,
    handleDeleteDocument,
    handleDeleteProcedure,
    formatDate
  } = useAdministration(client);

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
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Chargement des documents...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Date d'expiration</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Aucun document trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell>{document.nom}</TableCell>
                        <TableCell>{document.type}</TableCell>
                        <TableCell>{formatDate(document.date_creation)}</TableCell>
                        <TableCell>{formatDate(document.date_expiration)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            document.statut === "Actif" ? "bg-green-100 text-green-800" : 
                            document.statut === "En attente" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {document.statut}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {document.fichier_url && (
                            <Button variant="outline" size="sm" className="mr-1">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="mr-1">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteDocument(document.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
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
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Chargement des procédures...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Date de début</TableHead>
                    <TableHead>Date de fin</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProcedures.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Aucune procédure trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProcedures.map((procedure) => (
                      <TableRow key={procedure.id}>
                        <TableCell>{procedure.titre}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            procedure.priorite === "Haute" ? "bg-red-100 text-red-800" : 
                            procedure.priorite === "Moyenne" ? "bg-yellow-100 text-yellow-800" : 
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {procedure.priorite}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(procedure.date_debut)}</TableCell>
                        <TableCell>{formatDate(procedure.date_fin)}</TableCell>
                        <TableCell>{procedure.responsable || "-"}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            procedure.statut === "Terminée" ? "bg-green-100 text-green-800" : 
                            procedure.statut === "En cours" ? "bg-blue-100 text-blue-800" :
                            "bg-yellow-100 text-yellow-800"
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
                    ))
                  )}
                </TableBody>
              </Table>
            )}
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
                      {filteredDocuments
                        .filter(doc => doc.date_expiration && new Date(doc.date_expiration) <= new Date(new Date().setMonth(new Date().getMonth() + 3)))
                        .sort((a, b) => {
                          if (!a.date_expiration) return 1;
                          if (!b.date_expiration) return -1;
                          return new Date(a.date_expiration).getTime() - new Date(b.date_expiration).getTime();
                        })
                        .map(doc => (
                          <TableRow key={`expiry-${doc.id}`}>
                            <TableCell>{doc.nom}</TableCell>
                            <TableCell>{formatDate(doc.date_expiration)}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                new Date(doc.date_expiration || "") < new Date() ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"
                              }`}>
                                {new Date(doc.date_expiration || "") < new Date() ? "Expiré" : "À renouveler"}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      }
                      {!isLoading && filteredDocuments.filter(doc => doc.date_expiration && new Date(doc.date_expiration) <= new Date(new Date().setMonth(new Date().getMonth() + 3))).length === 0 && (
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
                      {filteredProcedures
                        .filter(proc => proc.date_fin && new Date(proc.date_fin) >= new Date() && proc.statut !== "Terminée")
                        .sort((a, b) => {
                          if (!a.date_fin) return 1;
                          if (!b.date_fin) return -1;
                          return new Date(a.date_fin).getTime() - new Date(b.date_fin).getTime();
                        })
                        .map(proc => (
                          <TableRow key={`proc-${proc.id}`}>
                            <TableCell>{proc.titre}</TableCell>
                            <TableCell>{formatDate(proc.date_fin)}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                proc.statut === "En cours" ? "bg-blue-100 text-blue-800" : 
                                "bg-yellow-100 text-yellow-800"
                              }`}>
                                {proc.statut}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      }
                      {!isLoading && filteredProcedures.filter(proc => proc.date_fin && new Date(proc.date_fin) >= new Date() && proc.statut !== "Terminée").length === 0 && (
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
                  onValueChange={(value: DocumentAdministratif["type"]) => setNewDocument({...newDocument, type: value})}
                >
                  <SelectTrigger id="document-type">
                    <SelectValue placeholder="Type de document" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administratif">Administratif</SelectItem>
                    <SelectItem value="Juridique">Juridique</SelectItem>
                    <SelectItem value="Fiscal">Fiscal</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="document-creation-date">Date de création</Label>
                <Input 
                  id="document-creation-date" 
                  type="date" 
                  value={newDocument.date_creation}
                  onChange={(e) => setNewDocument({...newDocument, date_creation: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document-expiration-date">Date d'expiration (optionnel)</Label>
                <Input 
                  id="document-expiration-date" 
                  type="date" 
                  value={newDocument.date_expiration || ""}
                  onChange={(e) => setNewDocument({...newDocument, date_expiration: e.target.value})}
                />
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
              <div className="space-y-2 col-span-2">
                <Label htmlFor="procedure-titre">Titre de la procédure</Label>
                <Input 
                  id="procedure-titre" 
                  value={newProcedure.titre}
                  onChange={(e) => setNewProcedure({...newProcedure, titre: e.target.value})}
                  placeholder="Titre de la procédure"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="procedure-priorite">Priorité</Label>
                <Select 
                  value={newProcedure.priorite} 
                  onValueChange={(value: string) => setNewProcedure({...newProcedure, priorite: value})}
                >
                  <SelectTrigger id="procedure-priorite">
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basse">Basse</SelectItem>
                    <SelectItem value="Moyenne">Moyenne</SelectItem>
                    <SelectItem value="Haute">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="procedure-statut">Statut</Label>
                <Select 
                  value={newProcedure.statut} 
                  onValueChange={(value: string) => setNewProcedure({...newProcedure, statut: value})}
                >
                  <SelectTrigger id="procedure-statut">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="En attente">En attente</SelectItem>
                    <SelectItem value="Terminée">Terminée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="procedure-date-debut">Date de début</Label>
                <Input 
                  id="procedure-date-debut" 
                  type="date" 
                  value={newProcedure.date_debut}
                  onChange={(e) => setNewProcedure({...newProcedure, date_debut: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="procedure-date-fin">Date de fin (optionnel)</Label>
                <Input 
                  id="procedure-date-fin" 
                  type="date" 
                  value={newProcedure.date_fin || ""}
                  onChange={(e) => setNewProcedure({...newProcedure, date_fin: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="procedure-responsable">Responsable (optionnel)</Label>
                <Input 
                  id="procedure-responsable" 
                  value={newProcedure.responsable || ""}
                  onChange={(e) => setNewProcedure({...newProcedure, responsable: e.target.value})}
                  placeholder="Nom du responsable"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="procedure-description">Description (optionnel)</Label>
                <Input 
                  id="procedure-description" 
                  value={newProcedure.description || ""}
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
