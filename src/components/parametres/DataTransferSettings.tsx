import { ChangeEvent, useRef, useState } from "react";
import { AlertTriangle, DatabaseBackup, Download, FileJson, LoaderCircle, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getClients } from "@/services/clientService";
import { exportClientsVanilla, importVanillaEnvelope, VanillaImportReport } from "@/services/vanillaTransferService";
import { countHistorique, summarizeHistorique } from "@/utils/vanillaTransfer/envelope";
import { buildVanillaBackup, ParsedVanillaTransfer, parseVanillaTransferFile } from "@/utils/vanillaTransfer/backup";

const LAST_BACKUP_KEY = "prisma:last-compatible-backup";

function downloadJson(data: unknown, fileName: string) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function reportTotal(report: VanillaImportReport) {
  return report.factures.importes + report.devis.importes + report.recus.importes + report.propositions.importes + report.courriers.importes;
}

export default function DataTransferSettings() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"backup" | "export" | "import" | null>(null);
  const [selection, setSelection] = useState<(ParsedVanillaTransfer & { name: string }) | null>(null);
  const [lastReport, setLastReport] = useState<VanillaImportReport | null>(null);
  const [lastBackup, setLastBackup] = useState(() => localStorage.getItem(LAST_BACKUP_KEY));

  const exportData = async (asBackup: boolean) => {
    setBusy(asBackup ? "backup" : "export");
    try {
      const clients = await getClients(true);
      if (clients.length === 0) throw new Error("Aucun client actif ou archivé à exporter.");
      const envelope = await exportClientsVanilla(clients, true);
      const date = new Date().toISOString().slice(0, 10);
      if (asBackup) {
        downloadJson(buildVanillaBackup(envelope), `prisma-gestion-backup-${date}.json`);
        const savedAt = new Date().toISOString();
        localStorage.setItem(LAST_BACKUP_KEY, savedAt);
        setLastBackup(savedAt);
        toast.success("Sauvegarde compatible créée et téléchargée.");
      } else {
        downloadJson(envelope, `prisma-clients-historique-${date}.json`);
        toast.success("Export vers l'application vanilla téléchargé.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "L'export a échoué.");
    } finally {
      setBusy(null);
    }
  };

  const chooseFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".json")) {
      toast.error("Sélectionnez un fichier JSON.");
      return;
    }
    const parsed = parseVanillaTransferFile(await file.text());
    if (!parsed.envelope) {
      toast.error(parsed.error || "Fichier non reconnu.");
      setSelection(null);
      return;
    }
    setSelection({ ...parsed, name: file.name });
    setLastReport(null);
  };

  const importSelection = async () => {
    if (!selection?.envelope) return;
    setBusy("import");
    try {
      const report = await importVanillaEnvelope(selection.envelope);
      setLastReport(report);
      setSelection(null);
      const total = reportTotal(report);
      toast.success(`${report.clientsCrees.length} client(s) et ${total} opération(s) importés.`);
      if (report.erreurs.length > 0) toast.warning(`${report.erreurs.length} avertissement(s) dans le rapport d'import.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "L'import a échoué.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><DatabaseBackup className="h-5 w-5" /> Import, export et sauvegarde</CardTitle>
        <CardDescription>
          Chargez une sauvegarde JSON provenant de l'application vanilla <code>facturation/</code>, ou créez un fichier compatible dans les deux sens.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Button variant="outline" onClick={() => fileInput.current?.click()} disabled={!!busy}>
            <Upload className="mr-2 h-4 w-4" /> Importer une sauvegarde
          </Button>
          <Button variant="outline" onClick={() => exportData(false)} disabled={!!busy}>
            {busy === "export" ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Exporter vers vanilla
          </Button>
          <Button onClick={() => exportData(true)} disabled={!!busy}>
            {busy === "backup" ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <DatabaseBackup className="mr-2 h-4 w-4" />}
            Créer une sauvegarde
          </Button>
          <input ref={fileInput} type="file" accept="application/json,.json" className="hidden" onChange={chooseFile} />
        </div>

        <div className="rounded-md border bg-muted/40 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Données transférées</p>
          <p>Clients actifs/archivés, factures et prestations, devis et prestations, reçus/paiements, propositions et courriers.</p>
          <p className="mt-1">Les collections vanilla sans équivalent dans Prisma sont signalées et ignorées. L'import fusionne les données et ignore les documents déjà présents.</p>
          {lastBackup && <p className="mt-2">Dernière sauvegarde créée depuis ce navigateur : {new Date(lastBackup).toLocaleString("fr-FR")}</p>}
        </div>

        {selection?.envelope && (
          <div className="space-y-3 rounded-md border border-primary/30 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <FileJson className="h-5 w-5 text-primary" />
              <p className="font-medium">{selection.name}</p>
              <Badge variant="secondary">{selection.source === "backup" ? "Sauvegarde globale" : "Export clients"}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {selection.envelope.clients.length} client(s) et {countHistorique(selection.envelope.historique)} opération(s) détectés
              {selection.exportedAt ? ` — export du ${new Date(selection.exportedAt).toLocaleString("fr-FR")}` : ""}.
            </p>
            <div className="flex flex-wrap gap-2">
              {summarizeHistorique(selection.envelope.historique).map(({ key, count }) => <Badge key={key} variant="outline">{key} : {count}</Badge>)}
            </div>
            {selection.ignoredCollections.length > 0 && (
              <p className="flex gap-2 text-sm text-amber-700"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                Non importé faute d'équivalent Prisma : {selection.ignoredCollections.map(({ key, count }) => `${key} (${count})`).join(", ")}.
              </p>
            )}
            <div className="flex gap-2">
              <Button onClick={importSelection} disabled={!!busy}>
                {busy === "import" && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />} Confirmer l'import
              </Button>
              <Button variant="ghost" onClick={() => setSelection(null)} disabled={!!busy}>Annuler</Button>
            </div>
          </div>
        )}

        {lastReport && (
          <div className="rounded-md border p-4 text-sm">
            <p className="font-medium">Dernier rapport d'import</p>
            <p className="mt-1 text-muted-foreground">
              {lastReport.clientsCrees.length} client(s) créé(s), {lastReport.clientsExistants.length} client(s) existant(s), {reportTotal(lastReport)} opération(s) importée(s).
            </p>
            {lastReport.erreurs.length > 0 && <ul className="mt-2 list-disc space-y-1 pl-5 text-amber-700">{lastReport.erreurs.map((error, index) => <li key={`${index}-${error}`}>{error}</li>)}</ul>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
