import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Rapports = () => {
  const [typeFilter, setTypeFilter] = useState("all");
  const navigate = useNavigate();

  // Données mockées pour l'exemple
  const rapports = [
    {
      id: 1,
      titre: "Rapport d'activité mensuel",
      date: "Février 2024",
      type: "activite",
      taille: "2.4 MB",
    },
    {
      id: 2,
      titre: "Bilan financier trimestriel",
      date: "Q4 2023",
      type: "financier",
      taille: "1.8 MB",
    },
    {
      id: 3,
      titre: "Analyse des temps par projet",
      date: "Janvier 2024",
      type: "temps",
      taille: "1.2 MB",
    },
  ];

  const filteredRapports = rapports.filter((rapport) => {
    return typeFilter === "all" || rapport.type === typeFilter;
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
          <h1 className="text-2xl font-bold">Rapports</h1>
          <p className="text-neutral-600 mt-1">
            Consultez et générez des rapports
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Type de rapport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="activite">Activité</SelectItem>
            <SelectItem value="financier">Financier</SelectItem>
            <SelectItem value="temps">Temps</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredRapports.map((rapport) => (
          <div
            key={rapport.id}
            className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-start gap-4">
                <FileText className="w-8 h-8 text-gray-400" />
                <div>
                  <h3 className="font-semibold text-lg">{rapport.titre}</h3>
                  <p className="text-sm text-gray-500">
                    {rapport.date} - {rapport.taille}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rapports;