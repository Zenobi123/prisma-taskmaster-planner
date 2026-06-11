// Interopérabilité des sauvegardes PRISMA GESTION (vanilla) ↔ Prisma.
// - Import : fichier `prisma-gestion-backup-*.json` (PrismaAutoBackup v2.0) ou
//   liste de clients → clients, factures, reçus, devis, propositions, config cabinet.
// - Export : reconstruit le même fichier JSON depuis Supabase, réimportable
//   dans l'application vanilla (localStorage).
import { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Download, Upload, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import {
  parseVanillaBackup,
  vanillaBackupFilename,
  type VanillaBackup,
} from '@/lib/spec/vanillaBackup';
import {
  importVanillaBackup,
  exportVanillaBackup,
  type VanillaImportReport,
} from '@/services/vanillaBackupService';

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

const count = (arr: unknown[] | undefined) => arr?.length ?? 0;

export default function VanillaBackupSettings() {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<VanillaBackup | null>(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [report, setReport] = useState<VanillaImportReport | null>(null);

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      const backup = parseVanillaBackup(text);
      setReport(null);
      setPending(backup);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Fichier non reconnu',
        description: e instanceof Error ? e.message : 'Format de sauvegarde invalide.',
      });
    }
  };

  const runImport = async () => {
    if (!pending) return;
    setImporting(true);
    try {
      const result = await importVanillaBackup(pending);
      setReport(result);
      const totalCreated =
        result.clients.created +
        result.factures.created +
        result.recus.created +
        result.devis.created +
        result.propositions.created;
      toast({
        title: 'Import terminé',
        description: `${totalCreated} élément(s) créé(s), ${result.errors.length} erreur(s).`,
        variant: result.errors.length > 0 ? 'destructive' : 'default',
      });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: "Échec de l'import",
        description: e instanceof Error ? e.message : 'Erreur inattendue.',
      });
    } finally {
      setImporting(false);
      setPending(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const runExport = async () => {
    setExporting(true);
    try {
      const backup = await exportVanillaBackup();
      downloadJson(backup, vanillaBackupFilename());
      toast({
        title: 'Sauvegarde exportée',
        description: `${count(backup.clients)} clients, ${count(backup.factures)} factures, ${count(
          backup.recus,
        )} reçus, ${count(backup.devis)} devis, ${count(backup.propositions)} propositions.`,
      });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: "Échec de l'export",
        description: e instanceof Error ? e.message : 'Erreur inattendue.',
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sauvegardes PRISMA GESTION (vanilla)</CardTitle>
        <CardDescription>
          Importez une sauvegarde de l'application HTML d'origine (fichier{' '}
          <code className="text-xs">prisma-gestion-backup-*.json</code>) ou exportez les données
          actuelles dans ce même format pour les réintégrer dans l'application vanilla.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
            }}
          />
          <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={importing}>
            {importing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Importer une sauvegarde vanilla
          </Button>
          <Button onClick={runExport} disabled={exporting} style={{ backgroundColor: '#1e3a8a' }}>
            {exporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Exporter au format vanilla
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          L'import est sans doublon : les clients (NIU/nom), factures (numéro), reçus (référence),
          devis et propositions déjà présents sont ignorés. La configuration cabinet (signature,
          cachet, signataire) est également reprise.
        </p>

        {report && (
          <div className="rounded-md border p-4 text-sm space-y-2">
            <p className="font-semibold flex items-center gap-2">
              {report.errors.length === 0 ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              )}
              Rapport d'import
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1">
              <li>Clients : {report.clients.created} créés, {report.clients.skipped} ignorés</li>
              <li>Factures : {report.factures.created} créées, {report.factures.skipped} ignorées</li>
              <li>Reçus : {report.recus.created} créés, {report.recus.skipped} ignorés</li>
              <li>Devis : {report.devis.created} créés, {report.devis.skipped} ignorés</li>
              <li>
                Propositions : {report.propositions.created} créées, {report.propositions.skipped}{' '}
                ignorées
              </li>
              <li>Config cabinet : {report.cabinetConfig ? 'importée' : '—'}</li>
            </ul>
            {report.errors.length > 0 && (
              <div className="text-red-600 space-y-1">
                <p className="font-medium">{report.errors.length} erreur(s) :</p>
                <ul className="list-disc pl-5 max-h-40 overflow-auto">
                  {report.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <AlertDialog open={!!pending} onOpenChange={(open) => !open && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Importer cette sauvegarde ?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>
                  {pending?.application ?? 'Sauvegarde'}{' '}
                  {pending?.exportDate
                    ? `du ${new Date(pending.exportDate).toLocaleDateString('fr-FR')}`
                    : ''}
                </p>
                <ul className="list-disc pl-5 text-sm">
                  <li>{count(pending?.clients)} client(s)</li>
                  <li>{count(pending?.factures)} facture(s)</li>
                  <li>{count(pending?.recus)} reçu(s)</li>
                  <li>{count(pending?.devis)} devis</li>
                  <li>{count(pending?.propositions)} proposition(s)</li>
                  <li>Configuration cabinet : {pending?.cabinetConfig ? 'oui' : 'non'}</li>
                </ul>
                <p className="text-xs">
                  Les éléments déjà présents seront ignorés (aucune suppression, aucun écrasement).
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={importing}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={runImport} disabled={importing}>
              {importing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Importer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
