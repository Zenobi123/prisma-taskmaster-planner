
import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Client } from "@/types/client";
import { useDocumentMutations } from "./hooks/useDocumentMutations";
import { useInteractionMutations } from "./hooks/useInteractionMutations";
import { v4 as uuidv4 } from "uuid";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MessageSquare,
  FileText,
  Clock,
  Info,
  FolderOpen,
  Upload,
  Plus,
  Eye
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GestionDossierProps {
  selectedClient: Client;
}

type DocumentStatus = "fourni" | "manquant" | "expire";

interface DocumentItem {
  id?: string;
  name: string;
  required: boolean;
  status: DocumentStatus;
  fileUrl?: string;
}

function getBaseChecklist(clientType: string): DocumentItem[] {
  if (clientType === "morale") {
    return [
      { name: "Statuts", required: true, status: "manquant" },
      { name: "RCCM", required: true, status: "manquant" },
      { name: "NIU", required: true, status: "manquant" },
      { name: "Patente", required: true, status: "manquant" },
      { name: "Attestation de domicile", required: true, status: "manquant" },
      { name: "PV AG", required: false, status: "manquant" },
      { name: "Carte d'identité du dirigeant", required: true, status: "manquant" },
    ];
  }

  return [
    { name: "Carte d'identité", required: true, status: "manquant" },
    { name: "NIU", required: true, status: "manquant" },
    { name: "Patente", required: true, status: "manquant" },
    { name: "Attestation de domicile", required: true, status: "manquant" },
    { name: "Photo d'identité", required: false, status: "manquant" },
  ];
}

function StatusIcon({ status }: { status: DocumentStatus }) {
  switch (status) {
    case "fourni":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "expire":
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case "manquant":
      return <XCircle className="h-5 w-5 text-red-500" />;
  }
}

function StatusBadge({ status }: { status: DocumentStatus }) {
  switch (status) {
    case "fourni":
      return <Badge variant="success">Fourni</Badge>;
    case "expire":
      return (
        <Badge className="border-transparent bg-amber-500 text-white hover:bg-amber-600">
          Expiré
        </Badge>
      );
    case "manquant":
      return <Badge variant="destructive">Manquant</Badge>;
  }
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "Non renseigné";
  try {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function clientStatusLabel(statut: string): string {
  switch (statut) {
    case "actif":
      return "Actif";
    case "inactif":
      return "Inactif";
    case "archive":
      return "Archivé";
    default:
      return statut;
  }
}

function clientStatusVariant(statut: string): "success" | "secondary" | "destructive" {
  switch (statut) {
    case "actif":
      return "success";
    case "inactif":
      return "secondary";
    case "archive":
      return "destructive";
    default:
      return "secondary";
  }
}

export function GestionDossier({ selectedClient }: GestionDossierProps) {
  const { documents: fetchedDocuments, isLoading, saveDocument, updateDocumentStatus, updateDocumentFile } = useDocumentMutations(selectedClient.id);
  const { addInteraction } = useInteractionMutations(selectedClient.id);

  const [newInteractionDesc, setNewInteractionDesc] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});

  const documents = useMemo(() => {
    const baseList = getBaseChecklist(selectedClient.type);

    // Merge base list with fetched documents to get correct statuses
    return baseList.map(baseDoc => {
      const fetchedDoc = fetchedDocuments.find(d => d.nom === baseDoc.name);
      if (fetchedDoc) {
        return {
          ...baseDoc,
          id: fetchedDoc.id,
          status: fetchedDoc.statut as DocumentStatus,
          fileUrl: fetchedDoc.fichier_url,
        };
      }
      return baseDoc;
    });
  }, [selectedClient, fetchedDocuments]);

  const fournisCount = documents.filter((d) => d.status === "fourni").length;
  const totalCount = documents.length;
  const progressValue = totalCount > 0 ? Math.round((fournisCount / totalCount) * 100) : 0;

  const sortedInteractions = useMemo(() => {
    if (!selectedClient.interactions || selectedClient.interactions.length === 0) return [];
    return [...selectedClient.interactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [selectedClient.interactions]);

  const handleStatusChange = (docName: string, docId: string | undefined, newStatus: string) => {
    if (docId) {
      updateDocumentStatus.mutate({ id: docId, statut: newStatus });
    } else {
      saveDocument.mutate({ nom: docName, type: "administratif", statut: newStatus });
    }
  };

  const handleFileChange = (docName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles(prev => ({ ...prev, [docName]: e.target.files![0] }));
    }
  };

  const handleUploadClick = (docName: string, docId: string | undefined) => {
    const file = selectedFiles[docName];
    if (file) {
      if (docId) {
        updateDocumentFile.mutate({ id: docId, file }, {
          onSuccess: () => {
            setSelectedFiles(prev => {
              const newFiles = { ...prev };
              delete newFiles[docName];
              return newFiles;
            });
          }
        });
      } else {
        saveDocument.mutate({ nom: docName, type: "administratif", statut: "fourni", file }, {
          onSuccess: () => {
            setSelectedFiles(prev => {
              const newFiles = { ...prev };
              delete newFiles[docName];
              return newFiles;
            });
          }
        });
      }
    }
  };

  const handleAddInteraction = () => {
    if (!newInteractionDesc.trim()) return;
    addInteraction.mutate({
      id: uuidv4(),
      date: new Date().toISOString(),
      description: newInteractionDesc.trim(),
    }, {
      onSuccess: () => setNewInteractionDesc("")
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion documentaire</CardTitle>
        <CardDescription>
          Mise à jour, gestion documentaire et suivi des interactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="checklist" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="checklist" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Checklist documentaire
            </TabsTrigger>
            <TabsTrigger value="interactions" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Interactions
            </TabsTrigger>
            <TabsTrigger value="historique" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Historique
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Checklist documentaire */}
          <TabsContent value="checklist" className="mt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {fournisCount}/{totalCount} documents fournis
                </span>
                <span className="text-muted-foreground">{progressValue}%</span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>

            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.name}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-3 gap-3 sm:gap-0"
                >
                  <div className="flex items-center gap-3">
                    <StatusIcon status={doc.status} />
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <Badge
                        variant={doc.required ? "default" : "outline"}
                        className="mt-1 text-[10px] px-1.5 py-0"
                      >
                        {doc.required ? "Requis" : "Optionnel"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Select
                      value={doc.status}
                      onValueChange={(val) => handleStatusChange(doc.name, doc.id, val)}
                    >
                      <SelectTrigger className="w-[120px] h-8 text-xs">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manquant">Manquant</SelectItem>
                        <SelectItem value="fourni">Fourni</SelectItem>
                        <SelectItem value="expire">Expiré</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        id={`file-${doc.name}`}
                        className="hidden"
                        onChange={(e) => handleFileChange(doc.name, e)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => document.getElementById(`file-${doc.name}`)?.click()}
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Parcourir
                      </Button>
                      {selectedFiles[doc.name] && (
                        <Button
                          size="sm"
                          className="h-8"
                          onClick={() => handleUploadClick(doc.name, doc.id)}
                        >
                          Uploader
                        </Button>
                      )}

                      {doc.fileUrl && !selectedFiles[doc.name] && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => window.open(doc.fileUrl, '_blank')}
                          title="Voir le document"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Tab 2: Interactions */}
          <TabsContent value="interactions" className="mt-4 space-y-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Nouvelle interaction..."
                className="min-h-[80px]"
                value={newInteractionDesc}
                onChange={(e) => setNewInteractionDesc(e.target.value)}
              />
              <Button
                className="self-end"
                onClick={handleAddInteraction}
                disabled={!newInteractionDesc.trim() || addInteraction.isPending}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>

            {sortedInteractions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  Aucune interaction enregistrée
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Les interactions avec ce client apparaîtront ici.
                </p>
              </div>
            ) : (
              <div className="relative ml-4 space-y-0">
                {/* Vertical timeline line */}
                <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />

                {sortedInteractions.map((interaction, index) => (
                  <div key={interaction.id || index} className="relative pl-6 pb-6 last:pb-0">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 -translate-x-1/2 h-3 w-3 rounded-full border-2 border-primary bg-background" />

                    <div className="rounded-lg border p-3 space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        {formatDate(interaction.date)}
                      </p>
                      <p className="text-sm whitespace-pre-wrap">{interaction.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab 3: Historique */}
          <TabsContent value="historique" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Date de création
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">
                    {formatDate(selectedClient.created_at)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Statut du client
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={clientStatusVariant(selectedClient.statut)}>
                    {clientStatusLabel(selectedClient.statut)}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  Informations clés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <dt className="text-xs text-muted-foreground">NIU</dt>
                    <dd className="text-sm font-medium">{selectedClient.niu || "Non renseigné"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Centre de rattachement</dt>
                    <dd className="text-sm font-medium">
                      {selectedClient.centrerattachement || "Non renseigné"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Secteur d'activité</dt>
                    <dd className="text-sm font-medium">
                      {selectedClient.secteuractivite || "Non renseigné"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Régime fiscal</dt>
                    <dd className="text-sm font-medium">
                      {selectedClient.regimefiscal === "reel"
                        ? "Réel"
                        : selectedClient.regimefiscal === "igs"
                        ? "Impôt Général Synthétique"
                        : selectedClient.regimefiscal === "non_professionnel"
                        ? "Non professionnel"
                        : selectedClient.regimefiscal || "Non renseigné"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Type de client</dt>
                    <dd className="text-sm font-medium">
                      {selectedClient.type === "morale" ? "Personne morale" : "Personne physique"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Gestion de dossiers clients en portefeuille</dt>
                    <dd className="text-sm font-medium">
                      {selectedClient.gestionexternalisee ? "Oui" : "Non"}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
