
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Facture } from "@/types/facture";

export const generateFacturePDF = (facture: Facture): jsPDF => {
  // Créer un nouveau document PDF
  const doc = new jsPDF();
  
  // En-tête avec logo et informations de l'entreprise
  doc.setFontSize(20);
  doc.setTextColor(44, 62, 80);
  doc.text("FACTURE", 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  // Informations de l'entreprise
  doc.text("GESTION PLUS SARL", 15, 30);
  doc.text("123 Av. des Finances, Yaoundé", 15, 35);
  doc.text("Tel: +237 xxx xxx xxx", 15, 40);
  doc.text("Email: contact@gestionplus.cm", 15, 45);
  
  // Informations de la facture
  doc.text(`N° Facture: ${facture.id}`, 130, 30);
  doc.text(`Date d'émission: ${facture.date}`, 130, 35);
  doc.text(`Date d'échéance: ${facture.echeance}`, 130, 40);
  
  // Statut de la facture
  let statut = "";
  let statutColor = [0, 0, 0];
  
  switch (facture.status) {
    case "non_paye":
      statut = "NON PAYÉE";
      statutColor = [192, 57, 43]; // Rouge
      break;
    case "partiellement_paye":
      statut = "PARTIELLEMENT PAYÉE";
      statutColor = [243, 156, 18]; // Orange
      break;
    case "paye":
      statut = "PAYÉE";
      statutColor = [39, 174, 96]; // Vert
      break;
  }
  
  doc.setTextColor(statutColor[0], statutColor[1], statutColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text(statut, 130, 50);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  
  // Informations du client
  doc.setFillColor(240, 240, 240);
  doc.rect(15, 60, 80, 30, "F");
  doc.setFont("helvetica", "bold");
  doc.text("INFORMATIONS CLIENT", 55, 67, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.text(`Nom: ${facture.client_nom}`, 20, 75);
  doc.text(`Adresse: ${facture.client_adresse}`, 20, 80);
  doc.text(`Email: ${facture.client_email}`, 20, 85);
  doc.text(`Téléphone: ${facture.client_telephone}`, 20, 90);
  
  // Tableau des prestations
  autoTable(doc, {
    startY: 100,
    head: [["Description", "Montant (FCFA)"]],
    body: facture.prestations.map(item => [
      item.description,
      item.montant.toLocaleString()
    ]),
    foot: [
      ["Total", facture.montant.toLocaleString()],
      ["Montant payé", (facture.montant_paye || 0).toLocaleString()],
      ["Reste à payer", (facture.montant - (facture.montant_paye || 0)).toLocaleString()]
    ],
    headStyles: {
      fillColor: [44, 62, 80],
      textColor: [255, 255, 255],
      fontSize: 10,
      halign: "center"
    },
    bodyStyles: {
      fontSize: 9
    },
    footStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontSize: 10,
      fontStyle: "bold"
    },
    theme: "grid",
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 40, halign: "right" }
    }
  });
  
  // Notes et conditions de paiement
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  
  doc.setFont("helvetica", "bold");
  doc.text("Conditions de paiement:", 15, finalY + 15);
  doc.setFont("helvetica", "normal");
  
  let modeReglement = "Virement bancaire";
  if (facture.mode_reglement) {
    modeReglement = facture.mode_reglement;
  }
  
  doc.text(`Mode de règlement: ${modeReglement}`, 15, finalY + 22);
  
  if (facture.notes) {
    doc.setFont("helvetica", "bold");
    doc.text("Notes:", 15, finalY + 32);
    doc.setFont("helvetica", "normal");
    doc.text(facture.notes, 15, finalY + 39);
  }
  
  // Pied de page
  doc.setFontSize(8);
  doc.text("Cette facture a été générée électroniquement par Gestion Plus SARL.", 105, 280, { align: "center" });
  
  return doc;
};

export const downloadFacturePDF = (facture: Facture): void => {
  const doc = generateFacturePDF(facture);
  doc.save(`Facture-${facture.id}.pdf`);
};

export const printFacturePDF = (facture: Facture): void => {
  const doc = generateFacturePDF(facture);
  doc.autoPrint();
  doc.output("dataurlnewwindow");
};
