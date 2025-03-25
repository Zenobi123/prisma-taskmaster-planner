
import { formatMontant, formatDate } from "@/utils/formatUtils";
import { InvoiceDetails } from "./types";

export const getEmailTemplate = (invoiceDetails: InvoiceDetails | null): string => {
  if (!invoiceDetails) {
    return `Objet : Information sur votre facture N°XXXX

Cher(e) [Nom du client], 

Nous espérons que vous allez bien.  

Nous souhaitons vous informer que votre facture N°XXXX d'un montant de [Montant total] F CFA est toujours en attente de règlement.  

🔹 Montant restant à payer : [Montant restant] F CFA  
🔹 Date d'échéance : [Date]  

Nous vous invitons à effectuer votre règlement à votre convenance via :  
✔ Orange Money : [Numéro de paiement]  
✔ MTN Mobile Money : [Numéro de paiement]    

Si votre paiement a déjà été effectué, merci de ne pas tenir compte de ce message.  

N'hésitez pas à nous contacter au [Numéro support] ou à répondre à cet email si vous avez la moindre question.  

Nous restons à votre disposition et vous remercions pour votre confiance.  

Cordialement,
PRISMA GESTION`;
  }

  return `Objet : Information sur votre facture N°${invoiceDetails.id}

Cher(e) ${invoiceDetails.client.nom}, 

Nous espérons que vous allez bien.  

Nous souhaitons vous informer que votre facture N°${invoiceDetails.id} d'un montant de ${formatMontant(invoiceDetails.montant)} est toujours en attente de règlement.  

🔹 Montant restant à payer : ${formatMontant(invoiceDetails.montant_restant)}  
🔹 Date d'échéance : ${formatDate(invoiceDetails.echeance)}  

Nous vous invitons à effectuer votre règlement à votre convenance via :  
✔ Orange Money : [Numéro de paiement]  
✔ MTN Mobile Money : [Numéro de paiement]    

Si votre paiement a déjà été effectué, merci de ne pas tenir compte de ce message.  

N'hésitez pas à nous contacter au [Numéro support] ou à répondre à cet email si vous avez la moindre question.  

Nous restons à votre disposition et vous remercions pour votre confiance.  

Cordialement,
PRISMA GESTION`;
};

export const getSmsTemplate = (invoiceDetails: InvoiceDetails | null): string => {
  if (!invoiceDetails) {
    return `Cher(e) [Nom du client], votre facture N°XXXX s'élève à [Montant total] FCFA.  
✔ Solde réglé : [Montant payé] FCFA  
✔ Solde restant : [Montant restant] FCFA  

Vous pouvez payer via :  
✔ Orange Money : [Numéro]  
✔ MTN Mobile Money : [Numéro]  

Besoin d'aide ? Contactez-nous au [Numéro support].  
Merci pour votre confiance.  
PRISMA GESTION`;
  }

  return `Cher(e) ${invoiceDetails.client.nom}, votre facture N°${invoiceDetails.id} s'élève à ${formatMontant(invoiceDetails.montant)}.  
✔ Solde réglé : ${formatMontant(invoiceDetails.montant_paye)}  
✔ Solde restant : ${formatMontant(invoiceDetails.montant_restant)}  

Vous pouvez payer via :  
✔ Orange Money : [Numéro]  
✔ MTN Mobile Money : [Numéro]  

Besoin d'aide ? Contactez-nous au [Numéro support].  
Merci pour votre confiance.  
PRISMA GESTION`;
};

export const getBothTemplate = (invoiceDetails: InvoiceDetails | null): string => {
  if (!invoiceDetails) {
    return `[Email & SMS] Rappel important concernant votre facture n°XXXX en attente de paiement. Merci de régulariser votre situation rapidement.`;
  }

  return `[Email & SMS] Rappel important pour ${invoiceDetails.client.nom} concernant la facture n°${invoiceDetails.id} de ${formatMontant(invoiceDetails.montant)} (${formatMontant(invoiceDetails.montant_restant)} restant). Échéance: ${formatDate(invoiceDetails.echeance)}.`;
};

export const getMessageTemplate = (
  method: 'email' | 'sms' | 'both',
  invoiceDetails: InvoiceDetails | null
): string => {
  switch (method) {
    case 'email':
      return getEmailTemplate(invoiceDetails);
    case 'sms':
      return getSmsTemplate(invoiceDetails);
    case 'both':
      return getBothTemplate(invoiceDetails);
    default:
      return '';
  }
};
