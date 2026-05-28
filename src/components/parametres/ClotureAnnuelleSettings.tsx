import { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Lock, Printer, Loader2, CalendarX2, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useClotures } from "@/lib/spec/clotureComptable";
import { useCabinetConfig } from "@/lib/spec/cabinetConfig";
import { usePrintIframe, PAGE_STYLE_A4_DEFAULT } from "@/lib/spec/usePrint";
import { getClotureData, type ClotureData } from "@/services/clotureService";
import { ClotureReport } from "@/components/parametres/cloture/ClotureReport";

interface PrintState {
  data: ClotureData;
  commitYear?: number;
}

export default function ClotureAnnuelleSettings() {
  const { clotures, maxClosedYear, closeYear, reopenYear } = useClotures();
  const [cabinet] = useCabinetConfig();
  const { toast } = useToast();

  const reportRef = useRef<HTMLDivElement>(null);
  const [printState, setPrintState] = useState<PrintState | null>(null);
  const printReport = usePrintIframe(() => reportRef.current, {
    pageStyle: PAGE_STYLE_A4_DEFAULT,
    documentTitle: printState ? `Point_de_cloture_${printState.data.year}` : undefined,
  });

  const currentYear = new Date().getFullYear();

  const candidateYears = useMemo(() => {
    const start = maxClosedYear !== null ? maxClosedYear + 1 : currentYear - 1;
    const list: number[] = [];
    for (let y = start; y <= currentYear; y++) list.push(y);
    return list;
  }, [maxClosedYear, currentYear]);

  const [yearToClose, setYearToClose] = useState<string>("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (candidateYears.length && !candidateYears.includes(Number(yearToClose))) {
      setYearToClose(String(candidateYears[0]));
    }
  }, [candidateYears, yearToClose]);

  // Une fois le rapport monté dans le DOM caché, on l'imprime puis (si clôture)
  // on enregistre la clôture.
  useEffect(() => {
    if (!printState || !reportRef.current) return;
    printReport();
    if (printState.commitYear !== undefined) {
      closeYear(printState.commitYear);
      toast({
        title: `Exercice ${printState.commitYear} clôturé`,
        description:
          "Le point de clôture a été généré. Les éléments de cet exercice sont désormais archivés.",
      });
    }
    setPrintState(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [printState]);

  const gatherAndPrint = async (year: number, commit: boolean) => {
    setBusy(true);
    try {
      const data = await getClotureData(year);
      setPrintState({ data, commitYear: commit ? year : undefined });
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de générer le point de clôture.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleCloturer = () => {
    const year = Number(yearToClose);
    if (Number.isNaN(year)) return;
    gatherAndPrint(year, true);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="w-4 h-4" /> Clôture de l'année comptable
          </CardTitle>
          <CardDescription>
            La clôture archive un exercice : ses factures, paiements, missions et états fiscaux
            cessent de s'afficher partout dans l'application (seul l'exercice en cours reste
            visible). Un point de clôture détaillé est imprimé au moment de la clôture. Les
            exercices clôturés restent consultables en lecture seule via le sélecteur
            « Exercice » présent sur chaque page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Dernier exercice clôturé :{" "}
            <strong>{maxClosedYear !== null ? maxClosedYear : "aucun"}</strong>
          </p>

          {candidateYears.length > 0 ? (
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Exercice à clôturer</label>
                <Select value={yearToClose} onValueChange={setYearToClose}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Choisir une année" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidateYears.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        Exercice {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={busy || !yearToClose} style={{ backgroundColor: "#1e3a8a" }}>
                    {busy ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CalendarX2 className="w-4 h-4 mr-2" />
                    )}
                    Clôturer l'exercice
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clôturer l'exercice {yearToClose} ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Le point de clôture détaillé de l'exercice {yearToClose} va être imprimé.
                      Après confirmation, les factures, paiements, missions et états fiscaux de
                      cet exercice (et des exercices antérieurs) ne s'afficheront plus par défaut.
                      Ils resteront consultables via le sélecteur « Exercice ». Cette action est
                      réversible (réouverture possible).
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCloturer}>
                      Confirmer la clôture
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Tous les exercices jusqu'à l'année en cours ({currentYear}) sont clôturés.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Exercices clôturés</CardTitle>
          <CardDescription>
            Historique des clôtures. Vous pouvez réimprimer le point ou rouvrir un exercice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clotures.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun exercice clôturé pour le moment.</p>
          ) : (
            <div className="space-y-2">
              {clotures.map((c) => (
                <div
                  key={c.year}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border rounded-md px-3 py-2"
                >
                  <div className="text-sm">
                    <span className="font-medium">Exercice {c.year}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      — clôturé le {new Date(c.closedAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={busy}
                      onClick={() => gatherAndPrint(c.year, false)}
                    >
                      <Printer className="w-4 h-4 mr-1" /> Réimprimer le point
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <RotateCcw className="w-4 h-4 mr-1" /> Rouvrir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Rouvrir l'exercice {c.year} ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Les éléments de l'exercice {c.year} redeviendront visibles dans les
                            listes courantes. Vous pourrez le clôturer à nouveau plus tard.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => reopenYear(c.year)}>
                            Rouvrir l'exercice
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conteneur caché servant à l'impression du point de clôture */}
      <div aria-hidden style={{ position: "fixed", left: "-10000px", top: 0, width: "794px" }}>
        {printState && (
          <div ref={reportRef}>
            <ClotureReport data={printState.data} cabinet={cabinet} />
          </div>
        )}
      </div>
    </div>
  );
}
