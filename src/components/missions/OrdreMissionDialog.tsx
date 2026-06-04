import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  genererOrdreMission,
  getDocumentsMission,
  type MissionInfo,
} from "@/services/missionDocumentService";

const DOC_TYPE_LABEL: Record<string, string> = {
  ordre_missionnaire: "Missionnaire",
  ordre_superviseur: "Superviseur",
  ordre_client: "Contribuable",
  rapport_superviseur: "Rapport — Superviseur",
  rapport_client: "Rapport — Client",
};

const DOC_TYPE_COLOR: Record<string, string> = {
  ordre_missionnaire: "bg-blue-100 text-blue-800",
  ordre_superviseur: "bg-violet-100 text-violet-800",
  ordre_client: "bg-green-100 text-green-800",
  rapport_superviseur: "bg-orange-100 text-orange-800",
  rapport_client: "bg-teal-100 text-teal-800",
};

interface OrdreMissionDialogProps {
  mission: MissionInfo;
  missionTitle: string;
}

export function OrdreMissionDialog({ mission, missionTitle }: OrdreMissionDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: docs = [], isLoading: docsLoading } = useQuery({
    queryKey: ["mission-docs", mission.id],
    queryFn: () => getDocumentsMission(mission.id),
    enabled: open,
  });

  const ordresExistants = docs.filter((d) => d.mission_doc_type?.startsWith("ordre_"));

  const genMutation = useMutation({
    mutationFn: () => genererOrdreMission(mission),
    onSuccess: () => {
      toast.success("Ordres de mission générés avec succès (3 exemplaires)");
      queryClient.invalidateQueries({ queryKey: ["mission-docs", mission.id] });
      queryClient.invalidateQueries({ queryKey: ["courriers"] });
    },
    onError: (err: Error) => {
      toast.error("Erreur : " + err.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <FileText className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Ordre de mission</span>
          <span className="sm:hidden">OM</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ordre de mission</DialogTitle>
          <DialogDescription className="truncate">{missionTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Explication des 3 versions */}
          <div className="rounded-md border p-3 text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Génère 3 exemplaires :</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>
                <span className="font-medium">Missionnaire</span> — Instructions et programme de travail
              </li>
              <li>
                <span className="font-medium">Superviseur</span> — Copie avec points de contrôle
              </li>
              <li>
                <span className="font-medium">Contribuable</span> — Lettre officielle simplifiée
              </li>
            </ul>
            <p className="mt-1 text-xs">
              Les documents générés apparaissent dans le module{" "}
              <span className="font-medium">Courrier → Historique</span>.
            </p>
          </div>

          {/* Documents déjà générés */}
          {docsLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement...
            </div>
          ) : ordresExistants.length > 0 ? (
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Ordres déjà générés :</p>
              {ordresExistants.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded border px-3 py-2"
                >
                  <div className="min-w-0">
                    <span
                      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${DOC_TYPE_COLOR[doc.mission_doc_type] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {DOC_TYPE_LABEL[doc.mission_doc_type] ?? doc.mission_doc_type}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{doc.reference}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">
                    {new Date(doc.date_creation).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fermer
          </Button>
          <Button
            onClick={() => genMutation.mutate()}
            disabled={genMutation.isPending}
          >
            {genMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                Génération…
              </>
            ) : ordresExistants.length > 0 ? (
              "Regénérer les ordres"
            ) : (
              "Générer les ordres de mission"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
