import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileUp, Filter, CreditCard, Clock, Receipt, Check, X, Eye, CreditCard as PartialIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Facture, Paiement } from "@/types/facture";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PaiementPartielDialog } from "../PaiementPartielDialog";

interface GestionPaiementsProps {
  factures: Facture[];
  onUpdateStatus: (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée' | 'partiellement_payée') => void;
  formatMontant: (montant: number) => string;
  onPaiementPartiel?: (factureId: string, paiement: Paiement, prestationsIds: string[]) => Promise<Facture | null>;
}

export const GestionPaiements = ({ 
  factures, 
  onUpdateStatus, 
  formatMontant,
  onPaiementPartiel 
}: GestionPaiementsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showPartialPaymentDialog, setShowPartialPaymentDialog] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("especes");
  const { toast } = useToast();

  const facturesForPayment = factures.filter(f => f.status !== 'payée');
  
  const filteredFactures = facturesForPayment
    .filter(facture => 
      (searchTerm === "" || 
        facture.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        facture.client.nom.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      (statusFilter === "all" || facture.status === statusFilter)
    );
  
  const pendingPayments = facturesForPayment
    .filter(f => f.status === 'en_attente' || f.status === 'envoyée' || f.status === 'partiellement_payée')
    .reduce((sum, f) => {
      const montantPaye = f.montantPaye || 0;
      return sum + (f.montant - montantPaye);
    }, 0);
  
  const confirmedPayments = factures
    .reduce((sum, f) => sum + (f.montantPaye || 0), 0);
  
  const paymentMethods = {
    especes: 0,
    orange_money: 0,
    mtn_mobile: 0,
    virement: 0
  };
  
  factures.forEach(facture => {
    if (facture.paiements && facture.paiements.length > 0) {
      facture.paiements.forEach(paiement => {
        if (paiement.moyenPaiement) {
          paymentMethods[paiement.moyenPaiement as keyof typeof paymentMethods]++;
        }
      });
    } else if (facture.status === 'payée' && facture.moyenPaiement) {
      paymentMethods[facture.moyenPaiement as keyof typeof paymentMethods]++;
    }
  });
  
  const totalPaidFactures = factures
    .flatMap(f => f.paiements || [])
    .length || factures.filter(f => f.status === 'payée' && f.moyenPaiement).length;
  
  const paymentMethodsPercentages = {
    especes: totalPaidFactures > 0 ? Math.round((paymentMethods.especes / totalPaidFactures) * 100) : 0,
    orange_money: totalPaidFactures > 0 ? Math.round((paymentMethods.orange_money / totalPaidFactures) * 100) : 0,
    mtn_mobile: totalPaidFactures > 0 ? Math.round((paymentMethods.mtn_mobile / totalPaidFactures) * 100) : 0,
    virement: totalPaidFactures > 0 ? Math.round((paymentMethods.virement / totalPaidFactures) * 100) : 0
  };
  
  const handleOpenPaymentDialog = (facture: Facture) => {
    setSelectedFacture(facture);
    setPaymentMethod("especes");
    setShowPaymentDialog(true);
  };

  const handleOpenPartialPaymentDialog = (facture: Facture) => {
    setSelectedFacture(facture);
    setShowPartialPaymentDialog(true);
  };
  
  const handleRegisterPayment = async () => {
    if (!selectedFacture) return;
    
    try {
      const newPaiement = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        montant: selectedFacture.montant - (selectedFacture.montantPaye || 0),
        moyenPaiement: paymentMethod
      };
      
      const paiementsArray = selectedFacture.paiements ? 
        [...selectedFacture.paiements, newPaiement] : 
        [newPaiement];
      
      const { error } = await supabase
        .from('factures')
        .update({ 
          status: 'payée', 
          moyen_paiement: paymentMethod,
          montant_paye: selectedFacture.montant,
          paiements: paiementsArray
        })
        .eq('id', selectedFacture.id);
      
      if (error) throw error;
      
      onUpdateStatus(selectedFacture.id, 'payée');
      
      toast({
        title: "Paiement enregistré",
        description: `Le paiement de la facture ${selectedFacture.id} a été enregistré avec succès.`,
      });
      
      setShowPaymentDialog(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du paiement:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le paiement.",
        variant: "destructive"
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "payée":
        return <Badge className="bg-green-500 hover:bg-green-600">Payée</Badge>;
      case "partiellement_payée":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Partiellement payée</Badge>;
      case "en_attente":
        return <Badge variant="secondary">En attente</Badge>;
      case "envoyée":
        return <Badge variant="outline">Envoyée</Badge>;
      default:
        return null;
    }
  };
  
  const getPaymentMethodLabel = (method: string | undefined) => {
    if (!method) return "Non spécifié";
    
    switch (method) {
      case "especes": return "Espèces";
      case "orange_money": return "Orange Money";
      case "mtn_mobile": return "MTN Mobile Money";
      case "virement": return "Virement bancaire";
      default: return method;
    }
  };

  const getMontantRestant = (facture: Facture): number => {
    return facture.montant - (facture.montantPaye || 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Rechercher une facture..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select 
            defaultValue="all" 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="en_attente">En attente</SelectItem>
              <SelectItem value="envoyée">Envoyée</SelectItem>
              <SelectItem value="partiellement_payée">Partiellement payée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="w-5 h-5 text-green-600" />
              Paiements confirmés
            </CardTitle>
            <CardDescription>Total des paiements confirmés</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatMontant(confirmedPayments)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              Paiements en attente
            </CardTitle>
            <CardDescription>Total des paiements en attente</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatMontant(pendingPayments)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Méthodes de paiement
            </CardTitle>
            <CardDescription>Répartition par type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Espèces</span>
                <span className="font-medium">{paymentMethodsPercentages.especes}%</span>
              </div>
              <div className="flex justify-between">
                <span>Orange Money</span>
                <span className="font-medium">{paymentMethodsPercentages.orange_money}%</span>
              </div>
              <div className="flex justify-between">
                <span>MTN Mobile Money</span>
                <span className="font-medium">{paymentMethodsPercentages.mtn_mobile}%</span>
              </div>
              <div className="flex justify-between">
                <span>Virement bancaire</span>
                <span className="font-medium">{paymentMethodsPercentages.virement}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm hover:shadow transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Factures à encaisser</CardTitle>
          <CardDescription>
            {filteredFactures.length} facture(s) en attente de paiement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Réf. Facture</TableHead>
                  <TableHead className="whitespace-nowrap">Client</TableHead>
                  <TableHead className="whitespace-nowrap hidden md:table-cell">Date</TableHead>
                  <TableHead className="whitespace-nowrap min-w-32">Montant</TableHead>
                  <TableHead className="whitespace-nowrap">Déjà payé</TableHead>
                  <TableHead className="whitespace-nowrap">Statut</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFactures.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucune facture en attente de paiement
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFactures.map((facture) => (
                    <TableRow key={facture.id} className="group hover:bg-neutral-50">
                      <TableCell className="font-medium">{facture.id}</TableCell>
                      <TableCell>{facture.client.nom}</TableCell>
                      <TableCell className="hidden md:table-cell">{facture.date}</TableCell>
                      <TableCell>{formatMontant(facture.montant)}</TableCell>
                      <TableCell>
                        {facture.montantPaye ? formatMontant(facture.montantPaye) : "0 FCFA"}
                      </TableCell>
                      <TableCell>{getStatusBadge(facture.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleOpenPaymentDialog(facture)}
                            className="flex items-center gap-1"
                          >
                            <Check className="h-4 w-4" />
                            <span className="hidden sm:inline">Encaisser (Total)</span>
                          </Button>
                          {onPaiementPartiel && (
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              onClick={() => handleOpenPartialPaymentDialog(facture)}
                              className="flex items-center gap-1"
                            >
                              <PartialIcon className="h-4 w-4" />
                              <span className="hidden sm:inline">Paiement partiel</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enregistrer un paiement</DialogTitle>
            <DialogDescription>
              Facture {selectedFacture?.id} - {selectedFacture ? formatMontant(getMontantRestant(selectedFacture)) : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client" className="text-right">
                Client
              </Label>
              <div id="client" className="col-span-3 font-medium">
                {selectedFacture?.client.nom}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="method" className="text-right">
                Moyen de paiement
              </Label>
              <Select defaultValue="especes" value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="method" className="col-span-3">
                  <SelectValue placeholder="Sélectionner un moyen de paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="especes">Espèces</SelectItem>
                  <SelectItem value="orange_money">Orange Money</SelectItem>
                  <SelectItem value="mtn_mobile">MTN Mobile Money</SelectItem>
                  <SelectItem value="virement">Virement bancaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleRegisterPayment}>
              Confirmer le paiement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {onPaiementPartiel && (
        <PaiementPartielDialog
          isOpen={showPartialPaymentDialog}
          onOpenChange={setShowPartialPaymentDialog}
          facture={selectedFacture}
          formatMontant={formatMontant}
          onConfirmPaiement={onPaiementPartiel}
        />
      )}
    </div>
  );
};
