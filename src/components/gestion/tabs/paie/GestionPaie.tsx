
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
import { PaySlipDetail } from "./PaySlipDetail";
import { NewPaySlipDialog } from "./NewPaySlipDialog";
import { PaySlipSummaryCards } from "./PaySlipSummaryCards";
import { PaySlipList } from "./PaySlipList";
import { EmployeeList } from "./EmployeeList";

interface GestionPaieProps {
  client: Client;
}

export function GestionPaie({ client }: GestionPaieProps) {
  const {
    employes,
    fichesPaie,
    selectedEmploye,
    setSelectedEmploye,
    selectedFichePaie,
    setSelectedFichePaie,
    isLoading,
    isFichePaieDialogOpen,
    setIsFichePaieDialogOpen,
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
            
            <PaySlipSummaryCards
              totalSalairesBruts={totalSalairesBruts}
              totalChargesPatronales={totalChargesPatronales}
              totalChargesSalariales={totalChargesSalariales}
              totalNetAPayer={totalNetAPayer}
              formatMontant={formatMontant}
            />
            
            <Tabs defaultValue="fiches">
              <TabsList>
                <TabsTrigger value="fiches">Fiches de paie</TabsTrigger>
                <TabsTrigger value="employes">Liste des employés</TabsTrigger>
                <TabsTrigger value="stats">Statistiques</TabsTrigger>
              </TabsList>
              
              <TabsContent value="fiches" className="space-y-4">
                <PaySlipList
                  fichesPaie={fichesPaie}
                  employes={employes}
                  isLoading={isLoading}
                  formatMontant={formatMontant}
                  getNomMois={getNomMois}
                  filteredEmployes={filteredEmployes}
                  onCreateClick={() => {
                    if (filteredEmployes.length > 0) {
                      setSelectedEmploye(filteredEmployes[0]);
                      setIsFichePaieDialogOpen(true);
                    }
                  }}
                  onViewDetails={(fiche, emp) => {
                    setSelectedEmploye(emp || null);
                    setSelectedFichePaie(fiche);
                    setDetailMode(true);
                  }}
                  onDeleteClick={handleDeleteFichePaie}
                />
              </TabsContent>
              
              <TabsContent value="employes" className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={() => setIsFichePaieDialogOpen(true)} disabled={filteredEmployes.length === 0}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle fiche de paie
                  </Button>
                </div>
                
                <EmployeeList
                  filteredEmployes={filteredEmployes}
                  isLoading={isLoading}
                  fichesPaie={fichesPaie}
                  formatMontant={formatMontant}
                  onCreateClick={(employe) => {
                    setSelectedEmploye(employe);
                    setNewFichePaie({
                      ...newFichePaie,
                      employe_id: employe.id,
                      salaire_base: employe.salaire_base
                    });
                    setIsFichePaieDialogOpen(true);
                  }}
                />
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
          selectedFichePaie && (
            <PaySlipDetail
              fiche={selectedFichePaie}
              employe={selectedEmploye}
              client={client}
              getNomMois={getNomMois}
              onStatusChange={handleUpdateFichePaieStatut}
              onBack={() => setDetailMode(false)}
            />
          )
        )}
        
        <NewPaySlipDialog
          open={isFichePaieDialogOpen}
          onOpenChange={setIsFichePaieDialogOpen}
          selectedEmploye={selectedEmploye}
          newFichePaie={newFichePaie}
          setNewFichePaie={setNewFichePaie}
          calculerFichePaie={calculerFichePaie}
          handleAddPrime={handleAddPrime}
          handleRemovePrime={handleRemovePrime}
          handleUpdatePrime={handleUpdatePrime}
          handleAddFichePaie={handleAddFichePaie}
          getNomMois={getNomMois}
          formatMontant={formatMontant}
        />
      </CardContent>
    </Card>
  );
}
