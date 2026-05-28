import { CalendarClock, Lock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useExercice } from '@/contexts/ExerciceContext';

const COURANT = 'courant';

/**
 * Sélecteur global d'exercice. Visible sur les pages concernées (Facturation,
 * Missions, Gestion, Tableau de bord). N'apparaît que si au moins un exercice
 * est clôturé — sinon il n'y a rien à consulter.
 */
export function ExerciceSelector({ className }: { className?: string }) {
  const { clotures, viewYear, setViewYear } = useExercice();

  if (clotures.length === 0) return null;

  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      <CalendarClock className="h-4 w-4 text-muted-foreground shrink-0" />
      <Select
        value={viewYear === COURANT ? COURANT : String(viewYear)}
        onValueChange={(val) => setViewYear(val === COURANT ? COURANT : parseInt(val, 10))}
      >
        <SelectTrigger className="h-9 w-[210px] text-sm">
          <SelectValue placeholder="Exercice" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={COURANT}>Exercice en cours</SelectItem>
          {clotures.map((c) => (
            <SelectItem key={c.year} value={String(c.year)}>
              Exercice {c.year} (clôturé)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/** Bandeau affiché quand on consulte un exercice clôturé (lecture seule). */
export function ExerciceReadOnlyBanner({ className }: { className?: string }) {
  const { isConsultingClosed, viewYear } = useExercice();

  if (!isConsultingClosed) return null;

  return (
    <div
      className={`flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 ${className ?? ''}`}
    >
      <Lock className="h-4 w-4 shrink-0" />
      <span>
        Consultation de l'exercice clôturé <strong>{viewYear}</strong> — données archivées en
        lecture seule. Repassez sur « Exercice en cours » pour revenir.
      </span>
    </div>
  );
}
