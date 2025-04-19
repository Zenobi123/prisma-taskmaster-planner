
import { exportToPdf } from "@/utils/exportUtils";

export function generateFinancialReport() {
  const financialData = [
    { categorie: "Revenus services fiscaux", montant: 2450000, evolution: "+15%", contribution: "38%" },
    { categorie: "Revenus comptabilité", montant: 1890000, evolution: "+8%", contribution: "29%" },
    { categorie: "Revenus conseils", montant: 1240000, evolution: "+12%", contribution: "19%" },
    { categorie: "Revenus formations", montant: 780000, evolution: "+20%", contribution: "12%" },
    { categorie: "Autres revenus", montant: 130000, evolution: "-5%", contribution: "2%" }
  ];
  
  exportToPdf(
    "Bilan financier trimestriel",
    financialData,
    `rapport-financier-T${Math.floor((new Date().getMonth() + 3) / 3)}-${new Date().getFullYear()}`
  );
}
