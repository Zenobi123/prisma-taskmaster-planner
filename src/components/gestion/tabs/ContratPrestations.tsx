
import { useState } from "react";
import { Client } from "@/types/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Download, Upload, Archive, Clock, Eye, Plus, PenLine, Calendar, Trash2, AlertCircle, CheckCircle2, AlertTriangle, Circle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

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
  nextDueDate?: Date;
  lastCompletedDate?: Date;
}

export function ContratPrestations({ client }: ContratPrestationsProps) {
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
      lastCompletedDate: new Date(2022, 11, 10) // December 10, 2022
    },
    {
      id: "2",
      name: "Forfait suivi-gestion annuelle",
      description: "Suivi comptable et administratif global pour l'exercice en cours",
      isActive: true,
      frequency: "mensuelle",
      nextDueDate: new Date(2023, 9, 30), // October 30, 2023
      lastCompletedDate: new Date(2023, 8, 30) // September 30, 2023
    },
    {
      id: "3",
      name: "Élaboration et mise en ligne DSF N-1",
      description: "Préparation et soumission de la Déclaration Statistique et Fiscale pour l'exercice précédent",
      isActive: false,
      frequency: "annuelle",
      nextDueDate: new Date(2024, 3, 30), // April 30, 2024
    },
    {
      id: "4",
      name: "Production de bulletin de paie",
      description: "Création et gestion des bulletins de salaire pour les employés",
      isActive: false,
      frequency: "mensuelle"
    }
  ]);

  const [isAddingContract, setIsAddingContract] = useState(false);
  const [contractForm, setContractForm] = useState({
    title: "",
    description: "",
    type: "initial" as ContractType,
  });

  const togglePrestation = (id: string) => {
    setPrestations(
      prestations.map(prestation => 
        prestation.id === id 
          ? { ...prestation, isActive: !prestation.isActive }
          : prestation
      )
    );
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

  const getFrequencyColor = (frequency: Prestation["frequency"]) => {
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
          <Tabs defaultValue="prestations" className="w-full">
            <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-transparent">
              <TabsTrigger 
                value="prestations"
                className="data-[state=active]:bg-[#84A98C] data-[state=active]:text-white hover:bg-[#F2FCE2] transition-all"
              >
                Prestations en cours
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
                <Button className="bg-[#84A98C] hover:bg-[#52796F] text-white">
                  <Plus className="h-4 w-4 mr-2" /> Ajouter une prestation
                </Button>
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
                            <Label 
                              htmlFor={`prestation-${prestation.id}`}
                              className={`font-medium ${prestation.isActive ? '' : 'text-gray-500'}`}
                            >
                              {prestation.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {prestation.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getFrequencyColor(prestation.frequency)}`}>
                            {getFrequencyLabel(prestation.frequency)}
                          </span>
                          
                          {prestation.nextDueDate && (
                            <div className="hidden md:block text-right">
                              <p className="text-xs text-muted-foreground">Prochaine échéance</p>
                              <p className="text-sm font-medium">{formatDate(prestation.nextDueDate)}</p>
                            </div>
                          )}
                          
                          <div className="hidden sm:flex items-center justify-center w-8 h-8">
                            {getPrestationStatusIcon(prestation)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 flex gap-3 items-center text-sm text-muted-foreground">
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
              </div>
            </TabsContent>
            
            <TabsContent value="conditions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conditions financières</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Tarification et modalités de paiement
                  </p>
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
