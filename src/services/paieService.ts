
import { supabase } from "@/integrations/supabase/client";
import { Employe } from "./rhService";

export interface Paie {
  id: string;
  employe_id: string;
  mois: number;
  annee: number;
  salaire_base: number;
  heures_sup?: number;
  taux_horaire_sup?: number;
  montant_heures_sup?: number;
  primes?: any[];
  total_primes?: number;
  salaire_brut: number;
  cnps_employe?: number;
  cnps_employeur?: number;
  irpp?: number;
  cac?: number;
  cfc?: number;
  tdl?: number;
  rav?: number; // Nouvelle propriété pour la Redevance Audiovisuelle
  autres_retenues?: any[];
  total_retenues?: number;
  salaire_net: number;
  mode_paiement?: string;
  date_paiement?: string;
  reference_paiement?: string;
  statut: 'En cours' | 'Payé' | 'Annulé';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PayCalculation {
  salaireBrut: number;
  cnpsEmploye: number;
  cnpsEmployeur: number;
  irpp: number;
  cac?: number;
  cfc?: number;
  tdl?: number;
  rav?: number; // Ajout de la RAV dans les résultats de calcul
  totalRetenues: number;
  salaireNet: number;
}

export const getFichesPaie = async (clientId: string, options?: { mois?: number, annee?: number }): Promise<Paie[]> => {
  // Récupérer d'abord les employés du client
  const { data: employes, error: empError } = await supabase
    .from('employes')
    .select('id')
    .eq('client_id', clientId);

  if (empError) {
    console.error("Erreur lors de la récupération des employés:", empError);
    throw empError;
  }

  if (!employes || employes.length === 0) {
    return [];
  }

  // Récupérer les fiches de paie pour ces employés
  let query = supabase
    .from('paie')
    .select('*')
    .in('employe_id', employes.map(e => e.id));

  if (options?.mois) {
    query = query.eq('mois', options.mois);
  }

  if (options?.annee) {
    query = query.eq('annee', options.annee);
  }

  const { data, error } = await query.order('annee', { ascending: false }).order('mois', { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des fiches de paie:", error);
    throw error;
  }

  return data ? data.map(paie => ({
    ...paie,
    primes: paie.primes ? (typeof paie.primes === 'string' ? JSON.parse(paie.primes) : paie.primes) : [],
    autres_retenues: paie.autres_retenues ? (typeof paie.autres_retenues === 'string' ? JSON.parse(paie.autres_retenues) : paie.autres_retenues) : []
  })) : [];
};

export const getFichesPaieEmploye = async (employeId: string): Promise<Paie[]> => {
  const { data, error } = await supabase
    .from('paie')
    .select('*')
    .eq('employe_id', employeId)
    .order('annee', { ascending: false })
    .order('mois', { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des fiches de paie:", error);
    throw error;
  }

  return data ? data.map(paie => ({
    ...paie,
    primes: paie.primes ? (typeof paie.primes === 'string' ? JSON.parse(paie.primes) : paie.primes) : [],
    autres_retenues: paie.autres_retenues ? (typeof paie.autres_retenues === 'string' ? JSON.parse(paie.autres_retenues) : paie.autres_retenues) : []
  })) : [];
};

export const getFichePaie = async (id: string): Promise<Paie> => {
  const { data, error } = await supabase
    .from('paie')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Erreur lors de la récupération de la fiche de paie:", error);
    throw error;
  }

  return {
    ...data,
    primes: data.primes ? (typeof data.primes === 'string' ? JSON.parse(data.primes) : data.primes) : [],
    autres_retenues: data.autres_retenues ? (typeof data.autres_retenues === 'string' ? JSON.parse(data.autres_retenues) : data.autres_retenues) : []
  };
};

export const addFichePaie = async (fichePaie: Omit<Paie, 'id' | 'created_at' | 'updated_at'>): Promise<Paie> => {
  const paieToInsert = {
    ...fichePaie,
    primes: fichePaie.primes ? JSON.stringify(fichePaie.primes) : JSON.stringify([]),
    autres_retenues: fichePaie.autres_retenues ? JSON.stringify(fichePaie.autres_retenues) : JSON.stringify([])
  };

  const { data, error } = await supabase
    .from('paie')
    .insert([paieToInsert])
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de l'ajout de la fiche de paie:", error);
    throw error;
  }

  return {
    ...data,
    primes: data.primes ? (typeof data.primes === 'string' ? JSON.parse(data.primes) : data.primes) : [],
    autres_retenues: data.autres_retenues ? (typeof data.autres_retenues === 'string' ? JSON.parse(data.autres_retenues) : data.autres_retenues) : []
  };
};

export const updateFichePaie = async (id: string, updates: Partial<Paie>): Promise<Paie> => {
  const updatesToApply = { ...updates };
  
  // Convertir les tableaux en JSON pour le stockage
  if (updates.primes) {
    updatesToApply.primes = JSON.stringify(updates.primes);
  }
  
  if (updates.autres_retenues) {
    updatesToApply.autres_retenues = JSON.stringify(updates.autres_retenues);
  }

  const { data, error } = await supabase
    .from('paie')
    .update(updatesToApply)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la mise à jour de la fiche de paie:", error);
    throw error;
  }

  return {
    ...data,
    primes: data.primes ? (typeof data.primes === 'string' ? JSON.parse(data.primes) : data.primes) : [],
    autres_retenues: data.autres_retenues ? (typeof data.autres_retenues === 'string' ? JSON.parse(data.autres_retenues) : data.autres_retenues) : []
  };
};

export const deleteFichePaie = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('paie')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Erreur lors de la suppression de la fiche de paie:", error);
    throw error;
  }
};

// Fonction pour calculer le montant de la RAV selon le barème
const calculerRAV = (salaireBrut: number): number => {
  // Barème RAV 2025
  if (salaireBrut <= 50000) return 0;
  if (salaireBrut <= 100000) return 750;
  if (salaireBrut <= 200000) return 1950;
  if (salaireBrut <= 300000) return 3250;
  if (salaireBrut <= 400000) return 4550;
  if (salaireBrut <= 500000) return 5850;
  if (salaireBrut <= 600000) return 7150;
  if (salaireBrut <= 700000) return 8450;
  if (salaireBrut <= 800000) return 9750;
  if (salaireBrut <= 900000) return 11050;
  if (salaireBrut <= 1000000) return 12350;
  return 13000; // Plus de 1 000 000
};

// Fonctions de calcul de paie
export const calculerPaie = (employe: Employe, mois: number, annee: number, options?: { 
  heuresSup?: number, 
  tauxHoraireSup?: number, 
  primes?: { libelle: string, montant: number }[] 
}): PayCalculation => {
  // Taux de cotisations
  const cnpsEmployeTaux = 4.2; // 4.2% du salaire brut
  const cnpsEmployeurTaux = 12.95; // 12.95% du salaire brut
  
  // Salaire brut (salaire de base + heures sup + primes)
  const montantHeuresSup = (options?.heuresSup || 0) * (options?.tauxHoraireSup || 0);
  const totalPrimes = options?.primes ? options.primes.reduce((sum, prime) => sum + prime.montant, 0) : 0;
  const salaireBrut = employe.salaire_base + montantHeuresSup + totalPrimes;
  
  // Plafond CNPS
  const plafondCNPS = 750000;
  const baseCNPS = Math.min(salaireBrut, plafondCNPS);
  
  // Cotisations CNPS
  const cnpsEmploye = (baseCNPS * cnpsEmployeTaux) / 100;
  const cnpsEmployeur = (baseCNPS * cnpsEmployeurTaux) / 100;
  
  // Base imposable pour l'IRPP (avec abattement forfaitaire de 30%)
  const baseImposable = salaireBrut - cnpsEmploye;
  const abattement = baseImposable * 0.3;
  const revenuImposable = baseImposable - abattement;
  
  // Calcul de l'IRPP selon les tranches
  let irpp = 0;
  if (revenuImposable <= 62000) {
    irpp = 0;
  } else if (revenuImposable <= 310000) {
    irpp = revenuImposable * 0.1;
  } else if (revenuImposable <= 429167) {
    irpp = revenuImposable * 0.15;
  } else if (revenuImposable <= 667000) {
    irpp = revenuImposable * 0.25;
  } else {
    irpp = revenuImposable * 0.35;
  }
  
  // Calcul du CAC (Centimes Additionnels Communaux) - 10% de l'IRPP
  const cac = irpp * 0.1;
  
  // Contribution au Crédit Foncier (CFC) - 1% du salaire brut
  const cfc = salaireBrut * 0.01;
  
  // Taxe de Développement Local (TDL) - variable selon les communes, ici on prend 0.5%
  const tdl = salaireBrut * 0.005;
  
  // Calcul de la Redevance Audiovisuelle (RAV)
  const rav = calculerRAV(salaireBrut);
  
  // Total des retenues
  const totalRetenues = cnpsEmploye + irpp + cac + cfc + tdl + rav;
  
  // Salaire net
  const salaireNet = salaireBrut - totalRetenues;
  
  return {
    salaireBrut,
    cnpsEmploye,
    cnpsEmployeur,
    irpp,
    cac,
    cfc,
    tdl,
    rav,
    totalRetenues,
    salaireNet
  };
};
