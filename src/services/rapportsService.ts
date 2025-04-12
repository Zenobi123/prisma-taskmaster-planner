
import { Rapport } from "@/types/rapport";

/**
 * Generates fake reports data for demonstration purposes
 */
export const generateFakeReports = (): Rapport[] => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  return [
    {
      id: "1",
      titre: "Synthèse fiscale trimestrielle",
      date: `T1 ${currentYear}`,
      type: "fiscal",
      taille: "1.2 MB",
      createdAt: new Date(currentYear, currentMonth - 3, 15)
    },
    {
      id: "2",
      titre: "Rapport de TVA mensuel",
      date: `${new Date(currentYear, currentMonth - 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
      type: "fiscal",
      taille: "840 KB",
      createdAt: new Date(currentYear, currentMonth - 1, 5)
    },
    {
      id: "3",
      titre: "Bilan financier annuel",
      date: `${currentYear - 1}`,
      type: "financier",
      taille: "3.5 MB",
      createdAt: new Date(currentYear, 0, 31)
    },
    {
      id: "4",
      titre: "Analyse des clients par secteur",
      date: `${new Date(currentYear, currentMonth - 2, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
      type: "client",
      taille: "1.8 MB",
      createdAt: new Date(currentYear, currentMonth - 2, 20)
    },
    {
      id: "5",
      titre: "Suivi des obligations fiscales",
      date: `${new Date(currentYear, currentMonth, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
      type: "fiscal",
      taille: "2.1 MB",
      createdAt: new Date(currentYear, currentMonth, 5)
    },
    {
      id: "6",
      titre: "Rapport d'activité mensuel",
      date: `${new Date(currentYear, currentMonth - 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
      type: "activite",
      taille: "1.5 MB",
      createdAt: new Date(currentYear, currentMonth - 1, 28)
    },
    {
      id: "7",
      titre: "État des paiements clients",
      date: `${new Date(currentYear, currentMonth, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
      type: "financier",
      taille: "950 KB",
      createdAt: new Date(currentYear, currentMonth, 10)
    },
  ];
};
