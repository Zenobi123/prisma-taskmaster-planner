
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Search, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getCollaborateur } from "@/services/collaborateurService";

const Facturation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Vérifier les permissions du collaborateur connecté
  const collaborateurId = localStorage.getItem("collaborateurId");
  
  const { data: collaborateur } = useQuery({
    queryKey: ["collaborateur", collaborateurId],
    queryFn: () => collaborateurId ? getCollaborateur(collaborateurId) : null,
    meta: {
      onSuccess: (data: any) => {
        if (!data?.permissions?.some(p => p.module === "facturation" && ["ecriture", "administration"].includes(p.niveau))) {
          toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Vous n'avez pas les permissions nécessaires pour accéder à la facturation."
          });
          navigate("/");
        }
      }
    }
  });

  // Si pas de collaborateurId ou pas de permissions, rediriger
  if (!collaborateurId || !collaborateur) {
    return null;
  }

  // Données mockées pour l'exemple
  const factures = [
    {
      id: "F2024-001",
      client: "SARL TechPro",
      date: "2024-02-15",
      montant: 2500,
      status: "payée",
    },
    {
      id: "F2024-002",
      client: "SAS WebDev",
      date: "2024-02-10",
      montant: 1800,
      status: "en_attente",
    },
    {
      id: "F2024-003",
      client: "EURL ConseilPlus",
      date: "2024-02-05",
      montant: 3200,
      status: "envoyée",
    },
  ];

  const filteredFactures = factures.filter((facture) => {
    const matchesSearch =
      facture.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facture.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || facture.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatMontant = (montant: number) => {
    return `${montant.toLocaleString()} F CFA`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "payée":
        return <Badge variant="success">Payée</Badge>;
      case "en_attente":
        return <Badge variant="secondary">En attente</Badge>;
      case "envoyée":
        return <Badge variant="outline">Envoyée</Badge>;
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
          <h1 className="text-2xl font-bold">Facturation</h1>
          <p className="text-neutral-600 mt-1">
            Gérez vos factures clients
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle facture
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher une facture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="payée">Payée</SelectItem>
            <SelectItem value="en_attente">En attente</SelectItem>
            <SelectItem value="envoyée">Envoyée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredFactures.map((facture) => (
          <div
            key={facture.id}
            className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <FileText className="w-8 h-8 text-gray-400" />
                <div>
                  <h3 className="font-semibold text-lg">{facture.id}</h3>
                  <p className="text-gray-600">{facture.client}</p>
                  <p className="text-sm text-gray-500">{facture.date}</p>
                  <p className="text-sm font-medium mt-2">
                    {formatMontant(facture.montant)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(facture.status)}
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

export default Facturation;
