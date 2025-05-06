
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, PlusCircle, FileText, Edit, Trash2, FileUp, Calendar } from "lucide-react";
import { Client } from "@/types/client";
import { Employe, Conge, ContratEmploye } from "@/services/rhService";
import { useRessourcesHumaines } from "@/hooks/useRessourcesHumaines";
import { Badge } from "@/components/ui/badge";

interface GestionRHProps {
  client: Client;
}

export function GestionRH({ client }: GestionRHProps) {
  const {
    employes,
    conges,
    contrats,
    isLoading,
    searchTerm,
    setSearchTerm,
    isEmployeDialogOpen,
    setIsEmployeDialogOpen,
    isCongeDialogOpen,
    setIsCongeDialogOpen,
    isContratDialogOpen,
    setIsContratDialogOpen,
    selectedEmploye,
    setSelectedEmploye,
    newEmploye,
    setNewEmploye,
    newConge,
    setNewConge,
    newContrat,
    setNewContrat,
    filteredEmployes,
    handleAddEmploye,
    handleAddConge,
    handleAddContrat,
    handleDeleteEmploye,
    handleUpdateEmployeStatut,
    handleUpdateCongeStatut,
    formatDate
  } = useRessourcesHumaines(client);

  const [viewMode, setViewMode] = useState<"list" | "detail">("list");

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'Actif':
        return "bg-green-100 text-green-800";
      case 'Congé':
        return "bg-blue-100 text-blue-800";
      case 'Arrêt maladie':
        return "bg-yellow-100 text-yellow-800";
      case 'Inactif':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCongeStatutColor = (statut: string) => {
    switch (statut) {
      case 'Approuvé':
        return "bg-green-100 text-green-800";
      case 'En attente':
        return "bg-yellow-100 text-yellow-800";
      case 'Refusé':
        return "bg-red-100 text-red-800";
      case 'Annulé':
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getContratTypeColor = (type: string) => {
    switch (type) {
      case 'CDI':
        return "bg-green-100 text-green-800";
      case 'CDD':
        return "bg-blue-100 text-blue-800";
      case 'Stage':
        return "bg-yellow-100 text-yellow-800";
      case 'Prestation':
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
        {viewMode === "list" ? (
          <div className="space-y-4">
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
              <Button onClick={() => setIsEmployeDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un employé
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Chargement des employés...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Date d'embauche</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Aucun employé trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployes.map((employe) => (
                      <TableRow key={employe.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{employe.prenom} {employe.nom}</div>
                            <div className="text-xs text-muted-foreground">{employe.departement || "Aucun département"}</div>
                          </div>
                        </TableCell>
                        <TableCell>{employe.poste}</TableCell>
                        <TableCell>{formatDate(employe.date_embauche)}</TableCell>
                        <TableCell>
                          {employe.email && (
                            <div className="text-xs">{employe.email}</div>
                          )}
                          {employe.telephone && (
                            <div className="text-xs">{employe.telephone}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatutColor(employe.statut)}`}>
                            {employe.statut}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mr-1"
                            onClick={() => {
                              setSelectedEmploye(employe);
                              setViewMode("detail");
                            }}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="mr-1">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteEmploye(employe.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {selectedEmploye && (
              <>
                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={() => setViewMode("list")}>Retour à la liste</Button>
                  <div className={`px-3 py-1 rounded-full text-xs ${getStatutColor(selectedEmploye.statut)}`}>
                    {selectedEmploye.statut}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{selectedEmploye.prenom} {selectedEmploye.nom}</CardTitle>
                      <CardDescription>{selectedEmploye.poste}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-sm font-medium">Date d'embauche:</div>
                        <div className="text-sm">{formatDate(selectedEmploye.date_embauche)}</div>
                      </div>
                      {selectedEmploye.departement && (
                        <div className="grid grid-cols-2 gap-1">
                          <div className="text-sm font-medium">Département:</div>
                          <div className="text-sm">{selectedEmploye.departement}</div>
                        </div>
                      )}
                      {selectedEmploye.email && (
                        <div className="grid grid-cols-2 gap-1">
                          <div className="text-sm font-medium">Email:</div>
                          <div className="text-sm">{selectedEmploye.email}</div>
                        </div>
                      )}
                      {selectedEmploye.telephone && (
                        <div className="grid grid-cols-2 gap-1">
                          <div className="text-sm font-medium">Téléphone:</div>
                          <div className="text-sm">{selectedEmploye.telephone}</div>
                        </div>
                      )}
                      {selectedEmploye.numero_cnps && (
                        <div className="grid grid-cols-2 gap-1">
                          <div className="text-sm font-medium">CNPS:</div>
                          <div className="text-sm">{selectedEmploye.numero_cnps}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Salaire et Primes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-sm font-medium">Salaire de base:</div>
                        <div className="text-sm font-semibold">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(selectedEmploye.salaire_base)}
                        </div>
                      </div>
                      {selectedEmploye.type_contrat && (
                        <div className="grid grid-cols-2 gap-1">
                          <div className="text-sm font-medium">Type de contrat:</div>
                          <div className="text-sm">
                            <Badge variant="outline" className={getContratTypeColor(selectedEmploye.type_contrat)}>
                              {selectedEmploye.type_contrat}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex flex-col gap-2">
                        <Button size="sm" onClick={() => setIsCongeDialogOpen(true)}>
                          <Calendar className="mr-2 h-4 w-4" /> Ajouter un congé
                        </Button>
                        <Button size="sm" onClick={() => setIsContratDialogOpen(true)}>
                          <FileText className="mr-2 h-4 w-4" /> Ajouter un contrat
                        </Button>
                        <Select 
                          value={selectedEmploye.statut} 
                          onValueChange={(value: Employe["statut"]) => handleUpdateEmployeStatut(selectedEmploye.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Changer le statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Actif">Actif</SelectItem>
                            <SelectItem value="Congé">En congé</SelectItem>
                            <SelectItem value="Arrêt maladie">Arrêt maladie</SelectItem>
                            <SelectItem value="Inactif">Inactif</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Tabs defaultValue="conges">
                  <TabsList>
                    <TabsTrigger value="conges">Congés</TabsTrigger>
                    <TabsTrigger value="contrats">Contrats</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="conges" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Historique des congés</h3>
                      <Button size="sm" onClick={() => setIsCongeDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nouveau congé
                      </Button>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Période</TableHead>
                          <TableHead>Durée</TableHead>
                          <TableHead>Motif</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {conges.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                              Aucun congé enregistré
                            </TableCell>
                          </TableRow>
                        ) : (
                          conges.map((conge) => (
                            <TableRow key={conge.id}>
                              <TableCell>{conge.type}</TableCell>
                              <TableCell>
                                <div className="text-sm">Du {formatDate(conge.date_debut)}</div>
                                <div className="text-sm">Au {formatDate(conge.date_fin)}</div>
                              </TableCell>
                              <TableCell>{conge.duree_jours} jour{conge.duree_jours > 1 ? 's' : ''}</TableCell>
                              <TableCell className="max-w-xs truncate">{conge.motif || "-"}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${getCongeStatutColor(conge.statut)}`}>
                                  {conge.statut}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Select 
                                  value={conge.statut} 
                                  onValueChange={(value: Conge["statut"]) => handleUpdateCongeStatut(conge.id, value)}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue placeholder="Statut" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="En attente">En attente</SelectItem>
                                    <SelectItem value="Approuvé">Approuver</SelectItem>
                                    <SelectItem value="Refusé">Refuser</SelectItem>
                                    <SelectItem value="Annulé">Annuler</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="contrats" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Contrats</h3>
                      <Button size="sm" onClick={() => setIsContratDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nouveau contrat
                      </Button>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Date de début</TableHead>
                          <TableHead>Date de fin</TableHead>
                          <TableHead>Fichier</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contrats.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                              Aucun contrat enregistré
                            </TableCell>
                          </TableRow>
                        ) : (
                          contrats.map((contrat) => (
                            <TableRow key={contrat.id}>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${getContratTypeColor(contrat.type)}`}>
                                  {contrat.type}
                                </span>
                              </TableCell>
                              <TableCell>{formatDate(contrat.date_debut)}</TableCell>
                              <TableCell>{contrat.date_fin ? formatDate(contrat.date_fin) : "Indéterminée"}</TableCell>
                              <TableCell>
                                {contrat.fichier_url ? (
                                  <Button variant="outline" size="sm">
                                    <FileText className="h-4 w-4 mr-1" /> Voir
                                  </Button>
                                ) : (
                                  <span className="text-muted-foreground text-sm">Non disponible</span>
                                )}
                              </TableCell>
                              <TableCell>{contrat.statut}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="documents">
                    <div className="flex justify-center items-center h-48">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-4">Aucun document disponible pour cet employé</p>
                        <Button variant="outline">
                          <FileUp className="mr-2 h-4 w-4" /> Ajouter un document
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        )}
        
        {/* Modal pour ajouter un employé */}
        <Dialog open={isEmployeDialogOpen} onOpenChange={setIsEmployeDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter un employé</DialogTitle>
              <DialogDescription>
                Enregistrer les informations d'un nouvel employé
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="employe-nom">Nom</Label>
                <Input 
                  id="employe-nom" 
                  value={newEmploye.nom}
                  onChange={(e) => setNewEmploye({...newEmploye, nom: e.target.value})}
                  placeholder="Nom de famille"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employe-prenom">Prénom</Label>
                <Input 
                  id="employe-prenom" 
                  value={newEmploye.prenom}
                  onChange={(e) => setNewEmploye({...newEmploye, prenom: e.target.value})}
                  placeholder="Prénom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employe-email">Email (optionnel)</Label>
                <Input 
                  id="employe-email" 
                  type="email" 
                  value={newEmploye.email || ""}
                  onChange={(e) => setNewEmploye({...newEmploye, email: e.target.value})}
                  placeholder="Adresse email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employe-telephone">Téléphone (optionnel)</Label>
                <Input 
                  id="employe-telephone" 
                  value={newEmploye.telephone || ""}
                  onChange={(e) => setNewEmploye({...newEmploye, telephone: e.target.value})}
                  placeholder="Numéro de téléphone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employe-poste">Poste</Label>
                <Input 
                  id="employe-poste" 
                  value={newEmploye.poste}
                  onChange={(e) => setNewEmploye({...newEmploye, poste: e.target.value})}
                  placeholder="Intitulé du poste"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employe-departement">Département (optionnel)</Label>
                <Input 
                  id="employe-departement" 
                  value={newEmploye.departement || ""}
                  onChange={(e) => setNewEmploye({...newEmploye, departement: e.target.value})}
                  placeholder="Département"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employe-date-embauche">Date d'embauche</Label>
                <Input 
                  id="employe-date-embauche" 
                  type="date" 
                  value={newEmploye.date_embauche}
                  onChange={(e) => setNewEmploye({...newEmploye, date_embauche: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employe-type-contrat">Type de contrat</Label>
                <Select 
                  value={newEmploye.type_contrat} 
                  onValueChange={(value: Employe["type_contrat"]) => setNewEmploye({...newEmploye, type_contrat: value})}
                >
                  <SelectTrigger id="employe-type-contrat">
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
                <Label htmlFor="employe-salaire">Salaire de base</Label>
                <Input 
                  id="employe-salaire" 
                  type="number" 
                  value={newEmploye.salaire_base?.toString() || "0"}
                  onChange={(e) => setNewEmploye({...newEmploye, salaire_base: parseFloat(e.target.value) || 0})}
                  placeholder="Salaire de base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employe-cnps">Numéro CNPS (optionnel)</Label>
                <Input 
                  id="employe-cnps" 
                  value={newEmploye.numero_cnps || ""}
                  onChange={(e) => setNewEmploye({...newEmploye, numero_cnps: e.target.value})}
                  placeholder="Numéro CNPS"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEmployeDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleAddEmploye}>Enregistrer</Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Modal pour ajouter un congé */}
        <Dialog open={isCongeDialogOpen} onOpenChange={setIsCongeDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter un congé</DialogTitle>
              <DialogDescription>
                Enregistrer un nouveau congé pour {selectedEmploye ? `${selectedEmploye.prenom} ${selectedEmploye.nom}` : "l'employé"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="conge-type">Type de congé</Label>
                <Select 
                  value={newConge.type} 
                  onValueChange={(value: Conge["type"]) => setNewConge({...newConge, type: value})}
                >
                  <SelectTrigger id="conge-type">
                    <SelectValue placeholder="Type de congé" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Congés payés">Congés payés</SelectItem>
                    <SelectItem value="Maladie">Maladie</SelectItem>
                    <SelectItem value="Maternité">Maternité</SelectItem>
                    <SelectItem value="Formation">Formation</SelectItem>
                    <SelectItem value="Sans solde">Sans solde</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="conge-statut">Statut</Label>
                <Select 
                  value={newConge.statut} 
                  onValueChange={(value: Conge["statut"]) => setNewConge({...newConge, statut: value})}
                >
                  <SelectTrigger id="conge-statut">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En attente">En attente</SelectItem>
                    <SelectItem value="Approuvé">Approuvé</SelectItem>
                    <SelectItem value="Refusé">Refusé</SelectItem>
                    <SelectItem value="Annulé">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="conge-date-debut">Date de début</Label>
                <Input 
                  id="conge-date-debut" 
                  type="date" 
                  value={newConge.date_debut}
                  onChange={(e) => setNewConge({...newConge, date_debut: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conge-date-fin">Date de fin</Label>
                <Input 
                  id="conge-date-fin" 
                  type="date" 
                  value={newConge.date_fin}
                  onChange={(e) => setNewConge({...newConge, date_fin: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conge-duree">Nombre de jours</Label>
                <Input 
                  id="conge-duree" 
                  type="number" 
                  value={newConge.duree_jours?.toString() || "1"}
                  onChange={(e) => setNewConge({...newConge, duree_jours: parseInt(e.target.value) || 1})}
                  min="1"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="conge-motif">Motif (optionnel)</Label>
                <Input 
                  id="conge-motif" 
                  value={newConge.motif || ""}
                  onChange={(e) => setNewConge({...newConge, motif: e.target.value})}
                  placeholder="Motif du congé"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCongeDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleAddConge}>Enregistrer</Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Modal pour ajouter un contrat */}
        <Dialog open={isContratDialogOpen} onOpenChange={setIsContratDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter un contrat</DialogTitle>
              <DialogDescription>
                Enregistrer un nouveau contrat pour {selectedEmploye ? `${selectedEmploye.prenom} ${selectedEmploye.nom}` : "l'employé"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="contrat-type">Type de contrat</Label>
                <Select 
                  value={newContrat.type} 
                  onValueChange={(value: ContratEmploye["type"]) => setNewContrat({...newContrat, type: value})}
                >
                  <SelectTrigger id="contrat-type">
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
                <Label htmlFor="contrat-statut">Statut</Label>
                <Select 
                  value={newContrat.statut} 
                  onValueChange={(value: ContratEmploye["statut"]) => setNewContrat({...newContrat, statut: value})}
                >
                  <SelectTrigger id="contrat-statut">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Actif">Actif</SelectItem>
                    <SelectItem value="Terminé">Terminé</SelectItem>
                    <SelectItem value="Résilié">Résilié</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contrat-date-debut">Date de début</Label>
                <Input 
                  id="contrat-date-debut" 
                  type="date" 
                  value={newContrat.date_debut}
                  onChange={(e) => setNewContrat({...newContrat, date_debut: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contrat-date-fin">Date de fin (si applicable)</Label>
                <Input 
                  id="contrat-date-fin" 
                  type="date" 
                  value={newContrat.date_fin || ""}
                  onChange={(e) => setNewContrat({...newContrat, date_fin: e.target.value})}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="contrat-file">Fichier du contrat (optionnel)</Label>
                <div className="flex items-center space-x-2">
                  <Input id="contrat-file" type="file" className="w-full" />
                  <Button type="button" size="sm">
                    <FileUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsContratDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleAddContrat}>Enregistrer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
