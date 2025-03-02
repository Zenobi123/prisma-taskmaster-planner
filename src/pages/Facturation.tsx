
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  FileText, 
  Filter, 
  Download, 
  Printer, 
  Eye, 
  Receipt 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getCollaborateur } from "@/services/collaborateurService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Facturation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [selectedFacture, setSelectedFacture] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isNewFactureDialogOpen, setIsNewFactureDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Vérifier les permissions du collaborateur connecté
  const collaborateurId = localStorage.getItem("collaborateurId");
  
  const { data: collaborateur } = useQuery({
    queryKey: ["collaborateur", collaborateurId],
    queryFn: () => collaborateurId ? getCollaborateur(collaborateurId) : null,
  });

  // Vérification des permissions et redirection si nécessaire
  useEffect(() => {
    if (collaborateur) {
      const hasPermission = collaborateur.permissions?.some(
        p => p.module === "facturation" && ["ecriture", "administration"].includes(p.niveau)
      );
      
      if (!hasPermission) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous n'avez pas les permissions nécessaires pour accéder à la facturation."
        });
        navigate("/");
      }
    }
  }, [collaborateur, toast, navigate]);

  // Si pas de collaborateurId ou pas de permissions, rediriger
  if (!collaborateurId || !collaborateur) {
    return null;
  }

  // Données mockées pour l'exemple
  const factures = [
    {
      id: "F2024-001",
      client: {
        nom: "SARL TechPro",
        id: "client-001",
        adresse: "12 Rue Tech, Yaoundé",
        telephone: "+237 1234567890",
        email: "contact@techpro.cm"
      },
      date: "2024-02-15",
      echeance: "2024-03-15",
      montant: 2500000,
      status: "payée",
      prestations: [
        { description: "Tenue comptable mensuelle", montant: 1500000 },
        { description: "Établissement des états financiers", montant: 1000000 }
      ]
    },
    {
      id: "F2024-002",
      client: {
        nom: "SAS WebDev",
        id: "client-002",
        adresse: "45 Av. Digitale, Douala",
        telephone: "+237 9876543210",
        email: "info@webdev.cm"
      },
      date: "2024-02-10",
      echeance: "2024-03-10",
      montant: 1800000,
      status: "en_attente",
      prestations: [
        { description: "Conseil fiscal", montant: 800000 },
        { description: "Préparation déclarations fiscales", montant: 1000000 }
      ]
    },
    {
      id: "F2024-003",
      client: {
        nom: "EURL ConseilPlus",
        id: "client-003",
        adresse: "8 Blvd Central, Garoua",
        telephone: "+237 5554443330",
        email: "service@conseilplus.cm"
      },
      date: "2024-02-05",
      echeance: "2024-03-05",
      montant: 3200000,
      status: "envoyée",
      prestations: [
        { description: "Audit comptable", montant: 2000000 },
        { description: "Optimisation fiscale", montant: 1200000 }
      ]
    },
  ];

  const filteredFactures = factures.filter((facture) => {
    const matchesSearch =
      facture.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facture.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || facture.status === statusFilter;

    // Filtre par période (simple pour l'exemple)
    const factureDate = new Date(facture.date);
    const currentDate = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(currentDate.getMonth() - 1);
    const lastThreeMonths = new Date();
    lastThreeMonths.setMonth(currentDate.getMonth() - 3);
    
    let matchesPeriod = true;
    if (periodFilter === "this_month") {
      matchesPeriod = factureDate.getMonth() === currentDate.getMonth() && 
                      factureDate.getFullYear() === currentDate.getFullYear();
    } else if (periodFilter === "last_month") {
      matchesPeriod = factureDate.getMonth() === lastMonth.getMonth() && 
                      factureDate.getFullYear() === lastMonth.getFullYear();
    } else if (periodFilter === "last_three_months") {
      matchesPeriod = factureDate >= lastThreeMonths;
    }

    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const formatMontant = (montant: number) => {
    return `${montant.toLocaleString()} F CFA`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "payée":
        return <Badge variant="success">Payée</Badge>;
      case "en_attente":
        return <Badge variant="secondary">En attente</Badge>;
      case "envoyée":
        return <Badge variant="outline">Envoyée</Badge>;
      default:
        return null;
    }
  };

  const handleViewDetails = (facture: any) => {
    setSelectedFacture(facture);
    setShowDetails(true);
  };

  const handlePrintInvoice = (factureId: string) => {
    toast({
      title: "Impression lancée",
      description: `Impression de la facture ${factureId} en cours...`,
    });
    // Logique d'impression à implémenter
  };

  const handleDownloadInvoice = (factureId: string) => {
    toast({
      title: "Téléchargement en cours",
      description: `Téléchargement de la facture ${factureId}...`,
    });
    // Logique de téléchargement à implémenter
  };

  const handleCreateInvoice = (formData: any) => {
    console.log("Nouvelle facture:", formData);
    toast({
      title: "Facture créée",
      description: "La nouvelle facture a été créée avec succès.",
    });
    setIsNewFactureDialogOpen(false);
    // Logique de création de facture à implémenter
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Facturation</h1>
          <p className="text-neutral-600 mt-1">
            Gérez vos factures clients
          </p>
        </div>
        <Dialog open={isNewFactureDialogOpen} onOpenChange={setIsNewFactureDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle facture
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle facture</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer une nouvelle facture client.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="client">Client</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client-001">SARL TechPro</SelectItem>
                    <SelectItem value="client-002">SAS WebDev</SelectItem>
                    <SelectItem value="client-003">EURL ConseilPlus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date d'émission</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="echeance">Date d'échéance</Label>
                  <Input id="echeance" type="date" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Prestations</Label>
                <div className="border rounded-md p-3">
                  <div className="grid grid-cols-12 gap-2 mb-2">
                    <div className="col-span-8">
                      <Input placeholder="Description" />
                    </div>
                    <div className="col-span-4">
                      <Input placeholder="Montant (FCFA)" type="number" />
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-2" size="sm">
                    <Plus className="w-3 h-3 mr-1" /> Ajouter une prestation
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewFactureDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => handleCreateInvoice({})}>
                Créer la facture
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="relative md:col-span-5">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher une facture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="md:col-span-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="payée">Payée</SelectItem>
              <SelectItem value="en_attente">En attente</SelectItem>
              <SelectItem value="envoyée">Envoyée</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-4">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les périodes</SelectItem>
              <SelectItem value="this_month">Ce mois-ci</SelectItem>
              <SelectItem value="last_month">Mois dernier</SelectItem>
              <SelectItem value="last_three_months">3 derniers mois</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Vue Tableau des Factures */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Liste des factures</CardTitle>
          <CardDescription>
            {filteredFactures.length} facture(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Facture</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFactures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucune facture trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredFactures.map((facture) => (
                  <TableRow key={facture.id} className="group">
                    <TableCell className="font-medium">{facture.id}</TableCell>
                    <TableCell>{facture.client.nom}</TableCell>
                    <TableCell>{facture.date}</TableCell>
                    <TableCell>{facture.echeance}</TableCell>
                    <TableCell>{formatMontant(facture.montant)}</TableCell>
                    <TableCell>{getStatusBadge(facture.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(facture)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePrintInvoice(facture.id)}
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownloadInvoice(facture.id)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog pour afficher les détails de la facture */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Détails de la Facture {selectedFacture?.id}
            </DialogTitle>
          </DialogHeader>
          
          {selectedFacture && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Informations facture</h3>
                  <div className="rounded-lg border p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">N° Facture:</span>
                      <span>{selectedFacture.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Date d'émission:</span>
                      <span>{selectedFacture.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Date d'échéance:</span>
                      <span>{selectedFacture.echeance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Statut:</span>
                      <span>{getStatusBadge(selectedFacture.status)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Client</h3>
                  <div className="rounded-lg border p-4 space-y-2">
                    <div className="font-medium">{selectedFacture.client.nom}</div>
                    <div className="text-sm">{selectedFacture.client.adresse}</div>
                    <div className="text-sm">Tél: {selectedFacture.client.telephone}</div>
                    <div className="text-sm">Email: {selectedFacture.client.email}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Prestations</h3>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80%]">Description</TableHead>
                        <TableHead className="text-right">Montant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedFacture.prestations.map((prestation: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell>{prestation.description}</TableCell>
                          <TableCell className="text-right">{formatMontant(prestation.montant)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right font-bold">{formatMontant(selectedFacture.montant)}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </div>
              
              <DialogFooter>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handlePrintInvoice(selectedFacture.id)}>
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimer
                  </Button>
                  <Button onClick={() => handleDownloadInvoice(selectedFacture.id)}>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Facturation;
