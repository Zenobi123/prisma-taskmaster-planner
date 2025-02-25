
import { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { ClientList } from "@/components/clients/ClientList";
import { ClientForm } from "@/components/clients/ClientForm";
import { ClientFilters } from "@/components/clients/ClientFilters";
import { ClientView } from "@/components/clients/ClientView";
import { Client, ClientType } from "@/types/client";
import { getClients, addClient, deleteClient, updateClient } from "@/services/clientService";

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<ClientType | "all">("all");
  const [selectedSecteur, setSelectedSecteur] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newClientType, setNewClientType] = useState<ClientType>("physique");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    retry: 2,
    meta: {
      errorMessage: "Impossible de récupérer la liste des clients"
    },
    onSettled: (data, error) => {
      if (error) {
        console.error("Erreur lors de la récupération des clients:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer la liste des clients",
          variant: "destructive",
        });
      }
    }
  });

  const addMutation = useMutation({
    mutationFn: addClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Client ajouté",
        description: "Le nouveau client a été ajouté avec succès.",
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout du client:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du client.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression du client:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du client.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Client> }) => 
      updateClient(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Client mis à jour",
        description: "Le client a été mis à jour avec succès.",
      });
      setIsEditDialogOpen(false);
      setSelectedClient(null);
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du client:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du client.",
        variant: "destructive",
      });
    },
  });

  const handleView = (client: Client) => {
    setSelectedClient(client);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (client: Client) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      deleteMutation.mutate(client.id);
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      (client.type === "physique"
        ? client.nom?.toLowerCase()
        : client.raisonsociale?.toLowerCase()
      )?.includes(searchTerm.toLowerCase()) ||
      client.niu.includes(searchTerm) ||
      client.contact.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || client.type === selectedType;

    const matchesSecteur =
      selectedSecteur === "all" || client.secteuractivite === selectedSecteur;

    return matchesSearch && matchesType && matchesSecteur;
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-800">Clients</h1>
            <p className="text-neutral-600 mt-1">
              Gérez vos clients et leurs informations
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nouveau client
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau client</DialogTitle>
                <DialogDescription>
                  Remplissez les informations du nouveau client ci-dessous.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[70vh] pr-4">
                <ClientForm
                  type={newClientType}
                  onTypeChange={setNewClientType}
                  onSubmit={(clientData) => {
                    console.log("Données du client à ajouter:", clientData);
                    addMutation.mutate(clientData);
                  }}
                />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <ClientFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedSecteur={selectedSecteur}
          onSecteurChange={setSelectedSecteur}
        />

        <ClientList
          clients={filteredClients}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {selectedClient && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="bg-white max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Détails du client</DialogTitle>
              <DialogDescription>
                Informations détaillées sur le client
              </DialogDescription>
            </DialogHeader>
            <ClientView client={selectedClient} />
          </DialogContent>
        </Dialog>
      )}

      {selectedClient && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-white max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Modifier le client</DialogTitle>
              <DialogDescription>
                Modifiez les informations du client ci-dessous.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[70vh] pr-4">
              <ClientForm
                type={selectedClient.type}
                initialData={selectedClient}
                onSubmit={(clientData) => {
                  updateMutation.mutate({
                    id: selectedClient.id,
                    updates: clientData,
                  });
                }}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
