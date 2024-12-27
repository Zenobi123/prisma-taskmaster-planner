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

const Temps = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [collaborateurFilter, setCollaborateurFilter] = useState("all");
  const navigate = useNavigate();

  // Données mockées pour l'exemple
  const tempsEntries = [
    {
      id: 1,
      date: "2024-02-15",
      collaborateur: "Sophie Martin",
      mission: "Audit comptable annuel",
      client: "SARL TechPro",
      heures: 8,
      status: "validé",
    },
    {
      id: 2,
      date: "2024-02-14",
      collaborateur: "Pierre Dubois",
      mission: "Déclaration TVA",
      client: "SAS WebDev",
      heures: 4,
      status: "en_attente",
    },
  ];

  const filteredEntries = tempsEntries.filter((entry) => {
    const matchesSearch =
      entry.mission.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.collaborateur.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCollaborateur =
      collaborateurFilter === "all" || entry.collaborateur === collaborateurFilter;

    return matchesSearch && matchesCollaborateur;
  });

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
          <h1 className="text-2xl font-bold">Temps</h1>
          <p className="text-neutral-600 mt-1">
            Gérez les saisies de temps des collaborateurs
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle saisie
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={collaborateurFilter} onValueChange={setCollaborateurFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Collaborateur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="Sophie Martin">Sophie Martin</SelectItem>
            <SelectItem value="Pierre Dubois">Pierre Dubois</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{entry.mission}</h3>
                <p className="text-gray-600">{entry.client}</p>
                <p className="text-sm text-gray-500">
                  {entry.collaborateur} - {entry.date}
                </p>
                <p className="text-sm font-medium mt-2">{entry.heures} heures</p>
              </div>
              <div>
                <Badge
                  variant={entry.status === "validé" ? "success" : "secondary"}
                >
                  {entry.status === "validé" ? "Validé" : "En attente"}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Temps;