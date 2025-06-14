
import { ReportDataService } from './reportDataService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export async function generateActivityReport() {
  try {
    console.log('Génération du rapport d\'activité...');
    const data = await ReportDataService.getAllReportData();
    console.log('Données récupérées:', data);
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Rapport d\'Activité Mensuel', 14, 22);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Analyse des prestations par type (basée sur les descriptions des factures)
    const prestationsAnalysis = data.factures.reduce((acc: Record<string, { nombre: number; montant: number }>, facture: any) => {
      // Catégorisation simple basée sur les mots-clés
      let categorie = 'Autres services';
      const description = facture.notes || '';
      
      if (description.toLowerCase().includes('fiscal') || description.toLowerCase().includes('igs') || description.toLowerCase().includes('patente')) {
        categorie = 'Conseil fiscal';
      } else if (description.toLowerCase().includes('comptab') || description.toLowerCase().includes('compta')) {
        categorie = 'Comptabilité';
      } else if (description.toLowerCase().includes('déclaration') || description.toLowerCase().includes('dsf') || description.toLowerCase().includes('darp')) {
        categorie = 'Déclarations fiscales';
      } else if (description.toLowerCase().includes('paie') || description.toLowerCase().includes('salaire')) {
        categorie = 'Gestion de paie';
      } else if (description.toLowerCase().includes('audit')) {
        categorie = 'Audit';
      }
      
      if (!acc[categorie]) {
        acc[categorie] = { nombre: 0, montant: 0 };
      }
      
      acc[categorie].nombre++;
      acc[categorie].montant += Number(facture.montant) || 0;
      
      return acc;
    }, {});
    
    const total: number = (Object.values(prestationsAnalysis) as { nombre: number; montant: number }[]).reduce((sum: number, cat: { nombre: number; montant: number }): number => {
      return sum + (Number(cat.montant) || 0);
    }, 0);
    
    const activityData = Object.entries(prestationsAnalysis).map(([activite, data]: [string, { nombre: number; montant: number }]) => {
      const montant = Number(data.montant) || 0;
      const nombre = Number(data.nombre) || 0;
      return [
        activite,
        nombre.toString(),
        total > 0 ? `${((montant / total) * 100).toFixed(1)}%` : '0.0%',
        `${montant.toLocaleString()} FCFA`
      ];
    });
    
    (doc as any).autoTable({
      startY: 40,
      head: [['Activité', 'Nombre', 'Pourcentage', 'Montant']],
      body: activityData,
      theme: 'grid'
    });
    
    console.log('Téléchargement du rapport...');
    doc.save(`rapport-activite-${new Date().toISOString().slice(0, 10)}.pdf`);
    console.log('Rapport téléchargé avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du rapport d\'activité:', error);
    throw error;
  }
}
