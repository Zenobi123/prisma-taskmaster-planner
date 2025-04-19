
import { exportToPdf } from "@/utils/exportUtils";

export function generateTimeReport() {
  const timeData = [
    { projet: "Audit LMN Corp", heures: 78, collaborateurs: 4, progression: "65%" },
    { projet: "Fiscalité ABC SA", heures: 42, collaborateurs: 2, progression: "90%" },
    { projet: "Comptabilité XYZ", heures: 112, collaborateurs: 3, progression: "45%" },
    { projet: "Restructuration DEF", heures: 56, collaborateurs: 5, progression: "30%" },
    { projet: "Formation PQR", heures: 24, collaborateurs: 1, progression: "100%" }
  ];
  
  exportToPdf(
    "Analyse des temps par projet",
    timeData,
    `rapport-temps-${new Date().toISOString().slice(0, 7)}`
  );
}
