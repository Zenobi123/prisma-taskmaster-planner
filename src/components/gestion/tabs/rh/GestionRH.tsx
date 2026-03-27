
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserPlus, FileText, Edit, Trash2, Loader2, CalendarClock } from "lucide-react";
import { Client } from "@/types/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface GestionRHProps {
  client: Client;
}

interface Employe {
  id: string;
  client_id: string;
  nom: string;
  prenom: string;
  poste: string;
  date_embauche: string;
  salaire_base: number;
  numero_cnps: string | null;
  statut: string;
  departement: string | null;
  type_contrat: string | null;
  created_at: string;
  updated_at: string;
}

interface EmployeFormData {
  nom: string;
  prenom: string;
  poste: string;
  date_embauche: string;
  salaire_base: string;
  numero_cnps: string;
  statut: string;
  departement: string;
  type_contrat: string;
}

const emptyFormData: EmployeFormData = {
  nom: "",
  prenom: "",
  poste: "",
  date_embauche: "",
  salaire_base: "",
  numero_cnps: "",
  statut: "Actif",
  departement: "",
  type_contrat: "CDI",
};

export function GestionRH({ client }: GestionRHProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingEmploye, setEditingEmploye] = React.useState<Employe | null>(null);
  const [formData, setFormData] = React.useState<EmployeFormData>(emptyFormData);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  // Fetch employees from Supabase
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employes", client.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employes")
        .select("*")
        .eq("client_id", client.id)
        .order("nom", { ascending: true });

      if (error) throw error;
      return data as Employe[];
    },
  });

  // Add employee mutation
  const addMutation = useMutation({
    mutationFn: async (data: EmployeFormData) => {
      const { error } = await supabase.from("employes").insert({
        client_id: client.id,
        nom: data.nom,
        prenom: data.prenom,
        poste: data.poste,
        date_embauche: data.date_embauche,
        salaire_base: parseFloat(data.salaire_base) || 0,
        numero_cnps: data.numero_cnps || null,
        statut: data.statut || "Actif",
        departement: data.departement || null,
        type_contrat: data.type_contrat || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employes", client.id] });
      toast.success("Employé ajouté avec succès");
      closeDialog();
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de l'ajout: " + error.message);
    },
  });

  // Update employee mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EmployeFormData }) => {
      const { error } = await supabase
        .from("employes")
        .update({
          nom: data.nom,
          prenom: data.prenom,
          poste: data.poste,
          date_embauche: data.date_embauche,
          salaire_base: parseFloat(data.salaire_base) || 0,
          numero_cnps: data.numero_cnps || null,
          statut: data.statut || "Actif",
          departement: data.departement || null,
          type_contrat: data.type_contrat || null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employes", client.id] });
      toast.success("Employé modifié avec succès");
      closeDialog();
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de la modification: " + error.message);
    },
  });

  // Delete employee mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("employes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employes", client.id] });
      toast.success("Employé supprimé avec succès");
      setDeleteConfirmId(null);
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de la suppression: " + error.message);
    },
  });

  const openAddDialog = () => {
    setEditingEmploye(null);
    setFormData(emptyFormData);
    setDialogOpen(true);
  };

  const openEditDialog = (employe: Employe) => {
    setEditingEmploye(employe);
    setFormData({
      nom: employe.nom,
      prenom: employe.prenom,
      poste: employe.poste,
      date_embauche: employe.date_embauche,
      salaire_base: String(employe.salaire_base),
      numero_cnps: employe.numero_cnps || "",
      statut: employe.statut,
      departement: employe.departement || "",
      type_contrat: employe.type_contrat || "CDI",
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingEmploye(null);
    setFormData(emptyFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.prenom || !formData.poste || !formData.date_embauche || !formData.salaire_base) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    if (editingEmploye) {
      updateMutation.mutate({ id: editingEmploye.id, data: formData });
    } else {
      addMutation.mutate(formData);
    }
  };

  const updateField = (field: keyof EmployeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isMutating = addMutation.isPending || updateMutation.isPending;

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    return (
      emp.nom.toLowerCase().includes(term) ||
      emp.prenom.toLowerCase().includes(term) ||
      emp.poste.toLowerCase().includes(term) ||
      (emp.departement || "").toLowerCase().includes(term)
    );
  });

  // Derive contracts from employee data
  const contracts = employees.map((emp) => ({
    id: emp.id,
    type: emp.type_contrat || "CDI",
    employe: `${emp.nom} ${emp.prenom}`,
    debut: emp.date_embauche,
    statut: emp.statut,
  }));

  const filteredContracts = contracts.filter((c) => {
    const term = searchTerm.toLowerCase();
    return c.employe.toLowerCase().includes(term) || c.type.toLowerCase().includes(term);
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("fr-FR");
    } catch {
      return dateStr;
    }
  };

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(amount) + " F CFA";
  };

  // Employee row rendering (mobile)
  const renderEmployeeRow = (employee: Employe) => {
    if (isMobile) {
      return (
        <TableRow key={employee.id} className="hover:bg-gray-50">
          <TableCell className="p-3">
            <div className="flex flex-col">
              <div className="font-medium">
                {employee.nom} {employee.prenom}
              </div>
              <div className="text-xs text-muted-foreground">{employee.poste}</div>
              {employee.departement && (
                <div className="text-xs text-muted-foreground mt-1">{employee.departement}</div>
              )}
              <div className="text-xs mt-2">Embauché le: {formatDate(employee.date_embauche)}</div>
              <div className="text-xs mt-1">{formatSalary(employee.salaire_base)}</div>
              <div className="mt-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    employee.statut === "Actif"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {employee.statut}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(employee)}>
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => setDeleteConfirmId(employee.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Supprimer
                </Button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return (
      <TableRow key={employee.id}>
        <TableCell>{employee.nom}</TableCell>
        <TableCell>{employee.prenom}</TableCell>
        <TableCell>{employee.poste}</TableCell>
        <TableCell>{employee.departement || "-"}</TableCell>
        <TableCell>{formatDate(employee.date_embauche)}</TableCell>
        <TableCell>{formatSalary(employee.salaire_base)}</TableCell>
        <TableCell>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              employee.statut === "Actif"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {employee.statut}
          </span>
        </TableCell>
        <TableCell className="text-right">
          <Button
            variant="outline"
            size="sm"
            className="mr-1"
            onClick={() => openEditDialog(employee)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => setDeleteConfirmId(employee.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  // Contract row rendering
  const renderContractRow = (contract: (typeof contracts)[0]) => {
    if (isMobile) {
      return (
        <TableRow key={contract.id} className="hover:bg-gray-50">
          <TableCell className="p-3">
            <div className="flex flex-col">
              <div className="font-medium">{contract.employe}</div>
              <div className="flex items-center mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs mr-2 ${
                    contract.statut === "Actif"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {contract.statut}
                </span>
                <span className="text-xs font-medium">{contract.type}</span>
              </div>
              <div className="text-xs mt-2">
                <div>Début: {formatDate(contract.debut)}</div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return (
      <TableRow key={contract.id}>
        <TableCell>{contract.type}</TableCell>
        <TableCell>{contract.employe}</TableCell>
        <TableCell>{formatDate(contract.debut)}</TableCell>
        <TableCell>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              contract.statut === "Actif"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {contract.statut}
          </span>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Ressources Humaines - {client.nom || client.raisonsociale}
          </CardTitle>
          <CardDescription className="text-sm">
            Gestion des employés, contrats et congés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="employees">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="employees" className="flex-1">
                Employés
              </TabsTrigger>
              <TabsTrigger value="contracts" className="flex-1">
                Contrats
              </TabsTrigger>
              <TabsTrigger value="absences" className="flex-1">
                Congés
              </TabsTrigger>
            </TabsList>

            <TabsContent value="employees" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un employé..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button className="w-full sm:w-auto" onClick={openAddDialog}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Ajouter un employé
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Chargement...</span>
                  </div>
                ) : (
                  <Table>
                    {!isMobile && (
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Prénom</TableHead>
                          <TableHead>Poste</TableHead>
                          <TableHead>Département</TableHead>
                          <TableHead>Date d'embauche</TableHead>
                          <TableHead>Salaire</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                    )}
                    <TableBody>
                      {filteredEmployees.map(renderEmployeeRow)}
                      {filteredEmployees.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={isMobile ? 1 : 8}
                            className="text-center py-6 text-muted-foreground"
                          >
                            Aucun employé trouvé
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>

            <TabsContent value="contracts" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un contrat..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Chargement...</span>
                  </div>
                ) : (
                  <Table>
                    {!isMobile && (
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Employé</TableHead>
                          <TableHead>Date de début</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                    )}
                    <TableBody>
                      {filteredContracts.map(renderContractRow)}
                      {filteredContracts.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={isMobile ? 1 : 4}
                            className="text-center py-6 text-muted-foreground"
                          >
                            Aucun contrat trouvé
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>

            <TabsContent value="absences">
              <div className="border rounded-lg overflow-hidden">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Chargement...</span>
                  </div>
                ) : employees.length > 0 ? (
                  <>
                    <Table>
                      {!isMobile && (
                        <TableHeader>
                          <TableRow>
                            <TableHead>Employé</TableHead>
                            <TableHead>Poste</TableHead>
                            <TableHead>Statut</TableHead>
                          </TableRow>
                        </TableHeader>
                      )}
                      <TableBody>
                        {employees.map((emp) => (
                          <TableRow key={emp.id}>
                            <TableCell className="font-medium">
                              {emp.nom} {emp.prenom}
                            </TableCell>
                            {!isMobile && <TableCell>{emp.poste}</TableCell>}
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  emp.statut === "Actif"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {emp.statut}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="p-4 border-t bg-muted/30 flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarClock className="h-4 w-4" />
                      <span>
                        La gestion des congés et absences sera disponible dans une prochaine version.
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center">
                    <CalendarClock className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-base font-medium">Gestion des congés</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ajoutez des employés pour commencer. La gestion complète des congés sera
                      disponible dans une prochaine version.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add/Edit Employee Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEmploye ? "Modifier l'employé" : "Ajouter un employé"}
            </DialogTitle>
            <DialogDescription>
              {editingEmploye
                ? "Modifiez les informations de l'employé ci-dessous."
                : "Remplissez les informations pour ajouter un nouvel employé."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => updateField("nom", e.target.value)}
                  placeholder="Dupont"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => updateField("prenom", e.target.value)}
                  placeholder="Jean"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="poste">Poste *</Label>
                <Input
                  id="poste"
                  value={formData.poste}
                  onChange={(e) => updateField("poste", e.target.value)}
                  placeholder="Comptable"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departement">Département</Label>
                <Input
                  id="departement"
                  value={formData.departement}
                  onChange={(e) => updateField("departement", e.target.value)}
                  placeholder="Finance"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_embauche">Date d'embauche *</Label>
                <Input
                  id="date_embauche"
                  type="date"
                  value={formData.date_embauche}
                  onChange={(e) => updateField("date_embauche", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaire_base">Salaire de base (F CFA) *</Label>
                <Input
                  id="salaire_base"
                  type="number"
                  value={formData.salaire_base}
                  onChange={(e) => updateField("salaire_base", e.target.value)}
                  placeholder="150000"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numero_cnps">Numéro CNPS</Label>
                <Input
                  id="numero_cnps"
                  value={formData.numero_cnps}
                  onChange={(e) => updateField("numero_cnps", e.target.value)}
                  placeholder="CNPS-XXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type_contrat">Type de contrat</Label>
                <Select
                  value={formData.type_contrat}
                  onValueChange={(value) => updateField("type_contrat", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDI">CDI</SelectItem>
                    <SelectItem value="CDD">CDD</SelectItem>
                    <SelectItem value="Stage">Stage</SelectItem>
                    <SelectItem value="Temporaire">Temporaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="statut">Statut</Label>
              <Select
                value={formData.statut}
                onValueChange={(value) => updateField("statut", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Congé">Congé</SelectItem>
                  <SelectItem value="Suspendu">Suspendu</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} disabled={isMutating}>
                Annuler
              </Button>
              <Button type="submit" disabled={isMutating}>
                {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingEmploye ? "Enregistrer" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              disabled={deleteMutation.isPending}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && deleteMutation.mutate(deleteConfirmId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
