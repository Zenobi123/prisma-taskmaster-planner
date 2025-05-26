
import { exportToPdf } from "@/utils/exports";

export function generateActivityReport() {
  const activityData = [
    { activite: "Conseil fiscal", nombre: 24, pourcentage: "32%", evolution: "+5%" },
    { activite: "Comptabilité", nombre: 18, pourcentage: "24%", evolution: "+2%" },
    { activite: "Déclarations fiscales", nombre: 15, pourcentage: "20%", evolution: "+8%" },
    { activite: "Gestion de paie", nombre: 12, pourcentage: "16%", evolution: "-3%" },
    { activite: "Audit", nombre: 6, pourcentage: "8%", evolution: "+1%" }
  ];
  
  exportToPdf(
    "Rapport d'activité mensuel",
    activityData,
    `rapport-activite-${new Date().toISOString().slice(0, 7)}`
  );
}
