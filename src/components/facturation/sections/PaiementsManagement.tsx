
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/facturation/table/StatusBadge";
import { PaiementDialog } from "@/components/facturation/PaiementDialog";
import { useFactures } from "@/hooks/useFactures";
import { Facture } from "@/types/facture";
import { formatDate, formatMontant } from "@/components/facturation/table/utils/formatters";
import { PaymentHistoryTable } from "@/components/facturation/factureDetails/PaymentHistoryTable";

export const PaiementsManagement = () => {
  // États locaux
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [isPaiementDialogOpen, setIsPaiementDialogOpen] = useState(false);

  // Récupération des factures
  const { 
    factures, 
    isLoading,
    updateParams,
    handlePaiementPartiel
  } = useFactures({ 
    clientId,
    status: status === "tous" ? undefined : status,
    sortBy: "date",
    sortOrder: "desc"
  });

  // Filtrer uniquement les factures impayées ou partiellement payées
  const facturesNonPayees = factures.filter(
    f => f.status === "non_paye" || f.status === "partiellement_paye"
  );

  // Handlers
  const handleClientChange = (value: string) => {
    setClientId(value === "tous" ? undefined : value);
    updateParams({ clientId: value === "tous" ? undefined : value });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    updateParams({ status: value === "tous" ? undefined : value });
  };

  const handlePaiementClick = (facture: Facture) => {
    setSelectedFacture(facture);
    setIsPaiementDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/3">
              <Label htmlFor="clientFilter">Filtrer par client</Label>
              <Select onValueChange={handleClientChange} defaultValue="tous">
                <SelectTrigger id="clientFilter">
                  <SelectValue placeholder="Tous les clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les clients</SelectItem>
                  {/* Liste de clients à implémenter */}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/3">
              <Label htmlFor="statusFilter">Filtrer par statut</Label>
              <Select onValueChange={handleStatusChange} defaultValue="non_paye">
                <SelectTrigger id="statusFilter">
                  <SelectValue placeholder="Non payées" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les statuts</SelectItem>
                  <SelectItem value="non_paye">Non payées</SelectItem>
                  <SelectItem value="partiellement_paye">Partiellement payées</SelectItem>
                  <SelectItem value="paye">Payées</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/3">
              <Label htmlFor="searchInvoice">Rechercher</Label>
              <Input 
                id="searchInvoice" 
                placeholder="Numéro de facture..." 
                onChange={(e) => updateParams({ q: e.target.value })}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Chargement des factures...</p>
            </div>
          ) : facturesNonPayees.length === 0 ? (
            <div className="text-center p-8 border rounded-md">
              <p className="text-lg mb-2">Aucune facture à payer</p>
              <p className="text-muted-foreground">Toutes les factures ont été réglées.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">N° Facture</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facturesNonPayees.map((facture) => (
                  <TableRow key={facture.id}>
                    <TableCell>{facture.id}</TableCell>
                    <TableCell>{facture.client_nom}</TableCell>
                    <TableCell>{formatDate(facture.date)}</TableCell>
                    <TableCell>{formatDate(facture.echeance)}</TableCell>
                    <TableCell className="text-right">{formatMontant(facture.montant)}</TableCell>
                    <TableCell>
                      <StatusBadge status={facture.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handlePaiementClick(facture)}>
                        Enregistrer paiement
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedFacture && selectedFacture.paiements && selectedFacture.paiements.length > 0 && (
        <PaymentHistoryTable 
          payments={selectedFacture.paiements} 
          formatDate={formatDate} 
        />
      )}

      <PaiementDialog
        facture={selectedFacture}
        isOpen={isPaiementDialogOpen}
        onOpenChange={setIsPaiementDialogOpen}
        onPaiement={handlePaiementPartiel}
      />
    </div>
  );
};
