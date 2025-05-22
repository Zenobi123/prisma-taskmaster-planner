
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
  // État pour les obligations fiscales
  const [obligationStatuses, setObligationStatuses] = useState({
    igs: { assujetti: false, payee: false },
    patente: { assujetti: false, payee: false },
    licence: { assujetti: false, payee: false },
    bailCommercial: { assujetti: false, payee: false },
    precompteLoyer: { assujetti: false, payee: false },
    tpf: { assujetti: false, payee: false }
  });

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
      }
    } catch (error) {
      console.error("Erreur lors du calcul de la date de fin de validité:", error);
    }
  }, [creationDate]);

  // Marquer comme ayant des modifications non enregistrées lorsque les valeurs changent
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [creationDate, validityEndDate, showInAlert, hiddenFromDashboard, obligationStatuses]);

  // Fonction pour sauvegarder les modifications
  const saveChanges = async () => {
    try {
      // Simuler une sauvegarde avec Supabase (à implémenter avec une vraie logique)
      // Cette partie serait remplacée par un appel API réel
      const { error } = await supabase
        .from("clients")
        .update({
          fiscal_data: {
            ...selectedClient.fiscal_data,
            attestation: {
              creationDate,
              validityEndDate,
              showInAlert,
              hiddenFromDashboard
            },
            obligations: obligationStatuses
          }
        })
        .eq("id", selectedClient.id);

      if (error) throw error;
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const handleFiscalYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiscalYear(e.target.value);
  };

  // Gestion des changements d'état d'assujettissement et de paiement
  const handleStatusChange = (taxType: string, field: string, value: boolean) => {
    setObligationStatuses(prev => {
      const taxKey = taxType === 'bail-commercial' 
        ? 'bailCommercial' 
        : taxType === 'precompte-loyer' 
          ? 'precompteLoyer' 
          : taxType;

      if (field === "assujetti" && !value) {
        // Si on désactive l'assujettissement, on désactive aussi le paiement
        return {
          ...prev,
          [taxKey]: { ...prev[taxKey as keyof typeof prev], assujetti: value, payee: false }
        };
      }

      return {
        ...prev,
        [taxKey]: { ...prev[taxKey as keyof typeof prev], [field]: value }
      };
    });
  };

  // Fonction pour vérifier si un impôt est déclaratif
  const isDeclarationObligation = (obligation: string): boolean => {
    return ["licence", "bail-commercial", "precompte-loyer"].includes(obligation);
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
        setCreationDate={setCreationDate}
        setValidityEndDate={setValidityEndDate}
        showInAlert={showInAlert}
        onToggleAlert={() => setShowInAlert(!showInAlert)}
        hiddenFromDashboard={hiddenFromDashboard}
        onToggleDashboardVisibility={() => setHiddenFromDashboard(!hiddenFromDashboard)}
      />

      {/* Section des Impôts Directs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Impôts directs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* IGS */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <span className="font-medium text-gray-800">Impôt Général Synthétique (IGS)</span>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-3 md:mt-0">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="igs-assujetti"
                    checked={obligationStatuses.igs.assujetti}
                    onCheckedChange={(checked) => handleStatusChange('igs', 'assujetti', checked)}
                  />
                  <Label htmlFor="igs-assujetti">
                    {obligationStatuses.igs.assujetti ? "Assujetti" : "Non assujetti"}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="igs-paye"
                    checked={obligationStatuses.igs.payee}
                    onCheckedChange={(checked) => handleStatusChange('igs', 'payee', checked)}
                    disabled={!obligationStatuses.igs.assujetti}
                  />
                  <Label htmlFor="igs-paye">
                    {obligationStatuses.igs.payee ? "Payé" : "Non payé"}
                  </Label>
                </div>
                
                {obligationStatuses.igs.assujetti && obligationStatuses.igs.payee && (
                  <button 
                    className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Voir détails
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Patente */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <span className="font-medium text-gray-800">Patente</span>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-3 md:mt-0">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="patente-assujetti"
                    checked={obligationStatuses.patente.assujetti}
                    onCheckedChange={(checked) => handleStatusChange('patente', 'assujetti', checked)}
                  />
                  <Label htmlFor="patente-assujetti">
                    {obligationStatuses.patente.assujetti ? "Assujetti" : "Non assujetti"}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="patente-paye"
                    checked={obligationStatuses.patente.payee}
                    onCheckedChange={(checked) => handleStatusChange('patente', 'payee', checked)}
                    disabled={!obligationStatuses.patente.assujetti}
                  />
                  <Label htmlFor="patente-paye">
                    {obligationStatuses.patente.payee ? "Payé" : "Non payé"}
                  </Label>
                </div>
                
                {obligationStatuses.patente.assujetti && obligationStatuses.patente.payee && (
                  <button 
                    className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Voir détails
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Licence */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <span className="font-medium text-gray-800">Licence</span>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-3 md:mt-0">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="licence-assujetti"
                    checked={obligationStatuses.licence.assujetti}
                    onCheckedChange={(checked) => handleStatusChange('licence', 'assujetti', checked)}
                  />
                  <Label htmlFor="licence-assujetti">
                    {obligationStatuses.licence.assujetti ? "Assujetti" : "Non assujetti"}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="licence-paye"
                    checked={obligationStatuses.licence.payee}
                    onCheckedChange={(checked) => handleStatusChange('licence', 'payee', checked)}
                    disabled={!obligationStatuses.licence.assujetti}
                  />
                  <Label htmlFor="licence-paye">
                    {obligationStatuses.licence.payee ? "Payé" : "Non payé"}
                  </Label>
                </div>
                
                {obligationStatuses.licence.assujetti && obligationStatuses.licence.payee && (
                  <button 
                    className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Voir détails
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Bail Commercial */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <span className="font-medium text-gray-800">Bail Commercial</span>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-3 md:mt-0">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="bail-commercial-assujetti"
                    checked={obligationStatuses.bailCommercial.assujetti}
                    onCheckedChange={(checked) => handleStatusChange('bail-commercial', 'assujetti', checked)}
                  />
                  <Label htmlFor="bail-commercial-assujetti">
                    {obligationStatuses.bailCommercial.assujetti ? "Assujetti" : "Non assujetti"}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="bail-commercial-paye"
                    checked={obligationStatuses.bailCommercial.payee}
                    onCheckedChange={(checked) => handleStatusChange('bail-commercial', 'payee', checked)}
                    disabled={!obligationStatuses.bailCommercial.assujetti}
                  />
                  <Label htmlFor="bail-commercial-paye">
                    {obligationStatuses.bailCommercial.payee ? "Payé" : "Non payé"}
                  </Label>
                </div>
                
                {obligationStatuses.bailCommercial.assujetti && obligationStatuses.bailCommercial.payee && (
                  <button 
                    className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Voir détails
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Précompte sur Loyer */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <span className="font-medium text-gray-800">Précompte sur Loyer</span>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-3 md:mt-0">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="precompte-loyer-assujetti"
                    checked={obligationStatuses.precompteLoyer.assujetti}
                    onCheckedChange={(checked) => handleStatusChange('precompte-loyer', 'assujetti', checked)}
                  />
                  <Label htmlFor="precompte-loyer-assujetti">
                    {obligationStatuses.precompteLoyer.assujetti ? "Assujetti" : "Non assujetti"}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="precompte-loyer-paye"
                    checked={obligationStatuses.precompteLoyer.payee}
                    onCheckedChange={(checked) => handleStatusChange('precompte-loyer', 'payee', checked)}
                    disabled={!obligationStatuses.precompteLoyer.assujetti}
                  />
                  <Label htmlFor="precompte-loyer-paye">
                    {obligationStatuses.precompteLoyer.payee ? "Payé" : "Non payé"}
                  </Label>
                </div>
                
                {obligationStatuses.precompteLoyer.assujetti && obligationStatuses.precompteLoyer.payee && (
                  <button 
                    className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Voir détails
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Taxe sur la propriété (TPF) */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <span className="font-medium text-gray-800">Taxe sur la propriété (TPF)</span>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-3 md:mt-0">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="tpf-assujetti"
                    checked={obligationStatuses.tpf.assujetti}
                    onCheckedChange={(checked) => handleStatusChange('tpf', 'assujetti', checked)}
                  />
                  <Label htmlFor="tpf-assujetti">
                    {obligationStatuses.tpf.assujetti ? "Assujetti" : "Non assujetti"}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="tpf-paye"
                    checked={obligationStatuses.tpf.payee}
                    onCheckedChange={(checked) => handleStatusChange('tpf', 'payee', checked)}
                    disabled={!obligationStatuses.tpf.assujetti}
                  />
                  <Label htmlFor="tpf-paye">
                    {obligationStatuses.tpf.payee ? "Payé" : "Non payé"}
                  </Label>
                </div>
                
                {obligationStatuses.tpf.assujetti && obligationStatuses.tpf.payee && (
                  <button 
                    className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Voir détails
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bouton d'enregistrement */}
      <div className="flex justify-end">
        <button 
          className={`px-4 py-2 rounded-md font-medium ${hasUnsavedChanges 
            ? 'bg-primary text-white hover:bg-primary-hover' 
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          disabled={!hasUnsavedChanges}
          onClick={saveChanges}
        >
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
};

export default ObligationsFiscales;
