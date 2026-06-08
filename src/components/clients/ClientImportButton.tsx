
import { useState, useRef } from "react";
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
import { Upload, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { RegimeFiscal, ClientType, Client } from "@/types/client";

interface ClientImportButtonProps {
  onImport: (clients: Partial<Client>[]) => void;
  isMobile?: boolean;
}

const CSV_COLUMNS = [
  "type",
  "nom",
  "raisonsociale",
  "niu",
  "centrerattachement",
  "regimefiscal",
  "ville",
  "quartier",
  "telephone",
  "email",
  "contact_principal",
  "secteuractivite",
  "chiffreaffaires",
] as const;

type CanonicalKey = (typeof CSV_COLUMNS)[number];
type ClientRecord = Partial<Record<CanonicalKey, string>>;

const VALID_TYPES: ClientType[] = ["physique", "morale"];
const VALID_REGIMES: RegimeFiscal[] = ["reel", "igs", "non_professionnel", "obnl"];

const SAMPLE_ROWS: ClientRecord[] = [
  {
    type: "physique",
    nom: "Dupont Jean",
    raisonsociale: "",
    niu: "NIU001",
    centrerattachement: "CFLP DOUALA 1",
    regimefiscal: "reel",
    ville: "Douala",
    quartier: "Akwa",
    telephone: "+237600000000",
    email: "jean@example.com",
    contact_principal: "Dupont",
    secteuractivite: "Commerce",
    chiffreaffaires: "5000000",
  },
  {
    type: "morale",
    nom: "",
    raisonsociale: "Entreprise SARL",
    niu: "NIU002",
    centrerattachement: "CFLP YAOUNDE 1",
    regimefiscal: "igs",
    ville: "Yaoundé",
    quartier: "Bastos",
    telephone: "+237600000001",
    email: "contact@entreprise.cm",
    contact_principal: "M. Kamga",
    secteuractivite: "Services",
    chiffreaffaires: "12000000",
  },
];

type ParseResult = { clients: Partial<Client>[]; errors: string[] };

/** Normalise une clé pour la rendre insensible à la casse, aux accents et aux séparateurs. */
function normKey(key: string): string {
  return key
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

// Table de correspondance clé normalisée -> clé canonique (gère aussi les libellés d'export).
const KEY_BY_NORM: Record<string, CanonicalKey> = (() => {
  const map: Record<string, CanonicalKey> = {};
  for (const col of CSV_COLUMNS) {
    map[normKey(col)] = col;
  }
  const extra: Record<string, CanonicalKey> = {
    centre: "centrerattachement",
    centrederattachement: "centrerattachement",
    regime: "regimefiscal",
    tel: "telephone",
    secteur: "secteuractivite",
    secteurdactivite: "secteuractivite",
    ca: "chiffreaffaires",
    contactprincipal: "contact_principal",
  };
  return { ...map, ...extra };
})();

/** Convertit un objet brut (JSON/texte) en enregistrement à clés canoniques. */
function canonicalize(raw: Record<string, unknown>): ClientRecord {
  const rec: ClientRecord = {};
  for (const [key, value] of Object.entries(raw)) {
    const canon = KEY_BY_NORM[normKey(key)];
    if (!canon) continue;
    rec[canon] = value === null || value === undefined ? "" : String(value).trim();
  }
  return rec;
}

/** Valide un enregistrement et le transforme en client partiel, ou retourne une erreur. */
function buildClient(
  rec: ClientRecord,
  label: string
): { client?: Partial<Client>; error?: string } {
  const rawType = (rec.type ?? "").trim().toLowerCase();
  const type: ClientType | string = rawType.includes("physique")
    ? "physique"
    : rawType.includes("morale")
      ? "morale"
      : rawType;

  const nom = (rec.nom ?? "").trim();
  const raisonsociale = (rec.raisonsociale ?? "").trim();
  const niu = (rec.niu ?? "").trim();
  const centrerattachement = (rec.centrerattachement ?? "").trim();
  const regimefiscal = (rec.regimefiscal ?? "").trim().toLowerCase() as RegimeFiscal;
  const ville = (rec.ville ?? "").trim();
  const quartier = (rec.quartier ?? "").trim();
  const telephone = (rec.telephone ?? "").trim();
  const email = (rec.email ?? "").trim();
  const contact_principal = (rec.contact_principal ?? "").trim();
  const secteuractivite = (rec.secteuractivite ?? "").trim();
  const chiffreaffairesStr = (rec.chiffreaffaires ?? "").trim();

  if (!VALID_TYPES.includes(type as ClientType)) {
    return { error: `${label}: type "${rec.type ?? ""}" invalide (attendu: physique ou morale).` };
  }
  if (!niu) {
    return { error: `${label}: le NIU est obligatoire.` };
  }
  if (!VALID_REGIMES.includes(regimefiscal)) {
    return {
      error: `${label}: régime fiscal "${rec.regimefiscal ?? ""}" invalide (attendu: ${VALID_REGIMES.join(", ")}).`,
    };
  }

  const chiffreaffaires = chiffreaffairesStr ? Number(chiffreaffairesStr) : undefined;
  if (chiffreaffairesStr && isNaN(chiffreaffaires!)) {
    return { error: `${label}: chiffre d'affaires "${chiffreaffairesStr}" n'est pas un nombre valide.` };
  }

  return {
    client: {
      type: type as ClientType,
      nom: nom || undefined,
      raisonsociale: raisonsociale || undefined,
      niu,
      centrerattachement,
      regimefiscal,
      adresse: {
        ville,
        quartier,
        lieuDit: "",
      },
      contact: {
        telephone,
        email,
        contact_principal,
      },
      secteuractivite,
      chiffreaffaires,
      interactions: [],
      statut: "actif",
      gestionexternalisee: false,
    },
  };
}

function parseCSV(text: string): ParseResult {
  const errors: string[] = [];
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    errors.push("Le fichier doit contenir au moins un en-tête et une ligne de données.");
    return { clients: [], errors };
  }

  const dataLines = lines.slice(1);
  const clients: Partial<Client>[] = [];

  dataLines.forEach((line, index) => {
    const values = line.split(";");
    const rowNum = index + 2; // 1-indexé, en tenant compte de l'en-tête

    if (values.length < CSV_COLUMNS.length) {
      errors.push(`Ligne ${rowNum}: nombre de colonnes insuffisant (${values.length}/${CSV_COLUMNS.length}).`);
      return;
    }

    const rec: ClientRecord = {};
    CSV_COLUMNS.forEach((col, i) => {
      rec[col] = (values[i] ?? "").trim();
    });

    const { client, error } = buildClient(rec, `Ligne ${rowNum}`);
    if (error) errors.push(error);
    else if (client) clients.push(client);
  });

  return { clients, errors };
}

function parseJSON(text: string): ParseResult {
  const errors: string[] = [];
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { clients: [], errors: ["Le fichier JSON est invalide ou mal formé."] };
  }

  const rows = Array.isArray(data) ? data : [data];
  if (rows.length === 0) {
    return { clients: [], errors: ["Le fichier JSON ne contient aucun client."] };
  }

  const clients: Partial<Client>[] = [];
  rows.forEach((row, index) => {
    const label = `Élément ${index + 1}`;
    if (typeof row !== "object" || row === null) {
      errors.push(`${label}: format invalide (objet attendu).`);
      return;
    }
    const rec = canonicalize(row as Record<string, unknown>);
    const { client, error } = buildClient(rec, label);
    if (error) errors.push(error);
    else if (client) clients.push(client);
  });

  return { clients, errors };
}

function parseText(text: string): ParseResult {
  const errors: string[] = [];
  // Les blocs sont séparés par une ligne de tirets (ou une ligne vide).
  const blocks = text
    .split(/\r?\n-{3,}\r?\n|\r?\n\s*\r?\n/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  if (blocks.length === 0) {
    return { clients: [], errors: ["Le fichier texte ne contient aucun client."] };
  }

  const clients: Partial<Client>[] = [];
  blocks.forEach((block, index) => {
    const label = `Bloc ${index + 1}`;
    const raw: Record<string, string> = {};
    block.split(/\r?\n/).forEach((line) => {
      const sep = line.indexOf(":");
      if (sep === -1) return;
      const key = line.slice(0, sep).trim();
      const value = line.slice(sep + 1).trim();
      if (key) raw[key] = value;
    });

    if (Object.keys(raw).length === 0) {
      errors.push(`${label}: aucune ligne « champ: valeur » détectée.`);
      return;
    }

    const rec = canonicalize(raw);
    const { client, error } = buildClient(rec, label);
    if (error) errors.push(error);
    else if (client) clients.push(client);
  });

  return { clients, errors };
}

type ImportFormat = "csv" | "json" | "txt";

function getFormat(fileName: string): ImportFormat | null {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".csv")) return "csv";
  if (lower.endsWith(".json")) return "json";
  if (lower.endsWith(".txt")) return "txt";
  return null;
}

function parseByFormat(format: ImportFormat, text: string): ParseResult {
  switch (format) {
    case "csv":
      return parseCSV(text);
    case "json":
      return parseJSON(text);
    case "txt":
      return parseText(text);
  }
}

// --- Génération des modèles téléchargeables ------------------------------

function triggerDownload(content: string, mime: string, fileName: string, bom = false) {
  const blob = new Blob([bom ? "﻿" + content : content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadTemplate(format: ImportFormat) {
  if (format === "csv") {
    const header = CSV_COLUMNS.join(";");
    const rows = SAMPLE_ROWS.map((r) => CSV_COLUMNS.map((c) => r[c] ?? "").join(";"));
    triggerDownload([header, ...rows].join("\n"), "text/csv;charset=utf-8;", "modele_import_clients.csv", true);
    return;
  }
  if (format === "json") {
    const json = JSON.stringify(
      SAMPLE_ROWS.map((r) => ({
        ...r,
        chiffreaffaires: r.chiffreaffaires ? Number(r.chiffreaffaires) : 0,
      })),
      null,
      2
    );
    triggerDownload(json, "application/json", "modele_import_clients.json");
    return;
  }
  // txt
  const blocks = SAMPLE_ROWS.map((r) => CSV_COLUMNS.map((c) => `${c}: ${r[c] ?? ""}`).join("\n"));
  triggerDownload(blocks.join("\n" + "-".repeat(40) + "\n"), "text/plain;charset=utf-8;", "modele_import_clients.txt");
}

export function ClientImportButton({ onImport, isMobile }: ClientImportButtonProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Partial<Client>[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const format = getFormat(selectedFile.name);
    if (!format) {
      toast.error("Veuillez sélectionner un fichier CSV, JSON ou texte (.txt).");
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
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

  const handleImport = () => {
    if (preview.length === 0) {
      toast.error("Aucune donnée valide à importer.");
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
              Importez vos clients à partir d&apos;un fichier CSV, JSON ou texte (.txt). Utilisez un modèle pour vous assurer du bon format.
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
            <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
              Annuler
            </Button>
            <Button onClick={handleImport} disabled={preview.length === 0} className="w-full sm:w-auto">
              <Upload className="h-4 w-4 mr-2" />
              Importer {preview.length > 0 ? `(${preview.length})` : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
