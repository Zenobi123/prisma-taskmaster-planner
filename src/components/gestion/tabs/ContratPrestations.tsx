
import { Client } from "@/types/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Download, Upload, Archive, Clock, Eye } from "lucide-react";

interface ContratPrestationsProps {
  client: Client;
}

export function ContratPrestations({ client }: ContratPrestationsProps) {
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
          <Tabs defaultValue="documents" className="w-full">
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
                <h3 className="text-lg font-medium">Documents liés au contrat</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex gap-2">
                    <Upload className="h-4 w-4" />
                    Importer
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-green-100 hover:border-green-300 transition-all cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-green-600" />
                        <CardTitle className="text-base">Contrat initial</CardTitle>
                      </div>
                      <p className="text-xs text-muted-foreground bg-green-50 px-2 py-1 rounded-full">Actif</p>
                    </div>
                    <CardDescription className="text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Signé le 15/04/2023
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm">Contrat de prestation comptable mensuelle</p>
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
                
                <Card className="border-blue-100 hover:border-blue-300 transition-all cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-base">Avenant n°1</CardTitle>
                      </div>
                      <p className="text-xs text-muted-foreground bg-blue-50 px-2 py-1 rounded-full">En cours</p>
                    </div>
                    <CardDescription className="text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Proposé le 10/09/2023
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm">Extension des prestations - Gestion fiscale</p>
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
                
                <Card className="border-amber-100 hover:border-amber-300 transition-all cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-amber-600" />
                        <CardTitle className="text-base">Annexe technique</CardTitle>
                      </div>
                      <p className="text-xs text-muted-foreground bg-amber-50 px-2 py-1 rounded-full">Document</p>
                    </div>
                    <CardDescription className="text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Ajouté le 15/04/2023
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm">Détails des prestations et livrables</p>
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
                
                <Card className="border-gray-100 hover:border-gray-300 transition-all cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Archive className="h-5 w-5 text-gray-600" />
                        <CardTitle className="text-base">Contrat précédent</CardTitle>
                      </div>
                      <p className="text-xs text-muted-foreground bg-gray-50 px-2 py-1 rounded-full">Archivé</p>
                    </div>
                    <CardDescription className="text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Archivé le 14/04/2023
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm">Contrat initial avant renouvellement</p>
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
              </div>
              
              <div className="mt-6 border-t pt-4">
                <h4 className="text-sm font-medium mb-3">Historique des modifications contractuelles</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md">
                    <div className="h-8 w-8 bg-green-50 flex items-center justify-center rounded-full">
                      <FileText className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Avenant n°1 - Extension des prestations</p>
                      <p className="text-xs text-muted-foreground">Proposé le 10/09/2023 par Alexis Durand</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md">
                    <div className="h-8 w-8 bg-blue-50 flex items-center justify-center rounded-full">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Contrat initial - Signature</p>
                      <p className="text-xs text-muted-foreground">Signé le 15/04/2023 par les deux parties</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md">
                    <div className="h-8 w-8 bg-amber-50 flex items-center justify-center rounded-full">
                      <FileText className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Contrat initial - Proposition</p>
                      <p className="text-xs text-muted-foreground">Proposé le 01/04/2023 par Émilie Morel</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
