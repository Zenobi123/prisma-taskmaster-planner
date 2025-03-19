
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Facture } from "@/types/facture";

export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
};

export const generatePDF = (facture: Facture, download: boolean = false) => {
  // Créer un nouveau document PDF
  const doc = new jsPDF();
  
  // Paramètres de style
  const primaryColor = [41, 128, 185]; // Bleu
  const secondaryColor = [44, 62, 80]; // Gris foncé
  
  // En-tête
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 30, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("FACTURE", 14, 20);
  
  doc.setFontSize(12);
  doc.text(`N° ${facture.id}`, 170, 15);
  doc.text(`Date: ${formatDate(facture.date)}`, 170, 22);
  
  // Informations de l'entreprise
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(10);
  
  doc.setFontSize(12);
  doc.text("De:", 14, 40);
  doc.setFontSize(10);
  doc.text("Votre Entreprise", 14, 46);
  doc.text("Adresse de l'entreprise", 14, 51);
  doc.text("Code postal, Ville", 14, 56);
  doc.text("Tél: 01 23 45 67 89", 14, 61);
  doc.text("Email: contact@entreprise.com", 14, 66);
  
  // Informations du client
  doc.setFontSize(12);
  doc.text("Facturé à:", 120, 40);
  doc.setFontSize(10);
  doc.text(facture.client.nom, 120, 46);
  
  if (facture.client.adresse) {
    const adresseLines = facture.client.adresse.split("\n");
    adresseLines.forEach((line, index) => {
      doc.text(line, 120, 51 + (index * 5));
    });
  }
  
  if (facture.client.telephone) {
    doc.text(`Tél: ${facture.client.telephone}`, 120, 61);
  }
  
  if (facture.client.email) {
    doc.text(`Email: ${facture.client.email}`, 120, 66);
  }
  
  // Détails de la facture
  doc.text(`Échéance: ${formatDate(facture.echeance)}`, 14, 80);
  
  if (facture.status === "payée") {
    doc.setTextColor(39, 174, 96); // Vert
    doc.text("PAYÉE", 170, 80);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  } else if (facture.status === "partiellement_payée") {
    doc.setTextColor(243, 156, 18); // Orange
    doc.text("PARTIELLEMENT PAYÉE", 140, 80);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  } else {
    doc.setTextColor(231, 76, 60); // Rouge
    doc.text("EN ATTENTE", 160, 80);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  }
  
  // Tableau des prestations
  const tableColumn = ["Description", "Quantité", "Prix unitaire", "Total"];
  const tableRows: any[] = [];
  
  facture.prestations.forEach(prestation => {
    const quantity = prestation.quantite || 1;
    const unitPrice = prestation.montant / quantity;
    
    tableRows.push([
      prestation.description,
      quantity.toString(),
      `${unitPrice.toLocaleString()} FCFA`,
      `${prestation.montant.toLocaleString()} FCFA`
    ]);
  });
  
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 90,
    theme: "grid",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontStyle: "bold"
    },
    foot: [
      ["", "", "Sous-total:", `${facture.montant.toLocaleString()} FCFA`],
      ["", "", "Total:", `${facture.montant.toLocaleString()} FCFA`]
    ],
    footStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: "bold"
    }
  });
  
  // Notes
  if (facture.notes) {
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.text("Notes:", 14, finalY + 10);
    doc.setFontSize(9);
    const splitNotes = doc.splitTextToSize(facture.notes, 180);
    doc.text(splitNotes, 14, finalY + 16);
  }
  
  // Pied de page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const pageSize = doc.internal.pageSize;
    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    doc.text(`Page ${i} sur ${pageCount}`, pageWidth / 2, 285, { align: "center" });
  }
  
  // Générer ou télécharger le PDF
  if (download) {
    doc.save(`Facture_${facture.id}.pdf`);
  } else {
    // Ouvrir dans une nouvelle fenêtre pour impression
    const pdfOutput = doc.output('datauristring');
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`<iframe width='100%' height='100%' src='${pdfOutput}'></iframe>`);
    }
  }
  
  return doc;
};
