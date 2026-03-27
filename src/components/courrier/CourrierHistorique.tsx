
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, CheckCircle, Trash2, Archive, Clock } from "lucide-react";
import {
  getCourrierRecords,
  updateCourrierStatus,
  deleteCourrierRecord,
} from "@/services/courrierStorageService";
import { CourrierRecord, CourrierStatus } from "@/types/courrier";

const STATUS_LABELS: Record<CourrierStatus, string> = {
  brouillon: "Brouillon",
  envoye: "Envoyé",
  accuse: "Accusé réception",
  classe: "Classé",
};

const STATUS_COLORS: Record<CourrierStatus, string> = {
  brouillon: "bg-gray-100 text-gray-700",
  envoye: "bg-blue-100 text-blue-700",
  accuse: "bg-green-100 text-green-700",
  classe: "bg-amber-100 text-amber-700",
};

const CourrierHistorique = () => {
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState<CourrierStatus | "">("");
  const queryClient = useQueryClient();

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["courriers", statutFilter, search],
    queryFn: () => getCourrierRecords({ statut: statutFilter, search }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, statut }: { id: string; statut: CourrierStatus }) =>
      updateCourrierStatus(id, statut, {
        date_accuse: statut === "accuse" ? new Date().toISOString() : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courriers"] });
      toast.success("Statut mis à jour");
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCourrierRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courriers"] });
      toast.success("Courrier supprimé");
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("fr-FR") : "—";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#84A98C]" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 text-xs h-8"
          />
        </div>
        <Select
          value={statutFilter}
          onValueChange={v => setStatutFilter(v as CourrierStatus | "")}
        >
          <SelectTrigger className="w-40 h-8 text-xs">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous</SelectItem>
            <SelectItem value="brouillon">Brouillon</SelectItem>
            <SelectItem value="envoye">Envoyé</SelectItem>
            <SelectItem value="accuse">Accusé réception</SelectItem>
            <SelectItem value="classe">Classé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {records.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          Aucun courrier trouvé
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-100">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-gray-600">Référence</th>
                <th className="text-left px-3 py-2 font-medium text-gray-600">Client</th>
                <th className="text-left px-3 py-2 font-medium text-gray-600">Modèle</th>
                <th className="text-left px-3 py-2 font-medium text-gray-600">Date envoi</th>
                <th className="text-left px-3 py-2 font-medium text-gray-600">Statut</th>
                <th className="text-right px-3 py-2 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r: CourrierRecord) => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-3 py-2 font-mono text-gray-600">{r.reference}</td>
                  <td className="px-3 py-2 text-gray-800">{r.client_nom || "—"}</td>
                  <td className="px-3 py-2 text-gray-600">{r.template_titre}</td>
                  <td className="px-3 py-2 text-gray-500">{formatDate(r.date_envoi)}</td>
                  <td className="px-3 py-2">
                    <Badge className={`text-xs px-1.5 py-0 ${STATUS_COLORS[r.statut]}`}>
                      {STATUS_LABELS[r.statut]}
                    </Badge>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-1">
                      {r.statut === "envoye" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-1.5 text-green-600 hover:text-green-700"
                          title="Marquer accusé réception"
                          onClick={() => updateMutation.mutate({ id: r.id, statut: "accuse" })}
                        >
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                      )}
                      {r.statut !== "classe" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-1.5 text-amber-600 hover:text-amber-700"
                          title="Classer"
                          onClick={() => updateMutation.mutate({ id: r.id, statut: "classe" })}
                        >
                          <Archive className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-1.5 text-red-500 hover:text-red-600"
                        title="Supprimer"
                        onClick={() => deleteMutation.mutate(r.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourrierHistorique;
