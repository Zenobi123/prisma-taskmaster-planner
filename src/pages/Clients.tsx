import { useState } from "react";
import { Plus, Search, Filter, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { ClientList } from "@/components/clients/ClientList";
import { ClientForm } from "@/components/clients/ClientForm";

interface Client {
  id: string;
  raisonSociale: string;
  siren: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  secteur: string;
  statut: "actif" | "inactif";
}

const clientsData: Client[] = [
  {
    id: "1",
    raisonSociale: "SARL Example",
    siren: "123456789",
    email: "contact@example.fr",
    telephone: "01 23 45 67 89",
    adresse: "123 rue des Entreprises",
    ville: "Paris",
    secteur: "Services",
    statut: "actif",
  },
  {
    id: "2",
    raisonSociale: "SAS Tech",
    siren: "987654321",
    email: "contact@sastech.fr",
    telephone: "01 98 76 54 32",
    adresse: "456 avenue de l'Innovation",
    ville: "Lyon",
    secteur: "Technologie",
    statut: "actif",
  },
];

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatut, setSelectedStatut] = useState<string>("all");
  const [selectedSecteur, setSelectedSecteur] = useState<string>("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const secteurs = Array.from(
    new Set(clientsData.map((client) => client.secteur))
  );

  const filteredClients = clientsData.filter((client) => {
    const matchesSearch =
      client.raisonSociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.siren.includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatut =
      selectedStatut === "all" || client.statut === selectedStatut;

    const matchesSecteur =
      selectedSecteur === "all" || client.secteur === selectedSecteur;

    return matchesSearch && matchesStatut && matchesSecteur;
  });

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
            <h1 className="text-2xl font-semibold text-neutral-800">
              Clients
            </h1>
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
                  onSubmit={() => {
                    toast({
                      title: "Client ajouté",
                      description: "Le nouveau client a été ajouté avec succès.",
                    });
                    setIsDialogOpen(false);
                  }}
                />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            <Input
              type="text"
              placeholder="Rechercher un client..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtres
                {(selectedStatut !== "all" || selectedSecteur !== "all") && (
                  <span className="ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {Number(selectedStatut !== "all") + Number(selectedSecteur !== "all")}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Statut</label>
                  <Select
                    value={selectedStatut}
                    onValueChange={setSelectedStatut}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="inactif">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Secteur</label>
                  <Select
                    value={selectedSecteur}
                    onValueChange={setSelectedSecteur}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      {secteurs.map((secteur) => (
                        <SelectItem key={secteur} value={secteur}>
                          {secteur}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <ClientList clients={filteredClients} />
      </div>
    </div>
  );
}