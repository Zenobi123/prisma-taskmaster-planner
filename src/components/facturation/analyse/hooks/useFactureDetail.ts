
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FactureDetail } from "../types/DetailFactureTypes";

// Cache pour les détails des factures
const factureDetailsCache = new Map<string, {data: FactureDetail, timestamp: number}>();
// Durée de validité du cache en ms (1 minute)
const CACHE_DURATION = 60000;

export const useFactureDetail = (factureId: string) => {
  const [factureDetail, setFactureDetail] = useState<FactureDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    // Nettoyer lors du démontage
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchFactureDetail = async () => {
      if (!factureId) return;
      
      setIsLoading(true);
      
      // Vérifier le cache
      const now = Date.now();
      const cachedDetail = factureDetailsCache.get(factureId);
      
      if (cachedDetail && now - cachedDetail.timestamp < CACHE_DURATION) {
        console.log(`Utilisation du cache pour les détails de la facture ${factureId}`);
        setFactureDetail(cachedDetail.data);
        setIsLoading(false);
        return;
      }
      
      try {
        console.log(`Récupération des détails de la facture ${factureId} depuis la base de données`);
        
        // Fetch facture
        const { data: factureData, error: factureError } = await supabase
          .from("factures")
          .select(`
            id, date, echeance, montant, montant_paye, status, status_paiement,
            clients:client_id (id, nom, raisonsociale, type)
          `)
          .eq("id", factureId)
          .single();
        
        if (factureError) throw factureError;
        
        // Fetch prestations
        const { data: prestationsData, error: prestationsError } = await supabase
          .from("prestations")
          .select("*")
          .eq("facture_id", factureId);
        
        if (prestationsError) throw prestationsError;
        
        // Map prestations to add a "type" property
        const prestationsWithType = prestationsData.map(prestation => {
          // Check if the description includes these keywords to determine type
          let type = "honoraires";
          
          const descLower = prestation.description.toLowerCase();
          if (
            descLower.includes("patente") || 
            descLower.includes("bail") || 
            descLower.includes("taxe") || 
            descLower.includes("impôt") || 
            descLower.includes("précompte") || 
            descLower.includes("solde ir") || 
            descLower.includes("solde irpp") || 
            descLower.includes("timbre")
          ) {
            type = "impots";
          }
          
          return {
            ...prestation,
            type
          };
        });
        
        // Format client name based on client type
        const clientName = factureData.clients.type === 'physique'
          ? factureData.clients.nom
          : factureData.clients.raisonsociale;
        
        const detailData: FactureDetail = {
          id: factureData.id,
          date: factureData.date,
          client: clientName,
          montant: factureData.montant,
          montant_paye: factureData.montant_paye || 0,
          status: factureData.status,
          status_paiement: factureData.status_paiement,
          echeance: factureData.echeance,
          prestations: prestationsWithType
        };
        
        // Mettre à jour le cache
        factureDetailsCache.set(factureId, {
          data: detailData,
          timestamp: now
        });
        
        // Mettre à jour l'état seulement si le composant est toujours monté
        if (isMounted.current) {
          setFactureDetail(detailData);
        }
      } catch (error) {
        console.error("Error fetching facture details:", error);
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };
    
    if (factureId) {
      fetchFactureDetail();
    }
  }, [factureId]);

  // Calculate totals if factureDetail exists
  const totals = factureDetail ? {
    totalImpots: factureDetail.prestations
      .filter(p => p.type === "impots")
      .reduce((sum, p) => sum + p.montant, 0),
    totalHonoraires: factureDetail.prestations
      .filter(p => p.type === "honoraires")
      .reduce((sum, p) => sum + p.montant, 0),
    montantRestant: factureDetail.montant - factureDetail.montant_paye,
    pourcentagePaye: (factureDetail.montant_paye / factureDetail.montant) * 100
  } : null;

  return {
    factureDetail,
    isLoading,
    totals
  };
};
