
import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Upload, Download, FileText, Archive, LoaderCircle, Copy, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Client } from "@/types/client";
import {
  ImportFormat,
  getFormat,
  parseByFormat,
  buildTemplate,
} from "@/utils/clientImport";
import { parseVanillaFile, countHistorique, summarizeHistorique } from "@/utils/vanillaTransfer/envelope";
import { VanillaEnvelope } from "@/utils/vanillaTransfer/types";
import { vanillaToPrismaClient } from "@/utils/vanillaTransfer/clientMapper";
import { importVanillaEnvelope, VanillaImportReport } from "@/services/vanillaTransferService";

interface ClientImportButtonProps {
  onImport: (clients: Partial<Client>[]) => void;
  isMobile?: boolean;
}

const HISTORY_LABELS: Record<string, string> = {
  factures: "facture(s)",
  devis: "devis",
  recus: "reçu(s)",
  propositions: "proposition(s)",
  notes: "note(s)",
  courriers: "courrier(s)",
  contrats: "contrat(s)",
};

function downloadTemplate(format: ImportFormat) {
  const { content, mime, fileName, bom } = buildTemplate(format);
  const blob = new Blob([bom ? "﻿" + content : content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function formatImportReport(report: VanillaImportReport): string {
  const parts: string[] = [];
  if (report.clientsCrees.length > 0) parts.push(`${report.clientsCrees.length} client(s) créé(s)`);
  if (report.clientsExistants.length > 0)
    parts.push(`${report.clientsExistants.length} client(s) existant(s) réutilisé(s)`);
  const docs: Array<[string, { importes: number }]> = [
    ["facture(s)", report.factures],
    ["devis", report.devis],
    ["reçu(s)", report.recus],
    ["proposition(s)", report.propositions],
    ["courrier(s)", report.courriers],
  ];
  for (const [label, counts] of docs) {
    if (counts.importes > 0) parts.push(`${counts.importes} ${label}`);
  }
  return parts.length > 0 ? parts.join(", ") : "Aucune donnée nouvelle (tout existait déjà)";
}

export function ClientImportButton({ onImport, isMobile }: ClientImportButtonProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Partial<Client>[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [vanillaEnvelope, setVanillaEnvelope] = useState<VanillaEnvelope | null>(null);
  const [importReport, setImportReport] = useState<VanillaImportReport | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const format = getFormat(selectedFile.name);
    if (!format) {
      toast.error("Veuillez sélectionner un fichier CSV, JSON ou texte (.txt).");
      return;
    }

    setFile(selectedFile);
    setVanillaEnvelope(null);
    setImportReport(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;

      // Détection d'un export de l'application vanilla (enveloppe PRISMA-CLIENTS) :
      // dans ce cas l'import passe par le service dédié, avec historique.
      if (format === "json") {
        const { envelope, error } = parseVanillaFile(text);
        if (envelope) {
          setVanillaEnvelope(envelope);
          setPreview(envelope.clients.map(vanillaToPrismaClient));
          setParseErrors([]);
          return;
        }
        if (error) {
          setParseErrors([error]);
          setPreview([]);
          toast.error(error);
          return;
        }
      }

      const { clients, errors } = parseByFormat(format, text);

      if (errors.length > 0) {
        errors.forEach((err) => toast.error(err));
        setParseErrors(errors);
      } else {
        setParseErrors([]);
      }

      setPreview(clients);
    };
    reader.onerror = () => {
      toast.error("Erreur lors de la lecture du fichier.");
    };
    reader.readAsText(selectedFile, "UTF-8");
  };

  const handleImport = async () => {
    if (preview.length === 0) {
      toast.error("Aucune donnée valide à importer.");
      return;
    }

    if (vanillaEnvelope) {
      setIsImporting(true);
      try {
        const report = await importVanillaEnvelope(vanillaEnvelope);
        const totalImported =
          report.clientsCrees.length +
          report.factures.importes +
          report.devis.importes +
          report.recus.importes +
          report.propositions.importes +
          report.courriers.importes;

        if (report.erreurs.length > 0) {
          // Garder la boîte de dialogue ouverte : le rapport détaillé (copiable)
          // est affiché à l'écran — les toasts disparaissent trop vite pour
          // diagnostiquer un échec d'import.
          console.error("[Import PRISMA] Rapport d'import :", report);
          setImportReport(report);
          if (totalImported === 0 && report.clientsExistants.length === 0) {
            toast.error("Import échoué — voir le rapport d'erreurs détaillé ci-dessous.");
          } else {
            toast.warning(
              `Import partiel : ${formatImportReport(report)} — ${report.erreurs.length} erreur(s), voir le détail ci-dessous.`,
            );
          }
          queryClient.invalidateQueries();
          return;
        }

        toast.success(`Import PRISMA terminé : ${formatImportReport(report)}.`);
        const ignoredTotal = report.nonSupportes.notes + report.nonSupportes.contrats;
        if (ignoredTotal > 0) {
          toast.warning(
            `${ignoredTotal} élément(s) sans équivalent PRISMA (notes/contrats) non importé(s).`,
          );
        }
        queryClient.invalidateQueries();
        handleClose();
      } catch (error) {
        console.error("[Import PRISMA] Échec inattendu :", error);
        toast.error(
          `Échec de l'import : ${error instanceof Error ? error.message : String(error)}`,
        );
      } finally {
        setIsImporting(false);
      }
      return;
    }

    onImport(preview);
    toast.success(`${preview.length} client(s) importé(s) avec succès.`);
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setPreview([]);
    setParseErrors([]);
    setVanillaEnvelope(null);
    setImportReport(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyReport = () => {
    if (!importReport) return;
    const lines = [
      `Rapport d'import PRISMA — ${new Date().toISOString()}`,
      `Clients créés : ${importReport.clientsCrees.length}`,
      `Clients existants réutilisés : ${importReport.clientsExistants.length}`,
      `Factures : ${importReport.factures.importes} importée(s), ${importReport.factures.ignores} ignorée(s)`,
      `Devis : ${importReport.devis.importes} importé(s), ${importReport.devis.ignores} ignoré(s)`,
      `Reçus : ${importReport.recus.importes} importé(s), ${importReport.recus.ignores} ignoré(s)`,
      `Propositions : ${importReport.propositions.importes} importée(s), ${importReport.propositions.ignores} ignorée(s)`,
      `Courriers : ${importReport.courriers.importes} importé(s), ${importReport.courriers.ignores} ignoré(s)`,
      "",
      "Erreurs :",
      ...importReport.erreurs.map((e, i) => `${i + 1}. ${e}`),
    ];
    navigator.clipboard
      .writeText(lines.join("\n"))
      .then(() => toast.success("Rapport copié dans le presse-papiers."))
      .catch(() => toast.error("Impossible de copier le rapport."));
  };

  const historyCount = countHistorique(vanillaEnvelope?.historique);
  const historySummary = summarizeHistorique(vanillaEnvelope?.historique)
    .map(({ key, count }) => `${count} ${HISTORY_LABELS[key] ?? key}`)
    .join(", ");

  return (
    <>
      <Button
        variant="outline"
        className={`flex items-center gap-2 ${isMobile ? "w-full justify-center mt-2" : ""}`}
        onClick={() => setOpen(true)}
      >
        <Upload className="h-4 w-4" />
        Importer
      </Button>

      <Dialog open={open} onOpenChange={(value) => { if (!value) handleClose(); else setOpen(true); }}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl overflow-y-auto max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              Importer des clients
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Importez vos clients à partir d&apos;un fichier CSV, JSON ou texte (.txt). Les
              exports de l&apos;application PRISMA vanilla (format PRISMA-CLIENTS) sont reconnus
              automatiquement, avec leur historique d&apos;opérations.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 sm:py-4">
            {/* Template download */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="link" className="flex items-center gap-2 p-0 h-auto text-xs sm:text-sm">
                    <Download className="h-4 w-4" />
                    Télécharger un modèle
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => downloadTemplate("csv")}>Modèle CSV</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadTemplate("json")}>Modèle JSON</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadTemplate("txt")}>Modèle texte (.txt)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* File input */}
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">
                Sélectionner un fichier (CSV, JSON ou .txt)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json,.txt"
                onChange={handleFileChange}
                className="block w-full text-xs sm:text-sm text-gray-500 file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
            </div>

            {/* Vanilla envelope banner */}
            {vanillaEnvelope && (
              <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-xs sm:text-sm text-blue-900 flex items-start gap-2">
                <Archive className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">
                    Export PRISMA (vanilla) détecté — {vanillaEnvelope.clients.length} client
                    {vanillaEnvelope.clients.length > 1 ? "s" : ""}
                    {historyCount > 0 ? ` et ${historyCount} opération(s) d'historique` : ""}.
                  </p>
                  {historyCount > 0 && (
                    <p className="mt-1 text-blue-800">{historySummary}.</p>
                  )}
                  <p className="mt-1 text-blue-800">
                    Les clients sont rapprochés par NIU ; les documents déjà présents (même
                    numéro) seront ignorés.
                  </p>
                </div>
              </div>
            )}

            {/* Import report (persistent, copyable) */}
            {importReport && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs sm:text-sm text-red-900">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium flex items-center gap-2">
                    <TriangleAlert className="h-4 w-4 shrink-0" />
                    Rapport d&apos;import — {importReport.erreurs.length} erreur(s)
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs shrink-0"
                    onClick={copyReport}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copier le rapport
                  </Button>
                </div>
                <p className="mt-2 text-red-800">
                  {formatImportReport(importReport)}.
                </p>
                <ul className="mt-2 list-disc list-inside space-y-1 max-h-48 overflow-y-auto break-words">
                  {importReport.erreurs.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
                <p className="mt-2 text-red-800">
                  L&apos;import est réimportable sans doublon : corrigez la cause puis relancez avec
                  le même fichier — seuls les éléments manquants seront ajoutés.
                </p>
              </div>
            )}

            {/* Parse errors */}
            {parseErrors.length > 0 && (
              <div className="rounded-md bg-destructive/10 p-3 text-xs sm:text-sm text-destructive">
                <p className="font-medium mb-1">Erreurs détectées :</p>
                <ul className="list-disc list-inside space-y-1">
                  {parseErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preview */}
            {preview.length > 0 && (
              <div>
                <p className="text-xs sm:text-sm font-medium mb-2">
                  Aperçu ({preview.length} client{preview.length > 1 ? "s" : ""})
                </p>
                {/* Desktop table */}
                <div className="hidden sm:block rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Nom / Raison sociale</TableHead>
                        <TableHead>NIU</TableHead>
                        <TableHead>Régime fiscal</TableHead>
                        <TableHead>Ville</TableHead>
                        <TableHead>Téléphone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Secteur</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preview.map((client, index) => (
                        <TableRow key={index}>
                          <TableCell className="capitalize">{client.type}</TableCell>
                          <TableCell>{client.nom || client.raisonsociale || "-"}</TableCell>
                          <TableCell>{client.niu}</TableCell>
                          <TableCell>{client.regimefiscal}</TableCell>
                          <TableCell>{client.adresse.ville}</TableCell>
                          <TableCell>{client.contact.telephone}</TableCell>
                          <TableCell>{client.contact.email}</TableCell>
                          <TableCell>{client.secteuractivite || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* Mobile card list */}
                <div className="sm:hidden space-y-2">
                  {preview.map((client, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50/50">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-medium text-sm truncate">{client.nom || client.raisonsociale || "-"}</p>
                        <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded capitalize shrink-0">{client.type}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                        <span>NIU: {client.niu}</span>
                        <span>{client.regimefiscal}</span>
                        <span>{client.adresse.ville}</span>
                        <span>{client.contact.telephone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto" disabled={isImporting}>
              Annuler
            </Button>
            <Button onClick={handleImport} disabled={preview.length === 0 || isImporting} className="w-full sm:w-auto">
              {isImporting ? (
                <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {isImporting
                ? "Import en cours…"
                : `Importer ${preview.length > 0 ? `(${preview.length})` : ""}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
