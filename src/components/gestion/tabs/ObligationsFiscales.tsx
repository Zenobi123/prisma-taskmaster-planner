
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { FiscalAttestationSection } from "./fiscal/FiscalAttestationSection";
import { IGSStatusSection } from "./fiscal/IGSStatusSection";
import { DeclarationObligationItem } from "./fiscal/DeclarationObligationItem";
import { TaxObligationItem } from "./fiscal/TaxObligationItem";
import { AnnualObligationsSection } from "./fiscal/AnnualObligationsSection";
import { useObligationsFiscales } from "@/hooks/fiscal/useObligationsFiscales";
import { Client } from "@/types/client";

interface ObligationsFiscalesProps {
  selectedClient: Client;
}

export const ObligationsFiscales = ({ selectedClient }: ObligationsFiscalesProps) => {
  const {
    creationDate,
    setCreationDate,
    validityEndDate,
    setValidityEndDate,
    obligationStatuses,
    handleStatusChange,
    handleSave,
    isLoading,
    showInAlert,
    handleToggleAlert,
    hiddenFromDashboard,
    handleToggleDashboardVisibility,
    igsData,
    handleIGSChange
  } = useObligationsFiscales(selectedClient);

  return (
    <div className="space-y-6">
      <IGSStatusSection
        soumisIGS={igsData.soumisIGS}
        adherentCGA={igsData.adherentCGA}
        classeIGS={igsData.classeIGS}
        patente={igsData.patente}
        acompteJanvier={igsData.acompteJanvier}
        acompteFevrier={igsData.acompteFevrier}
        chiffreAffairesAnnuel={igsData.chiffreAffairesAnnuel}
        etablissements={igsData.etablissements}
        onChange={handleIGSChange}
      />

      <FiscalAttestationSection
        creationDate={creationDate}
        validityEndDate={validityEndDate}
        setCreationDate={setCreationDate}
        setValidityEndDate={setValidityEndDate}
        handleSave={handleSave}
        showInAlert={showInAlert}
        onToggleAlert={handleToggleAlert}
        hiddenFromDashboard={hiddenFromDashboard}
        onToggleDashboardVisibility={handleToggleDashboardVisibility}
      />

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Obligations mensuelles</h3>

          <div className="space-y-4">
            <TaxObligationItem
              id="tva"
              title="TVA"
              status={obligationStatuses.tva}
              onStatusChange={(status) => handleStatusChange('tva', status)}
              tooltip={selectedClient.regimefiscal === "reel" ? "Obligatoire pour les contribuables du régime du réel" : undefined}
            />

            <Separator />

            <TaxObligationItem
              id="cnps"
              title="CNPS"
              status={obligationStatuses.cnps}
              onStatusChange={(status) => handleStatusChange('cnps', status)}
            />
          </div>
        </CardContent>
      </Card>

      <AnnualObligationsSection 
        obligationStatuses={obligationStatuses}
        handleStatusChange={handleStatusChange}
        regimeFiscal={selectedClient.regimefiscal}
      />

      {/* Bouton d'enregistrement repositionné à la fin de la page */}
      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleSave}
          disabled={isLoading}
          className="w-full md:w-auto"
        >
          {isLoading ? "Enregistrement..." : "Enregistrer toutes les modifications"}
        </Button>
      </div>
    </div>
  );
};
