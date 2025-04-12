
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { MonthlySummary } from "./fiscal/MonthlySummary";
import { FiscalAttestationSection } from "./fiscal/FiscalAttestationSection";
import { IGSStatusSection } from "./fiscal/IGSStatusSection";

import { useObligationsFiscales } from "@/hooks/fiscal/useObligationsFiscales";
import { DeclarationObligationItem } from "./fiscal/DeclarationObligationItem";
import { TaxObligationItem } from "./fiscal/TaxObligationItem";
import { AnnualObligationsSection } from "./fiscal/AnnualObligationsSection";

const ObligationsFiscales = () => {
  const {
    // IGS State
    soumisIGS,
    classeIGS,
    adherentCGA,
    setIfSoumisIGS,
    setClasseIGS,
    setIfAdherentCGA,
    igsPayments,
    setIGSPayment,
    
    // Fiscal attestations
    fiscalAttestations,
    setFiscalAttestationIssueDate,
    setFiscalAttestationNumber,
    
    // Monthly obligations
    tva,
    tvaDate,
    tvaNumber,
    tvaQuittance,
    setTVA,
    setTVADate,
    setTVANumber,
    setTVAQuittance,
    
    patente,
    patenteDate,
    patenteNumber,
    patenteQuittance,
    setPatente,
    setPatenteDate,
    setPatenteNumber,
    setPatenteQuittance,
    
    cnps,
    cnpsDate,
    cnpsNumber,
    cnpsQuittance,
    setCNPS,
    setCNPSDate,
    setCNPSNumber,
    setCNPSQuittance,
  } = useObligationsFiscales();

  return (
    <div className="space-y-6">
      <IGSStatusSection
        soumisIGS={soumisIGS}
        classeIGS={classeIGS}
        adherentCGA={adherentCGA}
        onChangeSoumisIGS={(checked: boolean) => setIfSoumisIGS(checked)}
        onChangeClasseIGS={setClasseIGS}
        onChangeAdherentCGA={(checked: boolean) => setIfAdherentCGA(checked)}
        igsPayments={igsPayments}
        onChangeIGSPayment={setIGSPayment}
      />

      <FiscalAttestationSection
        attestations={fiscalAttestations}
        onChangeIssueDate={setFiscalAttestationIssueDate}
        onChangeNumber={setFiscalAttestationNumber}
      />

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Obligations mensuelles</h3>

          <div className="space-y-4">
            <TaxObligationItem
              label="TVA"
              isActive={tva}
              date={tvaDate}
              number={tvaNumber}
              quittance={tvaQuittance}
              onChangeActive={setTVA}
              onChangeDate={setTVADate}
              onChangeNumber={setTVANumber}
              onChangeQuittance={setTVAQuittance}
            />

            <Separator />

            <TaxObligationItem
              label="Patente"
              isActive={patente}
              date={patenteDate}
              number={patenteNumber}
              quittance={patenteQuittance}
              onChangeActive={setPatente}
              onChangeDate={setPatenteDate}
              onChangeNumber={setPatenteNumber}
              onChangeQuittance={setPatenteQuittance}
            />

            <Separator />

            <TaxObligationItem
              label="CNPS"
              isActive={cnps}
              date={cnpsDate}
              number={cnpsNumber}
              quittance={cnpsQuittance}
              onChangeActive={setCNPS}
              onChangeDate={setCNPSDate}
              onChangeNumber={setCNPSNumber}
              onChangeQuittance={setCNPSQuittance}
            />
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50">
          <Button className="ml-auto">Enregistrer les modifications</Button>
        </CardFooter>
      </Card>

      <AnnualObligationsSection />
    </div>
  );
};

export default ObligationsFiscales;
