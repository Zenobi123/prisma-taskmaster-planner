import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Gestion() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("entreprise");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const clientsEnGestion = clients.filter(client => client.gestionexternalisee);
  const selectedClient = clientsEnGestion.find(client => client.id === selectedClientId);

  return (
    <div className="p-8">
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">
            Gestion des dossiers clients
          </h1>
          <p className="text-neutral-600 mt-1">
            Gestion complète des dossiers clients en externalisation
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">
              {clientsEnGestion.length}
            </CardTitle>
            <CardDescription>Clients en gestion</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Sélectionner un client</h2>
        <Select value={selectedClientId || ""} onValueChange={setSelectedClientId}>
          <SelectTrigger className="w-full md:w-[400px]">
            <SelectValue placeholder="Choisir un client à gérer..." />
          </SelectTrigger>
          <SelectContent>
            {clientsEnGestion.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.type === "physique" ? client.nom : client.raisonsociale}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedClient ? (
        <>
          <div className="mb-6">
            <Card className="bg-neutral-50">
              <CardHeader>
                <CardTitle>
                  {selectedClient.type === "physique" 
                    ? selectedClient.nom 
                    : selectedClient.raisonsociale}
                </CardTitle>
                <CardDescription>
                  NIU: {selectedClient.niu} | Centre: {selectedClient.centrerattachement}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Tabs defaultValue="entreprise" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <TabsTrigger value="entreprise">Gestion d'entreprise</TabsTrigger>
              <TabsTrigger value="fiscal">Gestion fiscale</TabsTrigger>
              <TabsTrigger value="comptable">Gestion comptable</TabsTrigger>
              <TabsTrigger value="dossier">Gestion documentaire</TabsTrigger>
            </TabsList>
            
            <TabsContent value="entreprise">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion d'entreprise</CardTitle>
                  <CardDescription>
                    Gestion administrative, RH, contrats, paie et indicateurs de performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card onClick={() => setActiveTab("gestion-admin")} className="cursor-pointer hover:border-primary transition-colors">
                      <CardHeader>
                        <CardTitle className="text-lg">Administration</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Gestion des documents administratifs et processus
                        </p>
                      </CardContent>
                    </Card>
                    <Card onClick={() => setActiveTab("gestion-rh")} className="cursor-pointer hover:border-primary transition-colors">
                      <CardHeader>
                        <CardTitle className="text-lg">Ressources Humaines</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Gestion des contrats et du personnel
                        </p>
                      </CardContent>
                    </Card>
                    <Card onClick={() => setActiveTab("gestion-paie")} className="cursor-pointer hover:border-primary transition-colors">
                      <CardHeader>
                        <CardTitle className="text-lg">Paie</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Gestion des salaires et cotisations
                        </p>
                      </CardContent>
                    </Card>
                    <Card onClick={() => setActiveTab("contrat-prestations")} className="cursor-pointer hover:border-primary transition-colors">
                      <CardHeader>
                        <CardTitle className="text-lg">Notre contrat de prestations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Suivi et gestion de notre contrat
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contrat-prestations">
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
                                {selectedClient?.type === "physique" ? "Personne Physique" : "Personne Morale"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                {selectedClient?.type === "physique" ? "Nom" : "Raison sociale"}
                              </p>
                              <p className="font-medium">
                                {selectedClient?.type === "physique" ? selectedClient?.nom : selectedClient?.raisonsociale}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">NIU</p>
                              <p className="font-medium">{selectedClient?.niu}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Localisation</h3>
                          <div className="grid gap-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Centre de rattachement</p>
                              <p className="font-medium">{selectedClient?.centrerattachement}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Adresse</p>
                              <p className="font-medium">
                                {selectedClient?.adresse.quartier}, {selectedClient?.adresse.ville}
                                {selectedClient?.adresse.lieuDit && ` (${selectedClient.adresse.lieuDit})`}
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
                              <p className="font-medium">{selectedClient?.contact.telephone}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Email</p>
                              <p className="font-medium">{selectedClient?.contact.email}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Informations professionnelles</h3>
                          <div className="grid gap-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Secteur d'activité</p>
                              <p className="font-medium capitalize">{selectedClient?.secteuractivite}</p>
                            </div>
                            {selectedClient?.numerocnps && (
                              <div>
                                <p className="text-sm text-muted-foreground">Numéro CNPS</p>
                                <p className="font-medium">{selectedClient.numerocnps}</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Prestations en cours</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Liste des prestations actuellement en cours
                          </p>
                        </CardContent>
                      </Card>
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
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Documents contractuels</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Contrats et avenants
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="fiscal">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion fiscale</CardTitle>
                  <CardDescription>
                    Suivi des obligations fiscales, optimisation fiscale, interface avec l'administration fiscale
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Obligations fiscales</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Suivi et respect des échéances fiscales
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Optimisation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Stratégies d'optimisation fiscale
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Administration fiscale</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Relations avec l'administration fiscale
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comptable">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion comptable</CardTitle>
                  <CardDescription>
                    Saisie et validation des écritures, automatisation des opérations comptables, génération de rapports financiers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Écritures comptables</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Saisie et validation des écritures
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Automatisation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Automatisation des opérations comptables
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Rapports</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Génération des rapports financiers
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dossier">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion documentaire</CardTitle>
                  <CardDescription>
                    Mise à jour, gestion documentaire et suivi des interactions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Documents</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Gestion et archivage des documents
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Interactions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Suivi des interactions avec le client
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Mises à jour</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Historique des mises à jour du dossier
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Sélectionnez un client</CardTitle>
            <CardDescription>
              Veuillez sélectionner un client pour gérer son dossier
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
