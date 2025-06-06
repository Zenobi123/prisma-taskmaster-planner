
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/types/client";
import DatePickerSelector from "./fiscal/DatePickerSelector";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { addDays, format, parse, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { FiscalAttestationSection } from "./fiscal/FiscalAttestationSection";
import { AlertTriangle, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DirectTaxesSection } from "./fiscal/DirectTaxesSection";
import { DeclarationsSection } from "./fiscal/DeclarationsSection";
import { ObligationStatuses, ObligationType } from "@/hooks/fiscal/types";
import { toast } from "sonner";

interface ObligationsFiscalesProps {
  selectedClient: Client;
}

export const ObligationsFiscales: React.FC<ObligationsFiscalesProps> = ({ selectedClient }) => {
  const [fiscalYear, setFiscalYear] = useState<string>("2025");
  const [creationDate, setCreationDate] = useState<string>("2025-07-01");
  const [validityEndDate, setValidityEndDate] = useState<string>("");
  const [showInAlert, setShowInAlert] = useState<boolean>(true);
  const [hiddenFromDashboard, setHiddenFromDashboard] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // État pour les obligations fiscales - mise à jour pour inclure toutes les obligations
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>({
    // Direct taxes
    igs: { assujetti: false, payee: false, attachements: {}, observations: "" },
    patente: { assujetti: false, payee: false, attachements: {}, observations: "" },
    licence: { assujetti: false, payee: false, attachements: {}, observations: "" },
    bailCommercial: { assujetti: false, payee: false, attachements: {}, observations: "" },
    precompteLoyer: { assujetti: false, payee: false, attachements: {}, observations: "" },
    tpf: { assujetti: false, payee: false, attachements: {}, observations: "" },
    // Declarations
    dsf: { assujetti: false, depose: false, periodicity: "annuelle" as const, attachements: {}, observations: "" },
    darp: { assujetti: false, depose: false, periodicity: "annuelle" as const, attachements: {}, observations: "" },
    cntps: { assujetti: false, depose: false, periodicity: "mensuelle" as const, attachements: {}, observations: "" },
    precomptes: { assujetti: false, depose: false, periodicity: "mensuelle" as const, attachements: {}, observations: "" }
  });

  // Charger les données fiscales existantes au montage du composant
  useEffect(() => {
    const loadFiscalData = async () => {
      if (!selectedClient?.id) return;
      
      try {
        const { data: client, error } = await supabase
          .from("clients")
          .select("fiscal_data")
          .eq("id", selectedClient.id)
          .single();

        if (error) {
          console.error("Erreur lors du chargement des données fiscales:", error);
          return;
        }

        if (client?.fiscal_data && typeof client.fiscal_data === 'object') {
          const fiscalData = client.fiscal_data as any;
          
          // Charger les données d'attestation
          if (fiscalData.attestation) {
            setCreationDate(fiscalData.attestation.creationDate || "2025-07-01");
            setValidityEndDate(fiscalData.attestation.validityEndDate || "");
            setShowInAlert(fiscalData.attestation.showInAlert !== false);
          }
          
          // Charger les paramètres de tableau de bord
          if (fiscalData.hiddenFromDashboard !== undefined) {
            setHiddenFromDashboard(!!fiscalData.hiddenFromDashboard);
          }
          
          // Charger l'année sélectionnée
          if (fiscalData.selectedYear) {
            setFiscalYear(fiscalData.selectedYear);
          }
          
          // Charger les obligations pour l'année courante
          if (fiscalData.obligations && fiscalData.obligations[fiscalYear]) {
            const yearObligations = fiscalData.obligations[fiscalYear];
            setObligationStatuses(prev => ({
              ...prev,
              ...yearObligations
            }));
          }
        }
      } catch (error) {
        console.error("Exception lors du chargement des données fiscales:", error);
      }
    };

    loadFiscalData();
  }, [selectedClient?.id, fiscalYear]);

  // Calculer la date de fin de validité lorsque la date de création change
  useEffect(() => {
    if (!creationDate) return;
    
    try {
      // Conversion de la chaîne de date en objet Date
      let creationDateObj: Date;
      
      // Si la date est au format YYYY-MM-DD
      if (creationDate.includes('-')) {
        creationDateObj = new Date(creationDate);
      } else {
        // Si la date est au format DD/MM/YYYY
        creationDateObj = parse(creationDate, 'dd/MM/yyyy', new Date());
      }
      
      // Vérification que la date est valide
      if (isValid(creationDateObj)) {
        // Ajout de 90 jours pour la date de fin de validité
        const endDateObj = addDays(creationDateObj, 90);
        
        // Formatage de la date en chaîne au format YYYY-MM-DD
        const formattedEndDate = format(endDateObj, "yyyy-MM-dd");
        
        setValidityEndDate(formattedEndDate);
        setHasUnsavedChanges(true);
      }
    } catch (error) {
      console.error("Erreur lors du calcul de la date de fin de validité:", error);
    }
  }, [creationDate]);

  // Marquer comme ayant des modifications non enregistrées lorsque les valeurs changent
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [showInAlert, hiddenFromDashboard, obligationStatuses]);

  // Fonction pour sauvegarder les modifications de manière persistante
  const saveChanges = async () => {
    if (!selectedClient?.id) {
      toast.error("Impossible de sauvegarder : client non sélectionné");
      return;
    }

    try {
      setIsSaving(true);
      
      // Préparer les données à sauvegarder
      const fiscalDataToSave = {
        clientId: selectedClient.id,
        year: fiscalYear,
        attestation: {
          creationDate,
          validityEndDate,
          showInAlert
        },
        obligations: {
          [fiscalYear]: obligationStatuses
        },
        hiddenFromDashboard,
        selectedYear: fiscalYear,
        updatedAt: new Date().toISOString()
      };

      // Sauvegarder dans Supabase
      const { error } = await supabase
        .from("clients")
        .update({
          fiscal_data: fiscalDataToSave
        })
        .eq("id", selectedClient.id);

      if (error) {
        console.error("Erreur lors de la sauvegarde:", error);
        toast.error("Erreur lors de la sauvegarde des données fiscales");
        return;
      }

      setHasUnsavedChanges(false);
      toast.success("Données fiscales sauvegardées avec succès");
      
    } catch (error) {
      console.error("Exception lors de la sauvegarde:", error);
      toast.error("Erreur inattendue lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFiscalYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiscalYear(e.target.value);
    setHasUnsavedChanges(true);
  };

  // Gestion des changements d'état d'assujettissement et de paiement
  const handleStatusChange = (taxType: ObligationType, field: string, value: boolean) => {
    setObligationStatuses(prev => {
      if (field === "assujetti" && !value) {
        // Si on désactive l'assujettissement, on désactive aussi le paiement/dépôt
        const updatedObligation = { ...prev[taxType] };
        if ('payee' in updatedObligation) {
          (updatedObligation as any).payee = false;
        }
        if ('depose' in updatedObligation) {
          (updatedObligation as any).depose = false;
        }
        return {
          ...prev,
          [taxType]: { ...updatedObligation, assujetti: value }
        };
      }

      return {
        ...prev,
        [taxType]: { ...prev[taxType], [field]: value }
      };
    });
    setHasUnsavedChanges(true);
  };

  // Fonction pour vérifier si un impôt est déclaratif
  const isDeclarationObligation = (obligation: string): boolean => {
    return ["dsf", "darp", "cntps", "precomptes"].includes(obligation);
  };

  return (
    <div className="space-y-6">
      {/* Header et sélecteur d'année */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Obligations fiscales</h1>
          <p className="text-sm text-gray-500">Suivi des obligations fiscales de l'entreprise</p>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="fiscal-year" className="text-sm">Année fiscale:</Label>
          <select 
            id="fiscal-year"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={fiscalYear}
            onChange={handleFiscalYearChange}
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
      </div>

      {/* Alerte modifications non enregistrées */}
      {hasUnsavedChanges && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Vous avez des modifications non enregistrées. Utilisez le bouton d'enregistrement ci-dessous pour les sauvegarder.</span>
        </div>
      )}

      {/* Section Attestation de Conformité Fiscale */}
      <FiscalAttestationSection
        creationDate={creationDate}
        validityEndDate={validityEndDate}
        setCreationDate={(date) => {
          setCreationDate(date);
          setHasUnsavedChanges(true);
        }}
        setValidityEndDate={(date) => {
          setValidityEndDate(date);
          setHasUnsavedChanges(true);
        }}
        showInAlert={showInAlert}
        onToggleAlert={() => {
          setShowInAlert(!showInAlert);
          setHasUnsavedChanges(true);
        }}
        hiddenFromDashboard={hiddenFromDashboard}
        onToggleDashboardVisibility={(hidden) => {
          setHiddenFromDashboard(hidden);
          setHasUnsavedChanges(true);
        }}
      />

      {/* Section des Impôts Directs */}
      <DirectTaxesSection 
        obligationStatuses={obligationStatuses}
        handleStatusChange={handleStatusChange}
      />

      {/* Section des Déclarations */}
      <DeclarationsSection 
        fiscalYear={fiscalYear}
        hasUnsavedChanges={hasUnsavedChanges}
        setHasUnsavedChanges={setHasUnsavedChanges}
      />

      {/* Bouton d'enregistrement */}
      <div className="flex justify-end">
        <button 
          className={`px-4 py-2 rounded-md font-medium ${hasUnsavedChanges 
            ? 'bg-primary text-white hover:bg-primary-hover' 
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          disabled={!hasUnsavedChanges || isSaving}
          onClick={saveChanges}
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </div>
  );
};

export default ObligationsFiscales;
