
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
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Upload, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { RegimeFiscal, ClientType } from "@/types/client";

interface ClientImportButtonProps {
  onImport: (clients: any[]) => void;
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
  "secteuractivite",
  "chiffreaffaires",
] as const;

const VALID_TYPES: ClientType[] = ["physique", "morale"];
const VALID_REGIMES: RegimeFiscal[] = ["reel", "igs", "non_professionnel", "obnl"];

function generateTemplate(): string {
  const header = CSV_COLUMNS.join(";");
  const row1 = "physique;Dupont Jean;;NIU001;Centre A;reel;Douala;Akwa;+237600000000;jean@example.com;Commerce;5000000";
  const row2 = "morale;;Entreprise SARL;NIU002;Centre B;igs;Yaoundé;Bastos;+237600000001;contact@entreprise.cm;Services;12000000";
  return [header, row1, row2].join("\n");
}

function downloadTemplate() {
  const csv = generateTemplate();
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "modele_import_clients.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function parseCSV(text: string): { clients: any[]; errors: string[] } {
  const errors: string[] = [];
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    errors.push("Le fichier doit contenir au moins un en-tête et une ligne de données.");
    return { clients: [], errors };
  }

  // Skip header row
  const dataLines = lines.slice(1);
  const clients: any[] = [];

  dataLines.forEach((line, index) => {
    const values = line.split(";");
    const rowNum = index + 2; // 1-indexed, accounting for header

    if (values.length < CSV_COLUMNS.length) {
      errors.push(`Ligne ${rowNum}: nombre de colonnes insuffisant (${values.length}/${CSV_COLUMNS.length}).`);
      return;
    }

    const type = values[0].trim().toLowerCase() as ClientType;
    const nom = values[1].trim();
    const raisonsociale = values[2].trim();
    const niu = values[3].trim();
    const centrerattachement = values[4].trim();
    const regimefiscal = values[5].trim().toLowerCase() as RegimeFiscal;
    const ville = values[6].trim();
    const quartier = values[7].trim();
    const telephone = values[8].trim();
    const email = values[9].trim();
    const secteuractivite = values[10].trim();
    const chiffreaffairesStr = values[11].trim();

    // Validations
    if (!VALID_TYPES.includes(type)) {
      errors.push(`Ligne ${rowNum}: type "${values[0].trim()}" invalide (attendu: physique ou morale).`);
      return;
    }

    if (!niu) {
      errors.push(`Ligne ${rowNum}: le NIU est obligatoire.`);
      return;
    }

    if (!VALID_REGIMES.includes(regimefiscal)) {
      errors.push(`Ligne ${rowNum}: régime fiscal "${values[5].trim()}" invalide (attendu: ${VALID_REGIMES.join(", ")}).`);
      return;
    }

    const chiffreaffaires = chiffreaffairesStr ? Number(chiffreaffairesStr) : undefined;
    if (chiffreaffairesStr && isNaN(chiffreaffaires!)) {
      errors.push(`Ligne ${rowNum}: chiffre d'affaires "${chiffreaffairesStr}" n'est pas un nombre valide.`);
      return;
    }

    clients.push({
      type,
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
      },
      secteuractivite,
      chiffreaffaires,
      interactions: [],
      statut: "actif",
      gestionexternalisee: false,
    });
  });

  return { clients, errors };
}

export function ClientImportButton({ onImport, isMobile }: ClientImportButtonProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      toast.error("Veuillez sélectionner un fichier CSV.");
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const { clients, errors } = parseCSV(text);

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
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Importer des clients
            </DialogTitle>
            <DialogDescription>
              Importez vos clients à partir d&apos;un fichier CSV. Utilisez le modèle fourni pour vous assurer du bon format.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Template download */}
            <div>
              <Button
                variant="link"
                className="flex items-center gap-2 p-0 h-auto text-sm"
                onClick={downloadTemplate}
              >
                <Download className="h-4 w-4" />
                Télécharger le modèle
              </Button>
            </div>

            {/* File input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Sélectionner un fichier CSV
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
            </div>

            {/* Parse errors */}
            {parseErrors.length > 0 && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <p className="font-medium mb-1">Erreurs détectées :</p>
                <ul className="list-disc list-inside space-y-1">
                  {parseErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preview table */}
            {preview.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">
                  Aperçu ({preview.length} client{preview.length > 1 ? "s" : ""})
                </p>
                <div className="rounded-md border overflow-x-auto">
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
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button onClick={handleImport} disabled={preview.length === 0}>
              <Upload className="h-4 w-4 mr-2" />
              Importer {preview.length > 0 ? `(${preview.length})` : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
