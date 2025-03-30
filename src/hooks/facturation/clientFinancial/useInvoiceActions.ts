
import { useState } from "react";
import { ClientInvoice, ClientPayment } from "@/types/clientFinancial";
import { Facture } from "@/types/facture";
import useFactureViewActions from "@/hooks/facturation/factureActions/useFactureViewActions";

export const useInvoiceActions = (clientName: string) => {
  const { handleVoirFacture, handleTelechargerFacture } = useFactureViewActions();
  const [previewInvoice, setPreviewInvoice] = useState<Facture | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const convertToFacture = (invoice: ClientInvoice): Facture => {
    return {
      id: invoice.id,
      client_id: invoice.id.split('-')[0], // Estimation de l'ID client
      client: {
        id: invoice.id.split('-')[0], 
        nom: clientName,
        adresse: "",
        telephone: "",
        email: ""
      },
      date: invoice.date,
      echeance: invoice.echeance,
      montant: invoice.montant,
      montant_paye: invoice.montant_paye,
      status: invoice.status as "brouillon" | "envoyée" | "annulée",
      status_paiement: invoice.status_paiement as "non_payée" | "partiellement_payée" | "payée" | "en_retard",
      prestations: []
    };
  };

  const handlePreviewClick = (invoice: ClientInvoice) => {
    setPreviewInvoice(convertToFacture(invoice));
    setIsPreviewOpen(true);
  };

  const handleViewInNewTab = (invoice: ClientInvoice) => {
    handleVoirFacture(convertToFacture(invoice));
  };

  const handleDownloadClick = (invoice: ClientInvoice) => {
    handleTelechargerFacture(convertToFacture(invoice));
  };

  return {
    previewInvoice,
    isPreviewOpen,
    setIsPreviewOpen,
    handlePreviewClick,
    handleViewInNewTab,
    handleDownloadClick
  };
};
