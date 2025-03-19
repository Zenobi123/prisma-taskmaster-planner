
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Facture } from "@/types/facture";

// Fonction pour formater les montants
const formatMontant = (montant: number) => {
  return new Intl.NumberFormat('fr-FR').format(montant) + " XAF";
};

// Fonction pour générer un PDF de facture
export const generatePDF = async (facture: Facture) => {
  // Créer un nouveau document PDF
  const doc = new jsPDF();
  
  // Ajouter le titre et les informations de la facture
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text("FACTURE", 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.text(`Facture N° : ${facture.id.substring(0, 8)}`, 20, 40);
  doc.text(`Date : ${format(new Date(facture.date), "dd/MM/yyyy", { locale: fr })}`, 20, 45);
  doc.text(`Échéance : ${format(new Date(facture.echeance), "dd/MM/yyyy", { locale: fr })}`, 20, 50);
  
  // Ajouter les informations du client
  doc.setFontSize(12);
  doc.text("Client :", 130, 40);
  doc.setFontSize(10);
  doc.text(facture.client.nom, 130, 45);
  doc.text(facture.client.adresse, 130, 50);
  doc.text(`Tél : ${facture.client.telephone}`, 130, 55);
  doc.text(`Email : ${facture.client.email}`, 130, 60);
  
  // Ajouter un statut
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  switch (facture.status) {
    case "payée":
      doc.setTextColor(34, 139, 34); // Vert
      doc.text("PAYÉE", 180, 20);
      break;
    case "partiellement_payée":
      doc.setTextColor(255, 165, 0); // Orange
      doc.text("PARTIELLEMENT PAYÉE", 150, 20);
      break;
    case "en_attente":
      doc.setTextColor(128, 128, 128); // Gris
      doc.text("EN ATTENTE", 170, 20);
      break;
    case "envoyée":
      doc.setTextColor(0, 0, 255); // Bleu
      doc.text("ENVOYÉE", 170, 20);
      break;
    case "annulée":
      doc.setTextColor(255, 0, 0); // Rouge
      doc.text("ANNULÉE", 170, 20);
      break;
    default:
      break;
  }
  
  // Ajouter le tableau des prestations
  autoTable(doc, {
    startY: 70,
    head: [['Description', 'Quantité', 'Prix unitaire', 'Taux', 'Montant']],
    body: facture.prestations.map(prestation => [
      prestation.description,
      prestation.quantite?.toString() || "1",
      formatMontant(prestation.montant),
      prestation.taux ? `${prestation.taux}%` : "-",
      formatMontant((prestation.quantite || 1) * prestation.montant)
    ]),
    foot: [
      ['', '', '', 'Total', formatMontant(facture.montant)]
    ],
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
    styles: {
      fontSize: 8,
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { halign: 'right', cellWidth: 20 },
      2: { halign: 'right', cellWidth: 30 },
      3: { halign: 'right', cellWidth: 20 },
      4: { halign: 'right', cellWidth: 30 }
    }
  });
  
  // Si des paiements existent, ajouter le tableau des paiements
  if (facture.paiements && facture.paiements.length > 0) {
    const finalY = (doc as any).lastAutoTable.finalY || 120;
    
    doc.setFontSize(12);
    doc.text("Historique des paiements", 20, finalY + 10);
    
    autoTable(doc, {
      startY: finalY + 15,
      head: [['Date', 'Mode', 'Montant', 'Notes']],
      body: facture.paiements.map(paiement => [
        format(new Date(paiement.date), "dd/MM/yyyy", { locale: fr }),
        paiement.mode.charAt(0).toUpperCase() + paiement.mode.slice(1),
        formatMontant(paiement.montant),
        paiement.notes || "-"
      ]),
      foot: [
        ['', 'Total payé', formatMontant(facture.montant_paye || 0), '']
      ],
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
      styles: {
        fontSize: 8,
        cellPadding: 5
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 30 },
        2: { halign: 'right', cellWidth: 30 },
        3: { cellWidth: 'auto' }
      }
    });
  }
  
  // Ajouter les notes si elles existent
  if (facture.notes) {
    const finalY = (doc as any).lastAutoTable.finalY || 120;
    
    doc.setFontSize(12);
    doc.text("Notes", 20, finalY + 10);
    
    doc.setFontSize(10);
    const splitNotes = doc.splitTextToSize(facture.notes, 170);
    doc.text(splitNotes, 20, finalY + 20);
  }
  
  // Ajouter le pied de page
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} sur ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }
  
  // Télécharger le PDF
  const fileName = `facture_${facture.id.substring(0, 8)}_${facture.client.nom.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};
