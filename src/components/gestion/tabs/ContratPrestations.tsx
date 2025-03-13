
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Download, Upload, Archive, Clock, Eye, Plus, PenLine, Calendar, Trash2, AlertCircle, CheckCircle2, AlertTriangle, Circle, RefreshCw, Star } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface ContratPrestationsProps {
  client: Client;
}

type ContractStatus = "draft" | "pending" | "active" | "terminated" | "archived";
type ContractType = "initial" | "amendment" | "annex" | "termination";

interface Contract {
  id: string;
  title: string;
  description: string;
  type: ContractType;
  status: ContractStatus;
  createdAt: Date;
  updatedAt: Date;
  signedAt?: Date;
  author: string;
  fileName?: string;
}

interface Prestation {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  frequency: "mensuelle" | "trimestrielle" | "annuelle" | "ponctuelle";
  isRecurrent?: boolean; // Indique si c'est une prestation récurrente sur toute l'année
  nextDueDate?: Date;
  lastCompletedDate?: Date;
  valorisation?: number; // Montant en Franc CFA de la prestation
}

type FinancialCondition = {
  prestationId: string;
  prestationName: string;
  montant: number;
  frequency: Prestation["frequency"];
  isRecurrent: boolean;
};

export function ContratPrestations({ client }: ContratPrestationsProps) {
  const [activeTab, setActiveTab] = useState("prestations");
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: "1",
      title: "Contrat initial",
      description: "Contrat de prestation comptable mensuelle",
      type: "initial",
      status: "active",
      createdAt: new Date(2023, 3, 1), // April 1, 2023
      updatedAt: new Date(2023, 3, 15), // April 15, 2023
      signedAt: new Date(2023, 3, 15), // April 15, 2023
      author: "Émilie Morel",
      fileName: "contrat_initial_client123.pdf"
    },
    {
      id: "2",
      title: "Avenant n°1",
      description: "Extension des prestations - Gestion fiscale",
      type: "amendment",
      status: "pending",
      createdAt: new Date(2023, 8, 10), // September 10, 2023
      updatedAt: new Date(2023, 8, 10), // September 10, 2023
      author: "Alexis Durand",
      fileName: "avenant1_client123.pdf"
    },
    {
      id: "3",
      title: "Annexe technique",
      description: "Détails des prestations et livrables",
      type: "annex",
      status: "active",
      createdAt: new Date(2023, 3, 15), // April 15, 2023
      updatedAt: new Date(2023, 3, 15), // April 15, 2023
      author: "Émilie Morel",
      fileName: "annexe_technique_client123.pdf"
    },
    {
      id: "4",
      title: "Contrat précédent",
      description: "Contrat initial avant renouvellement",
      type: "initial",
      status: "archived",
      createdAt: new Date(2022, 3, 1), // April 1, 2022
      updatedAt: new Date(2022, 3, 14), // April 14, 2022
      signedAt: new Date(2022, 3, 5), // April 5, 2022
      author: "Émilie Morel",
      fileName: "ancien_contrat_client123.pdf"
    }
  ]);

  const [prestations, setPrestations] = useState<Prestation[]>([
    {
      id: "1",
      name: "Renouvellement du dossier fiscal",
      description: "Mise à jour annuelle des informations fiscales et renouvellement des documents administratifs",
      isActive: true,
      frequency: "annuelle",
      nextDueDate: new Date(2023, 11, 15), // December 15, 2023
      lastCompletedDate: new Date(2022, 11, 10), // December 10, 2022
      valorisation: 750000
    },
    {
      id: "2",
      name: "Forfait suivi-gestion annuelle",
      description: "Suivi comptable et administratif global pour l'exercice en cours",
      isActive: true,
      frequency: "mensuelle",
      isRecurrent: true,
      nextDueDate: new Date(2023, 9, 30), // October 30, 2023
      lastCompletedDate: new Date(2023, 8, 30), // September 30, 2023
      valorisation: 350000
    },
    {
      id: "3",
      name: "Élaboration et mise en ligne DSF N-1",
      description: "Préparation et soumission de la Déclaration Statistique et Fiscale pour l'exercice précédent",
      isActive: false,
      frequency: "annuelle",
      nextDueDate: new Date(2024, 3, 30), // April 30, 2024
      valorisation: 1200000
    },
    {
      id: "4",
      name: "Production de bulletin de paie",
      description: "Création et gestion des bulletins de salaire pour les employés",
      isActive: false,
      frequency: "mensuelle",
      isRecurrent: true,
      valorisation: 45000
    }
  ]);

  // État pour les conditions financières
  const [financialConditions, setFinancialConditions] = useState<FinancialCondition[]>([]);

  // États pour la gestion des dialogues
  const [isAddingContract, setIsAddingContract] = useState(false);
  const [isAddingPrestation, setIsAddingPrestation] = useState(false);
  const [isEditingPrestation, setIsEditingPrestation] = useState(false);
  const [selectedPrestationId, setSelectedPrestationId] = useState<string | null>(null);
  const [pendingValorisationId, setPendingValorisationId] = useState<string | null>(null);

  // Chargement initial des conditions financières basées sur les prestations existantes
  useEffect(() => {
    const activeFinancialConditions = prestations
      .filter(p => p.isActive)
      .map(p => ({
        prestationId: p.id,
        prestationName: p.name,
        montant: p.valorisation || 0,
        frequency: p.frequency,
        isRecurrent: p.isRecurrent || false
      }));
    
    setFinancialConditions(activeFinancialConditions);
  }, []);

  // État pour les formulaires
  const [contractForm, setContractForm] = useState({
    title: "",
    description: "",
    type: "initial" as ContractType,
  });

  const [prestationForm, setPrestationForm] = useState<{
    name: string;
    description: string;
    frequency: Prestation["frequency"];
    isRecurrent: boolean;
    nextDueDate: string;
    valorisation: string;
  }>({
    name: "",
    description: "",
    frequency: "mensuelle",
    isRecurrent: false,
    nextDueDate: "",
    valorisation: "",
  });

  // Fonctions pour gérer les prestations
  const togglePrestation = (id: string) => {
    const updatedPrestations = prestations.map(prestation => 
      prestation.id === id 
        ? { ...prestation, isActive: !prestation.isActive }
        : prestation
    );
    
    setPrestations(updatedPrestations);
    
    // Si la prestation est activée
    const toggledPrestation = updatedPrestations.find(p => p.id === id);
    if (toggledPrestation && toggledPrestation.isActive) {
      // Ajouter aux conditions financières si elle est activée
      const existingIndex = financialConditions.findIndex(fc => fc.prestationId === id);
      
      if (existingIndex === -1) {
        // Si la prestation n'a pas encore de valorisation, on demande à l'utilisateur d'en définir une
        if (!toggledPrestation.valorisation) {
          setPendingValorisationId(id);
          setActiveTab("conditions");
          toast.info("Veuillez définir le montant pour cette prestation", {
            description: "La prestation a été activée mais requiert une valorisation financière."
          });
        } else {
          // Sinon on l'ajoute directement aux conditions financières
          setFinancialConditions([
            ...financialConditions,
            {
              prestationId: id,
              prestationName: toggledPrestation.name,
              montant: toggledPrestation.valorisation || 0,
              frequency: toggledPrestation.frequency,
              isRecurrent: toggledPrestation.isRecurrent || false
            }
          ]);
          setActiveTab("conditions");
          toast.success("Prestation activée et ajoutée aux conditions financières");
        }
      }
    } else if (toggledPrestation && !toggledPrestation.isActive) {
      // Retirer des conditions financières si elle est désactivée
      setFinancialConditions(financialConditions.filter(fc => fc.prestationId !== id));
      toast.info("Prestation désactivée et retirée des conditions financières");
    }
  };

  const handleAddPrestation = () => {
    const valorisationValue = prestationForm.valorisation 
      ? parseFloat(prestationForm.valorisation) 
      : undefined;

    const newPrestation: Prestation = {
      id: crypto.randomUUID(),
      name: prestationForm.name,
      description: prestationForm.description,
      isActive: true,
      frequency: prestationForm.frequency,
      isRecurrent: prestationForm.isRecurrent,
      nextDueDate: prestationForm.nextDueDate ? new Date(prestationForm.nextDueDate) : undefined,
      valorisation: valorisationValue
    };

    setPrestations([...prestations, newPrestation]);
    setIsAddingPrestation(false);
    
    // Ajouter aux conditions financières
    if (valorisationValue) {
      setFinancialConditions([
        ...financialConditions,
        {
          prestationId: newPrestation.id,
          prestationName: newPrestation.name,
          montant: valorisationValue,
          frequency: newPrestation.frequency,
          isRecurrent: newPrestation.isRecurrent
        }
      ]);
      setActiveTab("conditions");
      toast.success("Prestation ajoutée et valorisée dans les conditions financières");
    } else {
      setPendingValorisationId(newPrestation.id);
      setActiveTab("conditions");
      toast.info("Veuillez définir le montant pour cette prestation", {
        description: "La prestation a été créée mais requiert une valorisation financière."
      });
    }
    
    resetPrestationForm();
  };

  const handleEditPrestation = () => {
    if (!selectedPrestationId) return;

    const valorisationValue = prestationForm.valorisation 
      ? parseFloat(prestationForm.valorisation) 
      : undefined;

    const updatedPrestations = prestations.map(prestation => 
      prestation.id === selectedPrestationId
        ? { 
            ...prestation, 
            name: prestationForm.name,
            description: prestationForm.description,
            frequency: prestationForm.frequency,
            isRecurrent: prestationForm.isRecurrent,
            nextDueDate: prestationForm.nextDueDate ? new Date(prestationForm.nextDueDate) : undefined,
            valorisation: valorisationValue
          }
        : prestation
    );
    
    setPrestations(updatedPrestations);
    
    // Mettre à jour la condition financière associée si elle existe
    const updatedPrestation = updatedPrestations.find(p => p.id === selectedPrestationId);
    
    if (updatedPrestation && updatedPrestation.isActive) {
      const existingConditionIndex = financialConditions.findIndex(fc => fc.prestationId === selectedPrestationId);
      
      if (existingConditionIndex !== -1) {
        const newFinancialConditions = [...financialConditions];
        newFinancialConditions[existingConditionIndex] = {
          prestationId: selectedPrestationId,
          prestationName: updatedPrestation.name,
          montant: valorisationValue || financialConditions[existingConditionIndex].montant,
          frequency: updatedPrestation.frequency,
          isRecurrent: updatedPrestation.isRecurrent || false
        };
        
        setFinancialConditions(newFinancialConditions);
      } else if (valorisationValue) {
        setFinancialConditions([
          ...financialConditions,
          {
            prestationId: selectedPrestationId,
            prestationName: updatedPrestation.name,
            montant: valorisationValue,
            frequency: updatedPrestation.frequency,
            isRecurrent: updatedPrestation.isRecurrent || false
          }
        ]);
      }
      
      if (valorisationValue) {
        setActiveTab("conditions");
        toast.success("Prestation modifiée et valorisée dans les conditions financières");
      }
    }

    setIsEditingPrestation(false);
    setSelectedPrestationId(null);
    resetPrestationForm();
  };

  const handleDeletePrestation = (id: string) => {
    setPrestations(prestations.filter(prestation => prestation.id !== id));
    
    // Retirer des conditions financières
    setFinancialConditions(financialConditions.filter(fc => fc.prestationId !== id));
    toast.info("Prestation supprimée et retirée des conditions financières");
  };

  const startEditPrestation = (id: string) => {
    const prestation = prestations.find(p => p.id === id);
    if (!prestation) return;

    setPrestationForm({
      name: prestation.name,
      description: prestation.description,
      frequency: prestation.frequency,
      isRecurrent: prestation.isRecurrent || false,
      nextDueDate: prestation.nextDueDate ? formatDateForInput(prestation.nextDueDate) : "",
      valorisation: prestation.valorisation ? prestation.valorisation.toString() : "",
    });

    setSelectedPrestationId(id);
    setIsEditingPrestation(true);
  };

  const resetPrestationForm = () => {
    setPrestationForm({
      name: "",
      description: "",
      frequency: "mensuelle",
      isRecurrent: false,
      nextDueDate: "",
      valorisation: "",
    });
  };

  // Fonctions pour gérer les conditions financières
  const updatePrestationValorisation = (prestationId: string, montant: number) => {
    // Mettre à jour la prestation
    setPrestations(prestations.map(prestation => 
      prestation.id === prestationId
        ? { ...prestation, valorisation: montant }
        : prestation
    ));
    
    // Mettre à jour ou ajouter la condition financière
    const existingIndex = financialConditions.findIndex(fc => fc.prestationId === prestationId);
    const prestation = prestations.find(p => p.id === prestationId);
    
    if (!prestation) return;
    
    if (existingIndex !== -1) {
      const newFinancialConditions = [...financialConditions];
      newFinancialConditions[existingIndex] = {
        ...newFinancialConditions[existingIndex],
        montant
      };
      setFinancialConditions(newFinancialConditions);
    } else {
      setFinancialConditions([
        ...financialConditions,
        {
          prestationId,
          prestationName: prestation.name,
          montant,
          frequency: prestation.frequency,
          isRecurrent: prestation.isRecurrent || false
        }
      ]);
    }
    
    // Réinitialiser l'état de valorisation en attente
    if (pendingValorisationId === prestationId) {
      setPendingValorisationId(null);
      toast.success("Valorisation de la prestation enregistrée avec succès");
    }
  };

  // Fonctions pour gérer les contrats
  const handleAddContract = () => {
    const newContract: Contract = {
      id: crypto.randomUUID(),
      title: contractForm.title,
      description: contractForm.description,
      type: contractForm.type,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      author: "Utilisateur Actuel", // Idéalement, récupérer l'utilisateur connecté
      fileName: `${contractForm.title.toLowerCase().replace(/\s+/g, '_')}_${client.id}.pdf`
    };

    setContracts([newContract, ...contracts]);
    setIsAddingContract(false);
    setContractForm({
      title: "",
      description: "",
      type: "initial"
    });
  };

  // Fonctions utilitaires
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatMontant = (montant: number) => {
    return `${montant.toLocaleString()} F CFA`;
  };

  const contractStatusColor = (status: ContractStatus) => {
    switch (status) {
      case "draft": return "gray";
      case "pending": return "blue";
      case "active": return "green";
      case "terminated": return "red";
      case "archived": return "gray";
    }
  };

  const contractTypeIcon = (type: ContractType) => {
    switch (type) {
      case "initial": return <FileText className="h-5 w-5" />;
      case "amendment": return <PenLine className="h-5 w-5" />;
      case "annex": return <FileText className="h-5 w-5" />;
      case "termination": return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getFrequencyLabel = (frequency: Prestation["frequency"]) => {
    switch (frequency) {
      case "mensuelle": return "Mensuelle";
      case "trimestrielle": return "Trimestrielle";
      case "annuelle": return "Annuelle";
      case "ponctuelle": return "Ponctuelle";
    }
  };

  const getFrequencyColor = (frequency: Prestation["frequency"], isRecurrent?: boolean) => {
    if (frequency === "mensuelle" && isRecurrent) {
      return "bg-indigo-100 text-indigo-700 border border-indigo-300";
    }
    
    switch (frequency) {
      case "mensuelle": return "bg-blue-50 text-blue-700";
      case "trimestrielle": return "bg-purple-50 text-purple-700";
      case "annuelle": return "bg-amber-50 text-amber-700";
      case "ponctuelle": return "bg-gray-50 text-gray-700";
    }
  };

  const getPrestationStatusIcon = (prestation: Prestation) => {
    if (!prestation.isActive) {
      return <Circle className="h-5 w-5 text-gray-400" />;
    }

    if (!prestation.nextDueDate) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }

    const today = new Date();
    const dueDate = new Date(prestation.nextDueDate);
    
    // Si la date d'échéance est dépassée
    if (dueDate < today) {
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    }
    
    // Si la date d'échéance est dans moins de 15 jours
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 15);
    
    if (dueDate <= twoWeeksFromNow) {
      return <Clock className="h-5 w-5 text-blue-500" />;
    }
    
    return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  };

  const getContractTypeLabel = (type: ContractType) => {
    switch (type) {
      case "initial": return "Contrat initial";
      case "amendment": return "Avenant";
      case "annex": return "Annexe";
      case "termination": return "Résiliation";
    }
  };

  const getContractStatusLabel = (status: ContractStatus) => {
    switch (status) {
      case "draft": return "Brouillon";
      case "pending": return "En attente";
      case "active": return "Actif";
      case "terminated": return "Résilié";
      case "archived": return "Archivé";
    }
  };

  const getMontantAnnuel = (fc: FinancialCondition) => {
    if (fc.frequency === "annuelle" || fc.frequency === "ponctuelle") {
      return fc.montant;
    } else if (fc.frequency === "trimestrielle") {
      return fc.montant * 4;
    } else if (fc.frequency === "mensuelle") {
      return fc.montant * 12;
    }
    return fc.montant;
  };

  const getTotalAnnuel = () => {
    return financialConditions.reduce((total, fc) => total + getMontantAnnuel(fc), 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fiche d'identification</CardTitle>
          <CardDescription>
            Informations détaillées du client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Identité</h3>
                <div className="grid gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">
                      {client.type === "physique" ? "Personne Physique" : "Personne Morale"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {client.type === "physique" ? "Nom" : "Raison sociale"}
                    </p>
                    <p className="font-medium">
                      {client.type === "physique" ? client.nom : client.raisonsociale}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">NIU</p>
                    <p className="font-medium">{client.niu}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Localisation</h3>
                <div className="grid gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Centre de rattachement</p>
                    <p className="font-medium">{client.centrerattachement}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Adresse</p>
                    <p className="font-medium">
                      {client.adresse.quartier}, {client.adresse.ville}
                      {client.adresse.lieuDit && ` (${client.adresse.lieuDit})`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Contact</h3>
                <div className="grid gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-medium">{client.contact.telephone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{client.contact.email}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Informations professionnelles</h3>
                <div className="grid gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Secteur d'activité</p>
                    <p className="font-medium capitalize">{client.secteuractivite}</p>
                  </div>
                  {client.numerocnps && (
                    <div>
                      <p className="text-sm text-muted-foreground">Numéro CNPS</p>
                      <p className="font-medium">{client.numerocnps}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prestations de services</CardTitle>
          <CardDescription>
            Détails des prestations convenues avec le client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-transparent">
              <TabsTrigger 
                value="prestations"
                className="data-[state=active]:bg-[#84A98C] data-[state=active]:text-white hover:bg-[#F2FCE2] transition-all"
              >
                Prestations fournies
              </TabsTrigger>
              <TabsTrigger 
                value="conditions"
                className="data-[state=active]:bg-[#84A98C] data-[state=active]:text-white hover:bg-[#F2FCE2] transition-all"
              >
                Conditions financières
              </TabsTrigger>
              <TabsTrigger 
                value="documents"
                className="data-[state=active]:bg-[#84A98C] data-[state=active]:text-white hover:bg-[#F2FCE2] transition-all"
              >
                Documents contractuels
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="prestations" className="mt-6">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium">Prestations proposées</h3>
                <Dialog open={isAddingPrestation} onOpenChange={setIsAddingPrestation}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#84A98C] hover:bg-[#52796F] text-white">
                      <Plus className="h-4 w-4 mr-2" /> Ajouter une prestation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Ajouter une nouvelle prestation</DialogTitle>
                      <DialogDescription>
                        Créez une nouvelle prestation à proposer au client.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="prestation-name" className="text-right">
                          Nom
                        </Label>
                        <Input
                          id="prestation-name"
                          value={prestationForm.name}
                          onChange={(e) => setPrestationForm({...prestationForm, name: e.target.value})}
                          className="col-span-3"
                          placeholder="Ex: Renouvellement du dossier fiscal"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="prestation-description" className="text-right">
                          Description
                        </Label>
                        <Input
                          id="prestation-description"
                          value={prestationForm.description}
                          onChange={(e) => setPrestationForm({...prestationForm, description: e.target.value})}
                          className="col-span-3"
                          placeholder="Décrivez brièvement cette prestation"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="prestation-frequency" className="text-right">
                          Fréquence
                        </Label>
                        <Select 
                          value={prestationForm.frequency} 
                          onValueChange={(value: Prestation["frequency"]) => setPrestationForm({...prestationForm, frequency: value})}
                        >
                          <SelectTrigger className="col-span-3 bg-background border-input">
                            <SelectValue placeholder="Sélectionner la fréquence" />
                          </SelectTrigger>
                          <SelectContent position="popper" className="w-full bg-white shadow-lg border z-50">
                            <ScrollArea className="max-h-[200px]">
                              <SelectItem value="mensuelle">Mensuelle</SelectItem>
                              <SelectItem value="trimestrielle">Trimestrielle</SelectItem>
                              <SelectItem value="annuelle">Annuelle</SelectItem>
                              <SelectItem value="ponctuelle">Ponctuelle</SelectItem>
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="prestation-recurrent" className="text-right">
                          Récurrence
                        </Label>
                        <div className="col-span-3 flex items-center gap-2">
                          <Checkbox 
                            id="prestation-recurrent"
                            checked={prestationForm.isRecurrent}
                            onCheckedChange={(checked) => 
                              setPrestationForm({...prestationForm, isRecurrent: checked === true})
                            }
                          />
                          <Label htmlFor="prestation-recurrent" className="text-sm font-normal cursor-pointer">
                            Prestation récurrente (réalisée sur toute l'année)
                          </Label>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="prestation-due-date" className="text-right">
                          Échéance
                        </Label>
                        <Input
                          id="prestation-due-date"
                          type="date"
                          value={prestationForm.nextDueDate}
                          onChange={(e) => setPrestationForm({...prestationForm, nextDueDate: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="prestation-valorisation" className="text-right">
                          Montant (F CFA)
                        </Label>
                        <Input
                          id="prestation-valorisation"
                          type="number"
                          value={prestationForm.valorisation}
                          onChange={(e) => setPrestationForm({...prestationForm, valorisation: e.target.value})}
                          className="col-span-3"
                          placeholder="Montant facturé"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {
                        setIsAddingPrestation(false);
                        resetPrestationForm();
                      }}>
                        Annuler
                      </Button>
                      <Button 
                        className="bg-[#84A98C] hover:bg-[#52796F]" 
                        onClick={handleAddPrestation}
                        disabled={!prestationForm.name || !prestationForm.description}
                      >
                        Ajouter la prestation
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-4">
                {prestations.map((prestation) => (
                  <Card 
                    key={prestation.id} 
                    className={`border-l-4 ${prestation.isActive ? 'border-l-green-500' : 'border-l-gray-200'} transition-all hover:shadow-md`}
                  >
                    <CardContent className="p-0">
                      <div className="flex items-center p-4">
                        <div className="flex gap-3 items-center flex-1">
                          <div className="flex items-center h-5">
                            <Checkbox 
                              id={`prestation-${prestation.id}`}
                              checked={prestation.isActive}
                              onCheckedChange={() => togglePrestation(prestation.id)}
                              className="h-5 w-5 rounded-full data-[state=checked]:bg-green-500 data-[state=checked]:text-white border-gray-300"
                            />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Label 
                                htmlFor={`prestation-${prestation.id}`}
                                className={`font-medium ${prestation.isActive ? '' : 'text-gray-500'}`}
                              >
                                {prestation.name}
                              </Label>
                              {prestation.isRecurrent && (
                                <span title="Prestation récurrente sur toute l'année">
                                  <RefreshCw className="h-4 w-4 text-indigo-500" />
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {prestation.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getFrequencyColor(prestation.frequency, prestation.isRecurrent)}`}>
                            {prestation.isRecurrent && prestation.frequency === "mensuelle" ? (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                <span>Mensuelle (annualisée)</span>
                              </div>
                            ) : (
                              getFrequencyLabel(prestation.frequency)
                            )}
                          </span>
                          
                          {prestation.valorisation && (
                            <div className="hidden md:block text-right">
                              <p className="text-xs text-muted-foreground">Montant</p>
                              <p className="text-sm font-medium">{formatMontant(prestation.valorisation)}</p>
                            </div>
                          )}
                          
                          {prestation.nextDueDate && (
                            <div className="hidden md:block text-right">
                              <p className="text-xs text-muted-foreground">Prochaine échéance</p>
                              <p className="text-sm font-medium">{formatDate(prestation.nextDueDate)}</p>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => startEditPrestation(prestation.id)}
                            >
                              <PenLine className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:text-red-500"
                              onClick={() => handleDeletePrestation(prestation.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="hidden sm:flex items-center justify-center w-8 h-8">
                            {getPrestationStatusIcon(prestation)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Dialogue pour modifier une prestation */}
              <Dialog open={isEditingPrestation} onOpenChange={setIsEditingPrestation}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Modifier la prestation</DialogTitle>
                    <DialogDescription>
                      Modifiez les détails de cette prestation.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-prestation-name" className="text-right">
                        Nom
                      </Label>
                      <Input
                        id="edit-prestation-name"
                        value={prestationForm.name}
                        onChange={(e) => setPrestationForm({...prestationForm, name: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-prestation-description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="edit-prestation-description"
                        value={prestationForm.description}
                        onChange={(e) => setPrestationForm({...prestationForm, description: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-prestation-frequency" className="text-right">
                        Fréquence
                      </Label>
                      <Select 
                        value={prestationForm.frequency} 
                        onValueChange={(value: Prestation["frequency"]) => setPrestationForm({...prestationForm, frequency: value})}
                      >
                        <SelectTrigger className="col-span-3 bg-background border-input">
                          <SelectValue placeholder="Sélectionner la fréquence" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="w-full bg-white shadow-lg border z-50">
                          <ScrollArea className="max-h-[200px]">
                            <SelectItem value="mensuelle">Mensuelle</SelectItem>
                            <SelectItem value="trimestrielle">Trimestrielle</SelectItem>
                            <SelectItem value="annuelle">Annuelle</SelectItem>
                            <SelectItem value="ponctuelle">Ponctuelle</SelectItem>
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-prestation-recurrent" className="text-right">
                        Récurrence
                      </Label>
                      <div className="col-span-3 flex items-center gap-2">
                        <Checkbox 
                          id="edit-prestation-recurrent"
                          checked={prestationForm.isRecurrent}
                          onCheckedChange={(checked) => 
                            setPrestationForm({...prestationForm, isRecurrent: checked === true})
                          }
                        />
                        <Label htmlFor="edit-prestation-recurrent" className="text-sm font-normal cursor-pointer">
                          Prestation récurrente (réalisée sur toute l'année)
                        </Label>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-prestation-due-date" className="text-right">
                        Échéance
                      </Label>
                      <Input
                        id="edit-prestation-due-date"
                        type="date"
                        value={prestationForm.nextDueDate}
                        onChange={(e) => setPrestationForm({...prestationForm, nextDueDate: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-prestation-valorisation" className="text-right">
                        Montant (F CFA)
                      </Label>
                      <Input
                        id="edit-prestation-valorisation"
                        type="number"
                        value={prestationForm.valorisation}
                        onChange={(e) => setPrestationForm({...prestationForm, valorisation: e.target.value})}
                        className="col-span-3"
                        placeholder="Montant facturé"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setIsEditingPrestation(false);
                      setSelectedPrestationId(null);
                      resetPrestationForm();
                    }}>
                      Annuler
                    </Button>
                    <Button 
                      className="bg-[#84A98C] hover:bg-[#52796F]" 
                      onClick={handleEditPrestation}
                      disabled={!prestationForm.name || !prestationForm.description}
                    >
                      Enregistrer les modifications
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <div className="mt-6 flex flex-wrap gap-3 items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> 
                  <span>À jour</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-blue-500" /> 
                  <span>À venir dans les 15 jours</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> 
                  <span>En retard</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="h-4 w-4 text-indigo-500" /> 
                  <span>Récurrente</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-indigo-500" /> 
                  <span>Mensuelle sur toute l'année</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="conditions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conditions financières</CardTitle>
                  <CardDescription>
                    Tarification et modalités de paiement des prestations fournies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <h3 className="text-base font-medium">Valorisation des prestations</h3>
                    
                    {financialConditions.length > 0 ? (
                      <div className="rounded-md border">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Prestation</th>
                              <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Fréquence</th>
                              <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Montant</th>
                              <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Total annuel</th>
                              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {financialConditions.map((fc) => (
                              <tr key={fc.prestationId} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm">
                                  <div className="font-medium">{fc.prestationName}</div>
                                  {fc.isRecurrent && fc.frequency === "mensuelle" && (
                                    <div className="text-xs text-indigo-600 flex items-center gap-1">
                                      <Star className="h-3 w-3" /> Mensuelle (annualisée)
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-center text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs ${getFrequencyColor(fc.frequency, fc.isRecurrent)}`}>
                                    {getFrequencyLabel(fc.frequency)}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center text-sm">
                                  {pendingValorisationId === fc.prestationId ? (
                                    <div className="flex gap-2 items-center justify-center">
                                      <Input
                                        type="number"
                                        className="w-24 h-8 text-sm"
                                        placeholder="F CFA"
                                        defaultValue={fc.montant.toString()}
                                        onBlur={(e) => {
                                          const value = parseFloat(e.target.value);
                                          if (!isNaN(value)) {
                                            updatePrestationValorisation(fc.prestationId, value);
                                          }
                                        }}
                                      />
                                      <Button 
                                        size="sm"
                                        variant="outline"
                                        className="h-8 px-2"
                                        onClick={() => setPendingValorisationId(null)}
                                      >
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div 
                                      className="font-medium cursor-pointer hover:text-blue-600"
                                      onClick={() => setPendingValorisationId(fc.prestationId)}
                                    >
                                      {formatMontant(fc.montant)}
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-center text-sm font-medium">
                                  {formatMontant(getMontantAnnuel(fc))}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 hover:text-blue-600"
                                    onClick={() => {
                                      // Trouver la prestation correspondante et l'ouvrir en édition
                                      const prestation = prestations.find(p => p.id === fc.prestationId);
                                      if (prestation) {
                                        startEditPrestation(fc.prestationId);
                                      }
                                    }}
                                  >
                                    <PenLine className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-gray-50 font-medium">
                              <td colSpan={3} className="px-4 py-3 text-right text-sm">
                                Total annuel des prestations
                              </td>
                              <td className="px-4 py-3 text-center text-sm font-bold">
                                {formatMontant(getTotalAnnuel())}
                              </td>
                              <td></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-10 border rounded-lg bg-gray-50">
                        <p className="text-muted-foreground">
                          Aucune prestation n'a été valorisée. Activez des prestations pour les ajouter ici.
                        </p>
                        <Button 
                          className="mt-4 bg-[#84A98C] hover:bg-[#52796F]"
                          onClick={() => setActiveTab("prestations")}
                        >
                          Gérer les prestations
                        </Button>
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <h3 className="text-base font-medium mb-4">Modalités de paiement</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="py-3">
                            <CardTitle className="text-base">Périodicité de facturation</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Select defaultValue="mensuelle">
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionner la périodicité" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mensuelle">Mensuelle</SelectItem>
                                <SelectItem value="trimestrielle">Trimestrielle</SelectItem>
                                <SelectItem value="semestrielle">Semestrielle</SelectItem>
                                <SelectItem value="annuelle">Annuelle</SelectItem>
                              </SelectContent>
                            </Select>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="py-3">
                            <CardTitle className="text-base">Délai de paiement</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Select defaultValue="30">
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionner le délai" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">Paiement à réception</SelectItem>
                                <SelectItem value="15">15 jours</SelectItem>
                                <SelectItem value="30">30 jours</SelectItem>
                                <SelectItem value="45">45 jours</SelectItem>
                                <SelectItem value="60">60 jours</SelectItem>
                              </SelectContent>
                            </Select>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-6">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium">Gestion des contrats</h3>
                <div className="flex gap-2">
                  <Dialog open={isAddingContract} onOpenChange={setIsAddingContract}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#84A98C] hover:bg-[#52796F] text-white">
                        <Plus className="h-4 w-4 mr-2" /> Nouveau document
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Ajouter un nouveau document contractuel</DialogTitle>
                        <DialogDescription>
                          Créez un nouveau document lié au contrat avec ce client.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="contract-type" className="text-right">
                            Type
                          </Label>
                          <Select 
                            value={contractForm.type} 
                            onValueChange={(value: ContractType) => setContractForm({...contractForm, type: value})}
                          >
                            <SelectTrigger className="col-span-3 bg-background border-input">
                              <SelectValue placeholder="Sélectionner le type de document" />
                            </SelectTrigger>
                            <SelectContent position="popper" className="w-full bg-white shadow-lg border z-50">
                              <ScrollArea className="max-h-[200px]">
                                <SelectItem value="initial">Contrat initial</SelectItem>
                                <SelectItem value="amendment">Avenant</SelectItem>
                                <SelectItem value="annex">Annexe</SelectItem>
                                <SelectItem value="termination">Résiliation</SelectItem>
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="title" className="text-right">
                            Titre
                          </Label>
                          <Input
                            id="title"
                            value={contractForm.title}
                            onChange={(e) => setContractForm({...contractForm, title: e.target.value})}
                            className="col-span-3"
                            placeholder="Ex: Contrat de prestation comptable"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Input
                            id="description"
                            value={contractForm.description}
                            onChange={(e) => setContractForm({...contractForm, description: e.target.value})}
                            className="col-span-3"
                            placeholder="Décrivez brièvement ce document"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="file" className="text-right">
                            Fichier
                          </Label>
                          <Input
                            id="file"
                            type="file"
                            className="col-span-3"
                            accept=".pdf,.docx,.doc"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingContract(false)}>Annuler</Button>
                        <Button 
                          className="bg-[#84A98C] hover:bg-[#52796F]" 
                          onClick={handleAddContract}
                          disabled={!contractForm.title || !contractForm.description}
                        >
                          Créer le document
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" className="flex gap-2">
                    <Upload className="h-4 w-4" />
                    Importer
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contracts.map((contract) => (
                  <Card 
                    key={contract.id}
                    className={`border-${contractStatusColor(contract.status)}-100 hover:border-${contractStatusColor(contract.status)}-300 transition-all cursor-pointer`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className={`text-${contractStatusColor(contract.status)}-600`}>
                            {contractTypeIcon(contract.type)}
                          </div>
                          <CardTitle className="text-base">{contract.title}</CardTitle>
                        </div>
                        <p className={`text-xs text-muted-foreground bg-${contractStatusColor(contract.status)}-50 px-2 py-1 rounded-full`}>
                          {getContractStatusLabel(contract.status)}
                        </p>
                      </div>
                      <CardDescription className="text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" /> 
                        {contract.signedAt 
                          ? `Signé le ${formatDate(contract.signedAt)}` 
                          : `Créé le ${formatDate(contract.createdAt)}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm">{contract.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                            <Eye className="h-3 w-3 mr-1" /> Visualiser
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                            <Download className="h-3 w-3 mr-1" /> Télécharger
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium">Historique des modifications contractuelles</h4>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px] bg-background border-input h-8 text-xs">
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="w-full bg-white shadow-lg border z-50">
                      <ScrollArea className="max-h-[200px]">
                        <SelectItem value="all">Tous les types</SelectItem>
                        <SelectItem value="initial">Contrats initiaux</SelectItem>
                        <SelectItem value="amendment">Avenants</SelectItem>
                        <SelectItem value="annex">Annexes</SelectItem>
                        <SelectItem value="termination">Résiliations</SelectItem>
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  {contracts
                    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                    .map((contract) => (
                      <div key={contract.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md group">
                        <div className={`h-8 w-8 bg-${contractStatusColor(contract.status)}-50 flex items-center justify-center rounded-full`}>
                          <div className={`text-${contractStatusColor(contract.status)}-600`}>
                            {contractTypeIcon(contract.type)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{contract.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {contract.status === "active" ? "Actif depuis " : contract.status === "pending" ? "Proposé le " : "Modifié le "}
                            {formatDate(contract.updatedAt)} par {contract.author}
                          </p>
                        </div>
                        <div className="hidden group-hover:flex gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <PenLine className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                          {contract.status !== "active" && (
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
                
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Voir l'historique complet
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
