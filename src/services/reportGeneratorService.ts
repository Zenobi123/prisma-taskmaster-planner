
import { Rapport, ReportParameters } from "@/types/rapport";

/**
 * Generates a new report based on the provided parameters
 */
export const generateNewReport = async (
  type: string, 
  parameters: ReportParameters
): Promise<Rapport> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Create a new fake report
  return {
    id: Math.random().toString(36).substring(2, 9),
    titre: parameters.titre,
    date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    type: type,
    taille: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
    createdAt: new Date()
  };
};
