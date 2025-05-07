
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, PlusCircle, FileText, Download, Trash2, Calculator, Printer } from "lucide-react";
import { Client } from "@/types/client";
import { usePaie } from "@/hooks/usePaie";
import { Badge } from "@/components/ui/badge";

interface GestionPaieProps {
  client: Client;
}

export function GestionPaie({ client }: GestionPaieProps) {
  const {
    employes,
    fichesPaie,
    fichesPaieEmploye,
    selectedEmploye,
    setSelectedEmploye,
    selectedFichePaie,
    setSelectedFichePaie,
    isLoading,
    isFichePaieDialogOpen,
    setIsFichePaieDialogOpen,
    isGeneratingBulletin,
    setIsGeneratingBulletin,
    moisFiltre,
    setMoisFiltre,
    anneeFiltre,
    setAnneeFiltre,
    newFichePaie,
    setNewFichePaie,
    calculerFichePaie,
    handleAddPrime,
    handleRemovePrime,
    handleUpdatePrime,
    handleAddFichePaie,
    handleUpdateFichePaieStatut,
    handleDeleteFichePaie,
    formatMontant,
    formatDate,
    getNomMois
  } = usePaie(client);

  const [searchTerm, setSearchTerm] = useState("");
  const [detailMode, setDetailMode] = useState(false);

  // Filtrer les employés en fonction du terme de recherche
  const filteredEmployes = employes.filter(emp => 
    emp.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculer les totaux du mois
  const totalSalairesBruts = fichesPaie.reduce((sum, fiche) => sum + (fiche.salaire_brut || 0), 0);
  const totalChargesPatronales = fichesPaie.reduce((sum, fiche) => sum + (fiche.cnps_employeur || 0), 0);
  const totalChargesSalariales = fichesPaie.reduce((sum, fiche) => sum + ((fiche.cnps_employe || 0) + (fiche.irpp || 0)), 0);
  const totalNetAPayer = fichesPaie.reduce((sum, fiche) => sum + (fiche.salaire_net || 0), 0);

  // Statut des fiches de paie
  const getPaiementStatutColor = (statut: string) => {
    switch (statut) {
      case 'Payé':
        return "bg-green-100 text-green-800";
      case 'En cours':
        return "bg-yellow-100 text-yellow-800";
      case 'Annulé':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Paie - {client.nom || client.raisonsociale}</CardTitle>
        <CardDescription>
          Gestion de la paie des employés
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!detailMode ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <Label htmlFor="mois-filtre">Mois</Label>
                  <Select value={moisFiltre.toString()} onValueChange={(value) => setMoisFiltre(parseInt(value))}>
                    <SelectTrigger id="mois-filtre" className="w-32">
                      <SelectValue placeholder="Mois" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((mois) => (
                        <SelectItem key={mois} value={mois.toString()}>
                          {getNomMois(mois)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="annee-filtre">Année</Label>
                  <Select value={anneeFiltre.toString()} onValueChange={(value) => setAnneeFiltre(parseInt(value))}>
                    <SelectTrigger id="annee-filtre" className="w-24">
                      <SelectValue placeholder="Année" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((annee) => (
                        <SelectItem key={annee} value={annee.toString()}>
                          {annee}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un employé..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Salaires bruts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatMontant(totalSalairesBruts)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Charges patronales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatMontant(totalChargesPatronales)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Charges salariales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatMontant(totalChargesSalariales)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Net à payer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatMontant(totalNetAPayer)}</div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="fiches">
              <TabsList>
                <TabsTrigger value="fiches">Fiches de paie</TabsTrigger>
                <TabsTrigger value="employes">Liste des employés</TabsTrigger>
                <TabsTrigger value="stats">Statistiques</TabsTrigger>
              </TabsList>
              
              <TabsContent value="fiches" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Salaire brut</TableHead>
                      <TableHead>Charges</TableHead>
                      <TableHead>Salaire net</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            <span className="ml-2">Chargement...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : fichesPaie.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <p className="text-muted-foreground mb-4">Aucune fiche de paie pour cette période</p>
                          <Button onClick={() => {
                            if (filteredEmployes.length > 0) {
                              setSelectedEmploye(filteredEmployes[0]);
                              setIsFichePaieDialogOpen(true);
                            }
                          }} disabled={filteredEmployes.length === 0}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Créer une fiche de paie
                          </Button>
                        </TableCell>
                      </TableRow>
                    ) : (
                      fichesPaie.map((fiche) => {
                        const employe = employes.find(e => e.id === fiche.employe_id);
                        return (
                          <TableRow key={fiche.id}>
                            <TableCell>
                              {employe ? `${employe.prenom} ${employe.nom}` : "Employé inconnu"}
                              <div className="text-xs text-muted-foreground">{employe?.poste}</div>
                            </TableCell>
                            <TableCell>
                              {getNomMois(fiche.mois)} {fiche.annee}
                            </TableCell>
                            <TableCell>{formatMontant(fiche.salaire_brut)}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-xs">Employé: {formatMontant(fiche.cnps_employe || 0)}</span>
                                <span className="text-xs">Employeur: {formatMontant(fiche.cnps_employeur || 0)}</span>
                                <span className="text-xs">IRPP: {formatMontant(fiche.irpp || 0)}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">{formatMontant(fiche.salaire_net)}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${getPaiementStatutColor(fiche.statut)}`}>
                                {fiche.statut}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="outline" size="sm" onClick={() => {
                                  setSelectedEmploye(employe || null);
                                  setSelectedFichePaie(fiche);
                                  setDetailMode(true);
                                }}>
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Printer className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteFichePaie(fiche.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="employes" className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={() => setIsFichePaieDialogOpen(true)} disabled={filteredEmployes.length === 0}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle fiche de paie
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Poste</TableHead>
                      <TableHead>Salaire base</TableHead>
                      <TableHead>Fiches de paie</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            <span className="ml-2">Chargement...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredEmployes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="text-muted-foreground">Aucun employé trouvé</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEmployes.map((employe) => (
                        <TableRow key={employe.id}>
                          <TableCell>
                            <div className="font-medium">{employe.prenom} {employe.nom}</div>
                          </TableCell>
                          <TableCell>{employe.poste}</TableCell>
                          <TableCell>{formatMontant(employe.salaire_base)}</TableCell>
                          <TableCell>
                            {fichesPaie.filter(f => f.employe_id === employe.id).length}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => {
                              setSelectedEmploye(employe);
                              setNewFichePaie({
                                ...newFichePaie,
                                employe_id: employe.id,
                                salaire_base: employe.salaire_base
                              });
                              setIsFichePaieDialogOpen(true);
                            }}>
                              <PlusCircle className="mr-2 h-4 w-4" /> Créer fiche
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="stats">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-2">Statistiques de paie non disponibles pour le moment</p>
                    <p className="text-sm text-muted-foreground">Les statistiques et graphiques seront disponibles ultérieurement</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="space-y-6">
            {selectedFichePaie && selectedEmploye && (
              <>
                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={() => setDetailMode(false)}>Retour</Button>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Printer className="mr-2 h-4 w-4" /> Imprimer
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" /> Télécharger
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-6 space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{client.raisonsociale || client.nom}</h2>
                      <p className="text-muted-foreground">Bulletin de paie</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Période: {getNomMois(selectedFichePaie.mois)} {selectedFichePaie.annee}</p>
                      <Badge className={getPaiementStatutColor(selectedFichePaie.statut)}>
                        {selectedFichePaie.statut}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-medium mb-2">Informations de l'employé</h3>
                      <div className="space-y-1 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="font-medium">Nom:</span>
                          <span>{selectedEmploye.prenom} {selectedEmploye.nom}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <span className="font-medium">Poste:</span>
                          <span>{selectedEmploye.poste}</span>
                        </div>
                        {selectedEmploye.departement && (
                          <div className="grid grid-cols-2 gap-2">
                            <span className="font-medium">Département:</span>
                            <span>{selectedEmploye.departement}</span>
                          </div>
                        )}
                        {selectedEmploye.numero_cnps && (
                          <div className="grid grid-cols-2 gap-2">
                            <span className="font-medium">N° CNPS:</span>
                            <span>{selectedEmploye.numero_cnps}</span>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          <span className="font-medium">Date d'embauche:</span>
                          <span>{formatDate(selectedEmploye.date_embauche)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Récapitulatif</h3>
                      <div className="space-y-1 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="font-medium">Salaire de base:</span>
                          <span className="text-right">{formatMontant(selectedFichePaie.salaire_base)}</span>
                        </div>
                        {selectedFichePaie.montant_heures_sup > 0 && (
                          <div className="grid grid-cols-2 gap-2">
                            <span className="font-medium">Heures supplémentaires:</span>
                            <span className="text-right">{formatMontant(selectedFichePaie.montant_heures_sup)}</span>
                          </div>
                        )}
                        {selectedFichePaie.total_primes > 0 && (
                          <div className="grid grid-cols-2 gap-2">
                            <span className="font-medium">Primes:</span>
                            <span className="text-right">{formatMontant(selectedFichePaie.total_primes)}</span>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                          <span className="font-medium">Salaire brut:</span>
                          <span className="text-right font-medium">{formatMontant(selectedFichePaie.salaire_brut)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-medium mb-2">Détails des cotisations</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Désignation</TableHead>
                            <TableHead className="text-right">Montant</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>CNPS (4.2%)</TableCell>
                            <TableCell className="text-right">{formatMontant(selectedFichePaie.cnps_employe)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>IRPP</TableCell>
                            <TableCell className="text-right">{formatMontant(selectedFichePaie.irpp)}</TableCell>
                          </TableRow>
                          {selectedFichePaie.cac && (
                            <TableRow>
                              <TableCell>CAC (10% IRPP)</TableCell>
                              <TableCell className="text-right">{formatMontant(selectedFichePaie.cac)}</TableCell>
                            </TableRow>
                          )}
                          {selectedFichePaie.cfc && (
                            <TableRow>
                              <TableCell>CFC (1%)</TableCell>
                              <TableCell className="text-right">{formatMontant(selectedFichePaie.cfc)}</TableCell>
                            </TableRow>
                          )}
                          {selectedFichePaie.tdl && (
                            <TableRow>
                              <TableCell>TDL</TableCell>
                              <TableCell className="text-right">{formatMontant(selectedFichePaie.tdl)}</TableCell>
                            </TableRow>
                          )}
                          <TableRow>
                            <TableCell className="font-medium">Total des retenues</TableCell>
                            <TableCell className="text-right font-medium">{formatMontant(selectedFichePaie.total_retenues)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    
                    {selectedFichePaie.primes && selectedFichePaie.primes.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Détails des primes</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Désignation</TableHead>
                              <TableHead className="text-right">Montant</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedFichePaie.primes.map((prime: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell>{prime.libelle || "Prime"}</TableCell>
                                <TableCell className="text-right">{formatMontant(prime.montant)}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell className="font-medium">Total des primes</TableCell>
                              <TableCell className="text-right font-medium">{formatMontant(selectedFichePaie.total_primes)}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t pt-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Charges patronales:</p>
                      <p className="text-sm">CNPS Employeur (12.95%): {formatMontant(selectedFichePaie.cnps_employeur)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-medium">Net à payer:</p>
                      <p className="text-2xl font-bold">{formatMontant(selectedFichePaie.salaire_net)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Select value={selectedFichePaie.statut} onValueChange={(value) => handleUpdateFichePaieStatut(selectedFichePaie.id, value as 'En cours' | 'Payé' | 'Annulé')}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="Payé">Payé</SelectItem>
                        <SelectItem value="Annulé">Annulé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        
        {/* Modal pour créer une fiche de paie */}
        <Dialog open={isFichePaieDialogOpen} onOpenChange={setIsFichePaieDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Créer une fiche de paie</DialogTitle>
              <DialogDescription>
                {selectedEmploye ? `Établir la fiche de paie pour ${selectedEmploye.prenom} ${selectedEmploye.nom}` : "Veuillez sélectionner un employé"}
              </DialogDescription>
            </DialogHeader>
            
            {selectedEmploye ? (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="paie-mois">Mois</Label>
                    <Select 
                      value={newFichePaie.mois?.toString()} 
                      onValueChange={(value) => setNewFichePaie({...newFichePaie, mois: parseInt(value)})}
                    >
                      <SelectTrigger id="paie-mois">
                        <SelectValue placeholder="Mois" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((mois) => (
                          <SelectItem key={mois} value={mois.toString()}>
                            {getNomMois(mois)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="paie-annee">Année</Label>
                    <Select 
                      value={newFichePaie.annee?.toString()} 
                      onValueChange={(value) => setNewFichePaie({...newFichePaie, annee: parseInt(value)})}
                    >
                      <SelectTrigger id="paie-annee">
                        <SelectValue placeholder="Année" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((annee) => (
                          <SelectItem key={annee} value={annee.toString()}>
                            {annee}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="paie-salaire-base">Salaire de base</Label>
                    <Input 
                      id="paie-salaire-base" 
                      type="number" 
                      value={newFichePaie.salaire_base?.toString() || "0"}
                      onChange={(e) => setNewFichePaie({...newFichePaie, salaire_base: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="paie-heures-sup">Heures supplémentaires</Label>
                    <Input 
                      id="paie-heures-sup" 
                      type="number" 
                      value={newFichePaie.heures_sup?.toString() || "0"}
                      onChange={(e) => setNewFichePaie({...newFichePaie, heures_sup: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="paie-taux-horaire-sup">Taux horaire majoré</Label>
                    <Input 
                      id="paie-taux-horaire-sup" 
                      type="number" 
                      value={newFichePaie.taux_horaire_sup?.toString() || "0"}
                      onChange={(e) => setNewFichePaie({...newFichePaie, taux_horaire_sup: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Primes</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddPrime}>
                      <PlusCircle className="h-4 w-4 mr-1" /> Ajouter une prime
                    </Button>
                  </div>
                  
                  {Array.isArray(newFichePaie.primes) && newFichePaie.primes.map((prime, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input 
                        placeholder="Libellé de la prime" 
                        value={prime.libelle || ""} 
                        onChange={(e) => handleUpdatePrime(index, "libelle", e.target.value)}
                        className="flex-1"
                      />
                      <Input 
                        type="number" 
                        placeholder="Montant" 
                        value={prime.montant?.toString() || "0"} 
                        onChange={(e) => handleUpdatePrime(index, "montant", parseFloat(e.target.value) || 0)}
                        className="w-32"
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleRemovePrime(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => calculerFichePaie()}>
                    <Calculator className="h-4 w-4 mr-2" /> Calculer
                  </Button>
                  <div className="text-right">
                    <p className="text-sm font-medium">Brut calculé: {formatMontant(newFichePaie.salaire_brut || 0)}</p>
                    <p className="text-sm font-medium">Net calculé: {formatMontant(newFichePaie.salaire_net || 0)}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsFichePaieDialogOpen(false)}>Annuler</Button>
                  <Button onClick={handleAddFichePaie}>Enregistrer la fiche de paie</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 flex-col gap-2">
                <p className="text-muted-foreground">Veuillez d'abord sélectionner un employé</p>
                <Button variant="outline" onClick={() => setIsFichePaieDialogOpen(false)}>Fermer</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
