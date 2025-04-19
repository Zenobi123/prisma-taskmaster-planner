
import { DocumentService } from "@/utils/pdf/documentService";
import autoTable from "jspdf-autotable";

export function generateClientReport() {
  const clientData = [
    { client: "ABC Cameroun SA", secteur: "Industrie", chiffre_affaires: 4250000, statut: "Actif" },
    { client: "XYZ Consulting", secteur: "Services", chiffre_affaires: 2830000, statut: "Actif" },
    { client: "LMN Technologies", secteur: "IT", chiffre_affaires: 1950000, statut: "En pause" },
    { client: "PQR Distributions", secteur: "Commerce", chiffre_affaires: 3120000, statut: "Actif" },
    { client: "DEF Constructions", secteur: "BTP", chiffre_affaires: 5340000, statut: "Actif" }
  ];
  
  try {
    const docService = new DocumentService('rapport', 'Rapport clients', 'client-analysis');
    const doc = docService.getDocument();
    
    docService.addStandardHeader();
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("Analyse du portefeuille clients", 15, 65);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      "Ce rapport présente une analyse détaillée du portefeuille clients et de leurs activités. " +
      "Il comprend des informations sur le chiffre d'affaires, le secteur d'activité et le statut de chaque client.",
      15, 75
    );
    
    autoTable(doc, {
      startY: 85,
      head: [["Client", "Secteur d'activité", "Chiffre d'affaires", "Statut"]],
      body: clientData.map(client => [
        client.client,
        client.secteur,
        `${new Intl.NumberFormat('fr-FR').format(client.chiffre_affaires)} XAF`,
        client.statut
      ]),
      theme: 'grid',
      headStyles: { 
        fillColor: [60, 98, 85], 
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 249]
      },
    });
    
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Résumé du portefeuille", 15, finalY);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const clientCount = clientData.length;
    const activeCount = clientData.filter(c => c.statut === "Actif").length;
    const totalRevenue = clientData.reduce((sum, c) => sum + c.chiffre_affaires, 0);
    const averageRevenue = totalRevenue / clientCount;
    
    doc.text(`• Nombre total de clients: ${clientCount}`, 15, finalY + 10);
    doc.text(`• Clients actifs: ${activeCount} (${Math.round(activeCount/clientCount*100)}%)`, 15, finalY + 20);
    doc.text(`• Chiffre d'affaires total: ${new Intl.NumberFormat('fr-FR').format(totalRevenue)} XAF`, 15, finalY + 30);
    doc.text(`• Chiffre d'affaires moyen: ${new Intl.NumberFormat('fr-FR').format(Math.round(averageRevenue))} XAF`, 15, finalY + 40);
    
    docService.addStandardFooter();
    
    docService.generate(true);
  } catch (error) {
    console.error("Erreur lors de la génération du rapport clients:", error);
    throw error;
  }
}
