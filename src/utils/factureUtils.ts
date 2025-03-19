
import { Facture } from "@/types/facture";
import { getClientData } from "@/services/facture/clientService";

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
  const currentYear = new Date().getFullYear();
  const prefix = `F${currentYear}-`;
  
  // Filtrer les factures de l'année en cours et avec un format valide
  const currentYearFactures = factures.filter(f => f.id && f.id.startsWith(prefix));
  
  if (currentYearFactures.length === 0) {
    // Première facture de l'année
    console.log(`Aucune facture trouvée pour l'année ${currentYear}, création de la première: ${prefix}001`);
    return `${prefix}001`;
  }
  
  // Définir un pattern strict pour les ID de factures (ex: F2025-001)
  const pattern = new RegExp(`^${prefix}(\\d{3})$`);
  let maxNumber = 0;
  
  // Analyser chaque facture pour trouver le numéro le plus élevé
  currentYearFactures.forEach(facture => {
    if (!facture.id) return;
    
    console.log(`Analyse de l'ID de facture: ${facture.id}`);
    const match = facture.id.match(pattern);
    
    if (match && match[1]) {
      const number = parseInt(match[1], 10);
      console.log(`  - Numéro extrait: ${number}`);
      
      if (!isNaN(number) && number > maxNumber) {
        maxNumber = number;
        console.log(`  - Nouveau maximum: ${maxNumber}`);
      }
    } else {
      console.log(`  - Format non reconnu pour l'ID: ${facture.id}`);
    }
  });
  
  // Incrémenter et formater avec des zéros en préfixe
  const nextNumber = maxNumber + 1;
  const newId = `${prefix}${nextNumber.toString().padStart(3, '0')}`;
  console.log(`Génération d'un nouvel ID de facture: ${newId} (basé sur maxNumber=${maxNumber})`);
  
  return newId;
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
