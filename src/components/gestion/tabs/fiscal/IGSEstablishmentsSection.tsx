
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Establishment, IGSData } from "@/hooks/fiscal/types/igsTypes";
import { v4 as uuidv4 } from "uuid";
import { EstablishmentForm } from "./components/EstablishmentForm";
import { IGSSummary } from "./components/IGSSummary";
import { calculateIGSClass } from "./utils/igsCalculations";

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
  const isAssujetti = assujetti === true;
  
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [igsClass, setIgsClass] = useState(0);
  const [igsAmount, setIgsAmount] = useState(0);
  const [cgaReduction, setCgaReduction] = useState(false);

  useEffect(() => {
    if (igsData) {
      setEstablishments(igsData.establishments || []);
      setCgaReduction(igsData.cgaReduction || false);
    } else if (establishments.length === 0) {
      const defaultEstablishment: Establishment = {
        id: uuidv4(),
        name: "Établissement principal",
        activity: "",
        city: "",
        department: "",
        district: "",
        revenue: 0
      };
      setEstablishments([defaultEstablishment]);
    }
  }, [igsData]);

  useEffect(() => {
    const total = establishments.reduce((sum, est) => sum + (est.revenue || 0), 0);
    setTotalRevenue(total);
    
    const { classNumber, amount } = calculateIGSClass(total);
    setIgsClass(classNumber);
    
    const finalAmount = cgaReduction ? amount * 0.5 : amount;
    setIgsAmount(finalAmount);
    
    onIGSDataChange({
      establishments,
      previousYearRevenue: total,
      igsClass: classNumber,
      igsAmount: finalAmount,
      cgaReduction
    });
  }, [establishments, cgaReduction]);

  const handleAddEstablishment = () => {
    const newEstablishment: Establishment = {
      id: uuidv4(),
      name: `Établissement ${establishments.length + 1}`,
      activity: "",
      city: "",
      department: "",
      district: "",
      revenue: 0
    };
    setEstablishments([...establishments, newEstablishment]);
  };

  const handleRemoveEstablishment = (id: string) => {
    if (establishments.length <= 1) return;
    setEstablishments(establishments.filter(est => est.id !== id));
  };

  const handleEstablishmentChange = (id: string, field: keyof Establishment, value: string | number) => {
    setEstablishments(establishments.map(est => 
      est.id === id ? { ...est, [field]: value } : est
    ));
  };

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
          />
        </div>
      </CardContent>
    </Card>
  );
}
