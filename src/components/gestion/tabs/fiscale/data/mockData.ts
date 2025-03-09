
import { FiscalDocument, FiscalProcedure, FiscalContact } from "../types";

// Initial fiscal documents
export const initialFiscalDocuments: FiscalDocument[] = [
  {
    id: "dsf",
    name: "Déclaration Statistique et Fiscale (DSF)",
    description: "Déclaration annuelle des résultats",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    validUntil: null, // No expiration for this document
  },
  {
    id: "dmt",
    name: "Déclaration Mensuelle des Taxes (DMT)",
    description: "Relevé mensuel des taxes collectées",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    validUntil: null, // No expiration for this document
  },
  {
    id: "acf",
    name: "Attestation de Conformité Fiscale (ACF)",
    description: "Certificat de situation fiscale",
    createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000), // 80 days ago
    validUntil: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now (for testing notification)
  },
  {
    id: "ai",
    name: "Attestation d'Immatriculation (AI)",
    description: "Certificat d'immatriculation fiscale",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now (3 months)
  }
];

// Mock procedures
export const fiscalProcedures: FiscalProcedure[] = [
  {
    id: "demande-acf",
    name: "Demande d'attestation de conformité fiscale",
    description: "Procédure et documents requis",
  },
  {
    id: "reclamation",
    name: "Réclamation contentieuse",
    description: "Contestation d'un redressement fiscal",
  },
  {
    id: "redressement",
    name: "Procédure de redressement",
    description: "Étapes et recours disponibles",
  }
];

// Mock contacts
export const fiscalContacts: FiscalContact[] = [
  {
    id: "dgi",
    name: "Direction Générale des Impôts",
    description: "Yaoundé - Quartier Administratif",
    phone: "+237 222 23 11 11",
  },
  {
    id: "cime",
    name: "Centre des Impôts de Rattachement",
    description: "CIME Yaoundé I",
    phone: "+237 222 20 55 55",
  },
  {
    id: "control",
    name: "Service de Contrôle Fiscal",
    description: "Service des grandes entreprises",
    phone: "+237 222 20 40 40",
  }
];
