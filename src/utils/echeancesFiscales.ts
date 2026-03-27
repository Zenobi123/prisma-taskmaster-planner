
export interface EcheanceInfo {
  date: string;        // ISO date string "YYYY-MM-DD"
  label: string;       // Human-readable label
  joursRestants: number;
  enRetard: boolean;
}

type QuarterKey = "T1" | "T2" | "T3" | "T4";

const QUARTERS: Record<QuarterKey, string> = {
  T1: "-01-15",
  T2: "-03-15",
  T3: "-07-15",
  T4: "-10-15",
};

/**
 * Retourne la prochaine échéance (parmi T1-T4) pour les impôts trimestriels.
 * Si toutes sont dépassées, retourne T4 de l'année.
 */
function nextQuarterEcheance(year: number): EcheanceInfo {
  const today = new Date();
  const quarters: { date: Date; label: string }[] = [
    { date: new Date(`${year}${QUARTERS.T1}`), label: "T1" },
    { date: new Date(`${year}${QUARTERS.T2}`), label: "T2" },
    { date: new Date(`${year}${QUARTERS.T3}`), label: "T3" },
    { date: new Date(`${year}${QUARTERS.T4}`), label: "T4" },
  ];

  for (const q of quarters) {
    const diff = Math.ceil((q.date.getTime() - today.getTime()) / 86400000);
    if (diff > -30) {
      return {
        date: q.date.toISOString().split("T")[0],
        label: `Trimestre ${q.label}`,
        joursRestants: diff,
        enRetard: diff < 0,
      };
    }
  }

  // All quarters past – return T4
  const t4 = quarters[3];
  const diff = Math.ceil((t4.date.getTime() - today.getTime()) / 86400000);
  return {
    date: t4.date.toISOString().split("T")[0],
    label: "Trimestre T4",
    joursRestants: diff,
    enRetard: diff < 0,
  };
}

function fixedEcheance(year: number, mmdd: string, label: string): EcheanceInfo {
  const today = new Date();
  const date = new Date(`${year}-${mmdd}`);
  const diff = Math.ceil((date.getTime() - today.getTime()) / 86400000);
  return {
    date: `${year}-${mmdd}`,
    label,
    joursRestants: diff,
    enRetard: diff < 0,
  };
}

/**
 * Calcule l'échéance d'une obligation fiscale à partir de sa désignation.
 * @param designation - Nom de l'impôt / prestation (ex. "IGS", "Patente", "PSL")
 * @param year        - Exercice fiscal
 */
export function getEcheanceForImpot(designation: string, year: number): EcheanceInfo {
  const d = designation.toUpperCase();

  // Trimestriels
  if (d.includes("IGS") || d.includes("IMPÔT GÉNÉRAL SYNTHÉTIQUE")) {
    return nextQuarterEcheance(year);
  }
  if (d.includes("PSL") || d.includes("PRÉLÈVEMENT SPÉCIAL")) {
    return nextQuarterEcheance(year);
  }

  // Annuels fixes
  if (d.includes("PATENTE")) {
    return fixedEcheance(year, "02-28", "28 Février");
  }
  if (d.includes("BAIL") || d.includes("TAXE FONCIÈRE BAIL")) {
    return fixedEcheance(year, "02-28", "28 Février");
  }
  if (d.includes("TF") || d.includes("TAXE FONCIÈRE")) {
    return fixedEcheance(year, "02-28", "28 Février");
  }
  if (d.includes("DSF") || d.includes("DÉCLARATION STATISTIQUE")) {
    return fixedEcheance(year, "03-15", "15 Mars");
  }
  if (d.includes("DARP")) {
    return fixedEcheance(year, "06-30", "30 Juin");
  }
  if (d.includes("DBEF") || d.includes("DÉCLARATION DES BÉNÉFICES")) {
    return fixedEcheance(year, "06-30", "30 Juin");
  }
  if (d.includes("TDL") || d.includes("TAXE DE DÉVELOPPEMENT LOCAL")) {
    return fixedEcheance(year, "03-31", "31 Mars");
  }
  if (d.includes("LICENCE") || d.includes("VENDEUR DE BOISSONS")) {
    return fixedEcheance(year, "01-31", "31 Janvier");
  }

  // Honoraires
  if (d.includes("HONORAIRE") || d.includes("TENUE") || d.includes("MISSION") || d.includes("ÉTABLISSEMENT")) {
    return fixedEcheance(year, "03-31", "31 Mars");
  }

  // Default: end of year
  return fixedEcheance(year, "12-31", "31 Décembre");
}

/**
 * Catégorise une échéance selon son urgence.
 */
export type UrgenceLevel = "retard" | "urgent" | "proche" | "ok";

export function getUrgenceLevel(echeance: EcheanceInfo): UrgenceLevel {
  if (echeance.enRetard) return "retard";
  if (echeance.joursRestants <= 15) return "urgent";
  if (echeance.joursRestants <= 30) return "proche";
  return "ok";
}

export function urgenceBadgeClass(level: UrgenceLevel): string {
  switch (level) {
    case "retard": return "bg-red-100 text-red-700 border-red-200";
    case "urgent": return "bg-orange-100 text-orange-700 border-orange-200";
    case "proche": return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "ok":     return "bg-blue-50 text-blue-600 border-blue-100";
  }
}

export function urgenceBadgeText(echeance: EcheanceInfo): string {
  if (echeance.enRetard) return `EN RETARD (${Math.abs(echeance.joursRestants)}j)`;
  if (echeance.joursRestants === 0) return "Aujourd'hui";
  return `${echeance.joursRestants}j`;
}
