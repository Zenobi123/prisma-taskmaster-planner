
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { IGSData } from "@/hooks/fiscal/types/igsTypes";
import { EstablishmentForm } from "./components/EstablishmentForm";
import { IGSSummary } from "./components/IGSSummary";
import { useIGSEstablishments } from "@/hooks/fiscal/hooks/useIGSEstablishments";

interface IGSEstablishmentsProps {
  igsData: IGSData | undefined;
  onIGSDataChange: (data: IGSData) => void;
  assujetti: boolean;
}

export function IGSEstablishmentsSection({
  igsData,
  onIGSDataChange,
  assujetti
}: IGSEstablishmentsProps) {
  const {
    establishments,
    totalRevenue,
    igsClass,
    igsAmount,
    cgaReduction,
    quarterlyPayments,
    setCgaReduction,
    handleAddEstablishment,
    handleRemoveEstablishment,
    handleEstablishmentChange,
    handlePaymentStatusChange,
    isAssujetti
  } = useIGSEstablishments({ 
    igsData, 
    onIGSDataChange, 
    assujetti 
  });

  if (!isAssujetti) return null;

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Établissements pour IGS</h3>
            <Button 
              onClick={handleAddEstablishment} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Ajouter un établissement
            </Button>
          </div>
          
          {establishments.map((establishment, index) => (
            <EstablishmentForm
              key={establishment.id}
              establishment={establishment}
              index={index}
              onRemove={handleRemoveEstablishment}
              onChange={handleEstablishmentChange}
            />
          ))}
          
          <IGSSummary
            totalRevenue={totalRevenue}
            igsClass={igsClass}
            igsAmount={igsAmount}
            cgaReduction={cgaReduction}
            onCgaReductionChange={setCgaReduction}
            quarterlyPayments={quarterlyPayments}
            onPaymentStatusChange={handlePaymentStatusChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
