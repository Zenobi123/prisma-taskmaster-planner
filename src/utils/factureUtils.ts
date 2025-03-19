
import { Facture } from "@/types/facture";
import { getClientData } from "@/services/factureService";

export const prepareNewInvoice = async (formData: any, factures: Facture[]) => {
  const newId = generateNewInvoiceId(factures);
  const clientData = await getClientData(formData.clientId);
  const montantTotal = calculateTotalAmount(formData.prestations);
  
  // Get client name correctly based on client type
  const clientNom = clientData.type === 'physique' 
    ? clientData.nom || "Client sans nom"
    : clientData.raisonsociale || "Client sans nom";
  
  // Safely extract client address
  let clientAdresse = extractClientAddress(clientData);
  
  // Safely extract client telephone
  let clientTelephone = extractClientTelephone(clientData);
  
  // Safely extract client email
  let clientEmail = extractClientEmail(clientData);
  
  const newFactureDB = {
    id: newId,
    client_id: formData.clientId,
    client_nom: clientNom,
    client_adresse: clientAdresse,
    client_telephone: clientTelephone,
    client_email: clientEmail,
    date: formData.dateEmission,
    echeance: formData.dateEcheance,
    montant: montantTotal,
    status: formData.modeReglement === 'comptant' ? 'payée' : 'en_attente',
    prestations: JSON.stringify(formData.prestations),
    notes: formData.notes,
    mode_reglement: formData.modeReglement,
    moyen_paiement: formData.moyenPaiement
  };
  
  const newFactureState: Facture = {
    id: newId,
    client: {
      id: formData.clientId,
      nom: clientNom,
      adresse: clientAdresse,
      telephone: clientTelephone,
      email: clientEmail
    },
    date: formData.dateEmission,
    echeance: formData.dateEcheance,
    montant: montantTotal,
    status: formData.modeReglement === 'comptant' ? 'payée' : 'en_attente',
    prestations: formData.prestations,
    notes: formData.notes,
    modeReglement: formData.modeReglement,
    moyenPaiement: formData.moyenPaiement
  };
  
  return { newFactureDB, newFactureState };
};

// Helper functions
const generateNewInvoiceId = (factures: Facture[]) => {
  return `F${new Date().getFullYear()}-${(factures.length + 1).toString().padStart(3, '0')}`;
};

const calculateTotalAmount = (prestations: any[]) => {
  return prestations.reduce((sum: number, p: any) => sum + p.montant, 0);
};

const extractClientAddress = (clientData: any) => {
  let clientAdresse = "Adresse non spécifiée";
  if (clientData.adresse && typeof clientData.adresse === 'object' && 'ville' in clientData.adresse) {
    clientAdresse = String(clientData.adresse.ville) || "Adresse non spécifiée";
  }
  return clientAdresse;
};

const extractClientTelephone = (clientData: any) => {
  let clientTelephone = "Téléphone non spécifié";
  if (clientData.contact && typeof clientData.contact === 'object' && 'telephone' in clientData.contact) {
    clientTelephone = String(clientData.contact.telephone) || "Téléphone non spécifié";
  }
  return clientTelephone;
};

const extractClientEmail = (clientData: any) => {
  let clientEmail = "Email non spécifié";
  if (clientData.contact && typeof clientData.contact === 'object' && 'email' in clientData.contact) {
    clientEmail = String(clientData.contact.email) || "Email non spécifié";
  }
  return clientEmail;
};
