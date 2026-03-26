
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Upload, Search, Trash2, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Client } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GestionAdminProps {
  client: Client;
}

interface DocumentAdministratif {
  id: string;
  client_id: string;
  type: string;
  nom: string;
  statut: string;
  date_creation: string;
  date_expiration: string | null;
  description: string | null;
  fichier_url: string | null;
}

const DOCUMENT_TYPES = [
  "Document legal",
  "Document fiscal",
  "Document social",
  "Document comptable",
  "Autre",
];

const DOCUMENT_STATUTS = ["Valide", "En attente", "Expire"];

const emptyForm = {
  nom: "",
  type: DOCUMENT_TYPES[0],
  statut: DOCUMENT_STATUTS[0],
  description: "",
  date_expiration: "",
};

// Procédures administratives informatives (read-only)
const procedures = [
  { id: 1, nom: "Renouvellement licence", echeance: "15/06/2025", responsable: "Direction", statut: "En cours" },
  { id: 2, nom: "Revision statuts", echeance: "22/08/2025", responsable: "Service juridique", statut: "Planifie" },
  { id: 3, nom: "Demande autorisation", echeance: "30/05/2025", responsable: "Direction", statut: "Urgent" },
];

export function GestionAdmin({ client }: GestionAdminProps) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedDoc, setSelectedDoc] = React.useState<DocumentAdministratif | null>(null);
  const [form, setForm] = React.useState(emptyForm);

  const queryKey = ["documents_administratifs", client.id];

  // Fetch documents from Supabase
  const { data: documents = [], isLoading, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents_administratifs")
        .select("*")
        .eq("client_id", client.id)
        .order("date_creation", { ascending: false });

      if (error) throw error;
      return data as DocumentAdministratif[];
    },
  });

  // Add document mutation
  const addMutation = useMutation({
    mutationFn: async (newDoc: typeof form) => {
      const { data, error } = await supabase
        .from("documents_administratifs")
        .insert({
          client_id: client.id,
          nom: newDoc.nom,
          type: newDoc.type,
          statut: newDoc.statut,
          description: newDoc.description || null,
          date_expiration: newDoc.date_expiration || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Document ajoute avec succes");
      setAddDialogOpen(false);
      setForm(emptyForm);
    },
    onError: (error) => {
      toast.error("Erreur lors de l'ajout du document: " + error.message);
    },
  });

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: async (docId: string) => {
      const { error } = await supabase
        .from("documents_administratifs")
        .delete()
        .eq("id", docId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Document supprime avec succes");
      setDeleteDialogOpen(false);
      setSelectedDoc(null);
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression: " + error.message);
    },
  });

  // Filter documents based on search term
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom.trim() || !form.type) {
      toast.error("Veuillez remplir les champs obligatoires (Nom et Type)");
      return;
    }
    addMutation.mutate(form);
  };

  const handleView = (doc: DocumentAdministratif) => {
    if (doc.fichier_url) {
      window.open(doc.fichier_url, "_blank");
    } else {
      setSelectedDoc(doc);
      setViewDialogOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedDoc) {
      deleteMutation.mutate(selectedDoc.id);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("fr-FR");
    } catch {
      return dateStr;
    }
  };

  const getStatutStyle = (statut: string) => {
    const s = statut.toLowerCase();
    if (s === "valide") return "bg-green-100 text-green-800";
    if (s === "en attente") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Administration - {client.nom || client.raisonsociale}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="documents">
          <TabsList>
            <TabsTrigger value="documents">Documents administratifs</TabsTrigger>
            <TabsTrigger value="procedures">Procedures</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un document..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setAddDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Chargement...</span>
                  </div>
                ) : isError ? (
                  <div className="text-center py-8 text-red-500">
                    Erreur lors du chargement des documents.
                  </div>
                ) : filteredDocuments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun document trouve.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date creation</TableHead>
                        <TableHead>Expiration</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.nom}</TableCell>
                          <TableCell>{doc.type}</TableCell>
                          <TableCell>{formatDate(doc.date_creation)}</TableCell>
                          <TableCell>
                            {doc.date_expiration ? formatDate(doc.date_expiration) : "—"}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getStatutStyle(doc.statut)}`}
                            >
                              {doc.statut}
                            </span>
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              title="Voir"
                              onClick={() => handleView(doc)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {doc.fichier_url && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                                title="Telecharger"
                                onClick={() => window.open(doc.fichier_url!, "_blank")}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              title="Supprimer"
                              onClick={() => {
                                setSelectedDoc(doc);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="procedures" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Liste informative des procedures administratives en cours.
            </p>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Procedure</TableHead>
                      <TableHead>Echeance</TableHead>
                      <TableHead>Responsable</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {procedures.map((proc) => (
                      <TableRow key={proc.id}>
                        <TableCell>{proc.nom}</TableCell>
                        <TableCell>{proc.echeance}</TableCell>
                        <TableCell>{proc.responsable}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              proc.statut === "En cours"
                                ? "bg-blue-100 text-blue-800"
                                : proc.statut === "Planifie"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {proc.statut}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Add Document Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un document administratif</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doc-nom">Nom du document *</Label>
              <Input
                id="doc-nom"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                placeholder="Ex: Attestation fiscale"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doc-type">Type *</Label>
              <Select
                value={form.type}
                onValueChange={(value) => setForm({ ...form, type: value })}
              >
                <SelectTrigger id="doc-type">
                  <SelectValue placeholder="Choisir un type" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doc-statut">Statut</Label>
              <Select
                value={form.statut}
                onValueChange={(value) => setForm({ ...form, statut: value })}
              >
                <SelectTrigger id="doc-statut">
                  <SelectValue placeholder="Choisir un statut" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_STATUTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doc-expiration">Date d'expiration</Label>
              <Input
                id="doc-expiration"
                type="date"
                value={form.date_expiration}
                onChange={(e) => setForm({ ...form, date_expiration: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doc-description">Description</Label>
              <Input
                id="doc-description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description optionnelle"
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Annuler
                </Button>
              </DialogClose>
              <Button type="submit" disabled={addMutation.isPending}>
                {addMutation.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                Ajouter
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Document Dialog (when no file URL) */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Details du document</DialogTitle>
          </DialogHeader>
          {selectedDoc && (
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Nom:</span>
                <p>{selectedDoc.nom}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Type:</span>
                <p>{selectedDoc.type}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Statut:</span>
                <p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatutStyle(selectedDoc.statut)}`}>
                    {selectedDoc.statut}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Date de creation:</span>
                <p>{formatDate(selectedDoc.date_creation)}</p>
              </div>
              {selectedDoc.date_expiration && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Date d'expiration:</span>
                  <p>{formatDate(selectedDoc.date_expiration)}</p>
                </div>
              )}
              {selectedDoc.description && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Description:</span>
                  <p>{selectedDoc.description}</p>
                </div>
              )}
              {!selectedDoc.fichier_url && (
                <p className="text-sm text-muted-foreground italic">
                  Aucun fichier attache a ce document.
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fermer</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir supprimer le document "{selectedDoc?.nom}" ?
              Cette action est irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
