
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { InvoiceDetails } from "./types";

export const useReminderInvoice = (invoiceId: string | null, isDialogOpen: boolean) => {
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      if (!invoiceId || !isDialogOpen) return;
      
      setIsLoading(true);
      try {
        // Fetch the invoice with client information
        const { data, error } = await supabase
          .from('factures')
          .select(`
            id, 
            montant, 
            montant_paye,
            echeance,
            clients:client_id (
              id,
              nom,
              raisonsociale,
              type,
              contact
            )
          `)
          .eq('id', invoiceId)
          .single();
          
        if (error) throw error;
        
        // Format the client data for display
        const clientName = data.clients.type === 'physique' 
          ? data.clients.nom 
          : data.clients.raisonsociale;
          
        const contact = data.clients.contact ? data.clients.contact : {};
        // Safely access the contact properties
        const clientPhone = typeof contact === 'object' && contact !== null 
          ? (contact as Record<string, any>).telephone || 'N/A' 
          : 'N/A';
        const clientEmail = typeof contact === 'object' && contact !== null 
          ? (contact as Record<string, any>).email || 'N/A' 
          : 'N/A';
        
        // Calculate montant_restant
        const montantRestant = data.montant - (data.montant_paye || 0);
        
        setInvoiceDetails({
          id: data.id,
          montant: data.montant,
          montant_paye: data.montant_paye || 0,
          montant_restant: montantRestant,
          echeance: data.echeance,
          client: {
            nom: clientName,
            telephone: clientPhone,
            email: clientEmail
          }
        });
        
      } catch (error) {
        console.error('Error fetching invoice details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInvoiceDetails();
  }, [invoiceId, isDialogOpen]);

  return { invoiceDetails, isLoading };
};
