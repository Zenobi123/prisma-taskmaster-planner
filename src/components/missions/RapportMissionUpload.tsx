import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileUp, Loader2, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  soumettrRapportMission,
  getRapportsMission,
  parseRapportFile,
  RAPPORT_JSON_SCHEMA_EXEMPLE,
  type MissionInfo,
  type RapportParsed,
} from "@/services/missionDocumentService";

interface RapportMissionUploadProps {
  mission: MissionInfo;
  missionTitle: string;
}

export function RapportMissionUpload({ mission, missionTitle }: RapportMissionUploadProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<RapportParsed | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: rapports = [] } = useQuery({
    queryKey: ["rapports-mission", mission.id],
    queryFn: () => getRapportsMission(mission.id),
    enabled: open,
  });

  const submitMutation = useMutation({
    mutationFn: () => {
      if (!selectedFile) throw new Error("Aucun fichier sélectionné");
      return soumettrRapportMission(mission, selectedFile);
    },
    onSuccess: () => {
      toast.success("Rapport soumis — courriers générés pour le superviseur et le client");
      queryClient.invalidateQueries({ queryKey: ["rapports-mission", mission.id] });
      queryClient.invalidateQueries({ queryKey: ["courriers"] });
      setSelectedFile(null);
      setPreview(null);
      setParseError(null);
    },
    onError: (err: Error) => {
      toast.error("Erreur : " + err.message);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["md", "json", "txt"].includes(ext ?? "")) {
      setParseError("Format non supporté. Utilisez .md, .json ou .txt");
      setSelectedFile(null);
      setPreview(null);
      return;
    }

    setSelectedFile(file);
    setParseError(null);
    setPreview(null);

    try {
      const content = await file.text();
      const parsed = parseRapportFile(content, ext as "md" | "json" | "txt");
      setPreview(parsed);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Erreur de lecture du fichier");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(fakeEvent);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <FileUp className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Rapport de mission</span>
          <span className="sm:hidden">RM</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Soumettre un rapport de mission</DialogTitle>
          <DialogDescription className="truncate">{missionTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Rapports déjà soumis */}
          {rapports.length > 0 && (
            <div className="rounded-md bg-green-50 border border-green-200 p-3">
              <p className="text-sm font-medium text-green-800 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                {rapports.length} rapport{rapports.length > 1 ? "s" : ""} déjà soumis
              </p>
              <p className="text-xs text-green-700 mt-0.5">
                Les courriers correspondants sont disponibles dans l'historique des courriers.
              </p>
            </div>
          )}

          {/* Zone de dépôt */}
          <div
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <FileUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-medium">
              {selectedFile ? selectedFile.name : "Déposez votre rapport ici"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Formats acceptés : <strong>.json</strong>, <strong>.md</strong>, <strong>.txt</strong>
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".json,.md,.txt"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Erreur de parsing */}
          {parseError && (
            <div className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 p-3">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{parseError}</p>
            </div>
          )}

          {/* Aperçu du contenu parsé */}
          {preview && (
            <div className="rounded-md border p-3 space-y-2 text-sm">
              <p className="font-medium text-primary">Aperçu du rapport détecté</p>
              <div className="space-y-1 text-sm">
                <Row label="Objet" value={preview.objet} />
                <Row label="Période" value={preview.periode} />
                <ListRow label="Travaux" items={preview.travaux_realises} />
                <ListRow label="Constatations" items={preview.constatations} />
                <ListRow label="Anomalies" items={preview.anomalies} />
                <ListRow label="Recommandations" items={preview.recommandations} />
                <Row label="Conclusion" value={preview.conclusion} />
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                La version <strong>superviseur</strong> inclut les anomalies.
                La version <strong>client</strong> en est expurgée.
              </p>
            </div>
          )}

          {/* Guide des formats */}
          <Accordion type="single" collapsible>
            <AccordionItem value="formats">
              <AccordionTrigger className="text-sm py-2">
                <span className="flex items-center gap-1.5">
                  <Info className="h-4 w-4" />
                  Guide des formats acceptés
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-xs space-y-3">
                <FormatBlock
                  title="Format JSON (recommandé)"
                  code={JSON.stringify(RAPPORT_JSON_SCHEMA_EXEMPLE, null, 2)}
                />
                <FormatBlock
                  title="Format Markdown (.md)"
                  code={`**Objet:** Audit fiscal annuel 2025
**Période:** Exercice 2025

## Travaux réalisés
- Vérification des déclarations fiscales
- Analyse des charges

## Constatations
- Conformité générale des déclarations

## Anomalies
- Facture sans numéro détectée

## Recommandations
- Régulariser la DSF dans les 30 jours

## Conclusion
La mission s'est bien déroulée.`}
                />
                <FormatBlock
                  title="Format texte (.txt)"
                  code={`OBJET: Audit fiscal 2025
PERIODE: Exercice 2025

TRAVAUX REALISES:
- Vérification des déclarations
- Analyse des charges

CONSTATATIONS:
- Conformité générale

ANOMALIES:
- Facture sans numéro

RECOMMANDATIONS:
- Régulariser la DSF

CONCLUSION:
La mission s'est bien déroulée.`}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Bouton de soumission */}
          <div className="flex gap-2 justify-end pt-1">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => submitMutation.mutate()}
              disabled={!selectedFile || !!parseError || submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  Traitement…
                </>
              ) : (
                "Soumettre le rapport"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <span className="font-medium shrink-0 text-muted-foreground w-28">{label} :</span>
      <span className="text-gray-700 flex-1">{value}</span>
    </div>
  );
}

function ListRow({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="flex gap-2">
      <span className="font-medium shrink-0 text-muted-foreground w-28">{label} :</span>
      <ul className="flex-1 list-disc list-inside text-gray-700 space-y-0.5">
        {items.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

function FormatBlock({ title, code }: { title: string; code: string }) {
  return (
    <div>
      <p className="font-medium mb-1">{title}</p>
      <pre className="bg-muted rounded p-2 text-xs overflow-x-auto whitespace-pre-wrap">{code}</pre>
    </div>
  );
}
