import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const Depenses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categorieFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  // Données mockées pour l'exemple
  const depenses = [
    {
      id: 1,
      description: "Matériel informatique",
      montant: 1200,
      date: "2024-02-15",
      categorie: "equipement",
      collaborateur: "Sophie Martin",
    },
    {
      id: 2,
      description: "Déplacement client",
      montant: 150,
      date: "2024-02-14",
      categorie: "transport",
      collaborateur: "Pierre Dubois",
    },
    {
      id: 3,
      description: "Formation professionnelle",
      montant: 800,
      date: "2024-02-10",
      categorie: "formation",
      collaborateur: "Marie Lambert",
    },
  ];

  const filteredDepenses = depenses.filter((depense) => {
    const matchesSearch =
      depense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      depense.collaborateur.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategorie =
      categorieFilter === "all" || depense.categorie === categorieFilter;

    return matchesSearch && matchesCategorie;
  });

  const getCategorieBadge = (categorie: string) => {
    switch (categorie) {
      case "equipement":
        return <Badge variant="secondary">Équipement</Badge>;
      case "transport":
        return <Badge variant="outline">Transport</Badge>;
      case "formation":
        return <Badge variant="success">Formation</Badge>;
      default:
        return null;
    }
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

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dépenses</h1>
          <p className="text-neutral-600 mt-1">
            Gérez les dépenses de l'entreprise
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle dépense
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher une dépense..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categorieFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="equipement">Équipement</SelectItem>
            <SelectItem value="transport">Transport</SelectItem>
            <SelectItem value="formation">Formation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredDepenses.map((depense) => (
          <div
            key={depense.id}
            className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{depense.description}</h3>
                <p className="text-gray-600">{depense.collaborateur}</p>
                <p className="text-sm text-gray-500">{depense.date}</p>
                <p className="text-sm font-medium mt-2">
                  {depense.montant.toLocaleString()} €
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getCategorieBadge(depense.categorie)}
                <Button variant="outline" size="sm">
                  Voir détails
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Depenses;