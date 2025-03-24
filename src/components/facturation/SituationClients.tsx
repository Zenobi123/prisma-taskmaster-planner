
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Users, 
  Search, 
  Eye, 
  ArrowUpDown,
  Wallet,
  FileText,
  CreditCard,
  Bell
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { formatMontant } from "@/utils/formatUtils";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useClientFinancial } from "@/hooks/facturation/useClientFinancial";
import ModePaiementBadge from "./paiements/ModePaiementBadge";
import StatusBadge from "./StatusBadge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SituationClients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("nom");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isApplyCreditDialogOpen, setIsApplyCreditDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [selectedCreditId, setSelectedCreditId] = useState<string | null>(null);
  const [selectedReminderMethod, setSelectedReminderMethod] = useState<'email' | 'sms' | 'both'>('email');
  
  const { 
    clientsSummary, 
    clientDetails, 
    selectedClientId, 
    setSelectedClientId,
    isLoading, 
    chartData, 
    fetchClientDetails,
    handleApplyCreditToInvoice,
    handleCreateReminder
  } = useClientFinancial();
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  const filteredClients = clientsSummary
    .filter(client => 
      client.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortColumn as keyof typeof a];
      const bValue = b[sortColumn as keyof typeof b];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "àjour":
        return <Badge className="bg-green-500">À jour</Badge>;
      case "partiel":
        return <Badge className="bg-amber-500">Partiellement payé</Badge>;
      case "retard":
        return <Badge variant="destructive">En retard</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewDetails = async (clientId: string) => {
    setSelectedClientId(clientId);
    await fetchClientDetails(clientId);
    setIsDetailsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(
        typeof dateString === 'string' && dateString.includes('-') 
          ? parseISO(dateString) 
          : new Date(dateString), 
        'dd/MM/yyyy', 
        { locale: fr }
      );
    } catch (error) {
      return dateString;
    }
  };

  const handleOpenApplyCreditDialog = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setIsApplyCreditDialogOpen(true);
  };

  const handleApplyCredit = async () => {
    if (!selectedInvoiceId || !selectedCreditId || !clientDetails) return;
    
    const creditPayment = clientDetails.paiements.find(p => p.id === selectedCreditId);
    if (!creditPayment) return;
    
    await handleApplyCreditToInvoice(selectedInvoiceId, selectedCreditId, creditPayment.montant);
    setIsApplyCreditDialogOpen(false);
    setSelectedInvoiceId(null);
    setSelectedCreditId(null);
  };

  const handleOpenReminderDialog = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setIsReminderDialogOpen(true);
  };

  const handleCreatePaymentReminder = async () => {
    if (!selectedInvoiceId || !selectedReminderMethod) return;
    
    await handleCreateReminder(selectedInvoiceId, selectedReminderMethod);
    setIsReminderDialogOpen(false);
    setSelectedInvoiceId(null);
  };

  const availableCredits = clientDetails?.paiements.filter(p => p.est_credit && !p.facture_id) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5" /> 
            Situation financière des clients
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Rechercher un client..."
              className="pl-8 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-semibold flex items-center gap-1"
                    onClick={() => handleSort('nom')}>
                    Client
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-semibold flex items-center gap-1"
                    onClick={() => handleSort('facturesMontant')}>
                    Total facturé
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-semibold flex items-center gap-1"
                    onClick={() => handleSort('paiementsMontant')}>
                    Total payé
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-semibold flex items-center gap-1"
                    onClick={() => handleSort('solde')}>
                    Solde
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Chargement des données...
                  </TableCell>
                </TableRow>
              ) : filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.id.slice(0, 8)}</TableCell>
                    <TableCell>{client.nom}</TableCell>
                    <TableCell>{formatMontant(client.facturesMontant)}</TableCell>
                    <TableCell>{formatMontant(client.paiementsMontant)}</TableCell>
                    <TableCell className={client.solde >= 0 ? "text-green-600" : "text-red-600"}>
                      {formatMontant(client.solde)}
                    </TableCell>
                    <TableCell>{getStatusBadge(client.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleViewDetails(client.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Aucun client trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Répartition des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[300px]">
            {chartData.length > 0 ? (
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => [`${value} clients`, '']} />
                <Bar 
                  dataKey="total" 
                  fill={(entry: any) => {
                    const name = entry.name;
                    if (name === "À jour") return "#84A98C";
                    if (name === "Partiellement payé") return "#F9C74F";
                    return "#E63946";
                  }}
                />
              </BarChart>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Chargement des données...</p>
              </div>
            )}
          </ChartContainer>
          <div className="mt-6 space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                À jour
              </span>
              <span className="font-medium">
                {chartData.find(d => d.name === "À jour")?.total || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-amber-500 mr-2"></span>
                Partiellement payé
              </span>
              <span className="font-medium">
                {chartData.find(d => d.name === "Partiellement payé")?.total || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
                En retard
              </span>
              <span className="font-medium">
                {chartData.find(d => d.name === "En retard")?.total || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails financiers du client</DialogTitle>
            <DialogDescription>
              {clientDetails?.solde_disponible && clientDetails.solde_disponible > 0 ? (
                <Alert className="mt-2 bg-green-50 border-green-200">
                  <AlertDescription className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-green-500" />
                    Ce client dispose d'un solde positif de {formatMontant(clientDetails.solde_disponible)} 
                    qui peut être utilisé pour ses factures.
                  </AlertDescription>
                </Alert>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="factures" className="mt-4">
            <TabsList className="mb-4">
              <TabsTrigger value="factures">
                <FileText className="h-4 w-4 mr-2" />
                Factures ({clientDetails?.factures?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="paiements">
                <CreditCard className="h-4 w-4 mr-2" />
                Paiements ({clientDetails?.paiements?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="factures">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Échéance</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Payé</TableHead>
                    <TableHead>Restant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientDetails?.factures && clientDetails.factures.length > 0 ? (
                    clientDetails.factures.map((facture) => (
                      <TableRow key={facture.id}>
                        <TableCell className="font-medium">{facture.id}</TableCell>
                        <TableCell>{formatDate(facture.date)}</TableCell>
                        <TableCell>{formatDate(facture.echeance)}</TableCell>
                        <TableCell>{formatMontant(facture.montant)}</TableCell>
                        <TableCell>{formatMontant(facture.montant_paye || 0)}</TableCell>
                        <TableCell className={facture.montant_restant > 0 ? "text-red-600" : "text-green-600"}>
                          {formatMontant(facture.montant_restant)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status_paiement={facture.status_paiement} />
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          {facture.status_paiement !== 'payée' && availableCredits.length > 0 && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenApplyCreditDialog(facture.id)}
                              title="Appliquer une avance"
                            >
                              <Wallet className="h-4 w-4" />
                            </Button>
                          )}
                          {facture.status_paiement !== 'payée' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenReminderDialog(facture.id)}
                              title="Envoyer un rappel"
                            >
                              <Bell className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                        Aucune facture trouvée pour ce client
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="paiements">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Facture</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientDetails?.paiements && clientDetails.paiements.length > 0 ? (
                    clientDetails.paiements.map((paiement) => (
                      <TableRow key={paiement.id}>
                        <TableCell className="font-medium">{paiement.reference}</TableCell>
                        <TableCell>{formatDate(paiement.date)}</TableCell>
                        <TableCell>{formatMontant(paiement.montant)}</TableCell>
                        <TableCell>
                          <ModePaiementBadge mode={paiement.mode} />
                        </TableCell>
                        <TableCell>
                          {paiement.facture_id || (paiement.est_credit ? "Crédit" : "N/A")}
                        </TableCell>
                        <TableCell>
                          {paiement.est_credit ? (
                            <Badge className="bg-blue-500">Avance</Badge>
                          ) : (
                            <Badge variant="outline">Standard</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                        Aucun paiement trouvé pour ce client
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Apply Credit Dialog */}
      <Dialog open={isApplyCreditDialogOpen} onOpenChange={setIsApplyCreditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appliquer une avance à la facture</DialogTitle>
            <DialogDescription>
              Sélectionnez un paiement en avance à appliquer à cette facture.
            </DialogDescription>
          </DialogHeader>
          
          {availableCredits.length > 0 ? (
            <>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Avances disponibles</h4>
                <Select onValueChange={(value) => setSelectedCreditId(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une avance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {availableCredits.map((credit) => (
                        <SelectItem key={credit.id} value={credit.id}>
                          {credit.reference} - {formatMontant(credit.montant)} ({formatDate(credit.date)})
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsApplyCreditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleApplyCredit} disabled={!selectedCreditId}>
                  Appliquer l'avance
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="py-4">
              <Alert>
                <AlertDescription>
                  Aucune avance disponible pour ce client.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Reminder Dialog */}
      <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envoyer un rappel de paiement</DialogTitle>
            <DialogDescription>
              Choisissez la méthode d'envoi du rappel pour cette facture.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Méthode de rappel</h4>
            <Select 
              defaultValue="email"
              onValueChange={(value) => setSelectedReminderMethod(value as 'email' | 'sms' | 'both')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="both">Email et SMS</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReminderDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreatePaymentReminder}>
              Envoyer le rappel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SituationClients;
