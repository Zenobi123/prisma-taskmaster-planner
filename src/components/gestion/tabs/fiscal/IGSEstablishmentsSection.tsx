import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Establishment, IGSData } from "./types";
import { PlusCircle, Trash2, Building } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { v4 as uuidv4 } from "uuid";
import { formatNumberWithSeparator } from "@/utils/formatUtils";

interface IGSEstablishmentsProps {
  igsData: IGSData | undefined;
  onIGSDataChange: (data: IGSData) => void;
  assujetti: boolean;
}

// IGS Class calculation based on the table
const calculateIGSClass = (revenue: number): { classNumber: number; amount: number } => {
  if (revenue < 500000) return { classNumber: 1, amount: 20000 };
  if (revenue < 1000000) return { classNumber: 2, amount: 30000 };
  if (revenue < 1500000) return { classNumber: 3, amount: 40000 };
  if (revenue < 2000000) return { classNumber: 4, amount: 50000 };
  if (revenue < 2500000) return { classNumber: 5, amount: 60000 };
  if (revenue < 5000000) return { classNumber: 6, amount: 150000 };
  if (revenue < 10000000) return { classNumber: 7, amount: 300000 };
  if (revenue < 20000000) return { classNumber: 8, amount: 500000 };
  if (revenue < 30000000) return { classNumber: 9, amount: 1000000 };
  if (revenue < 50000000) return { classNumber: 10, amount: 2000000 };
  return { classNumber: 10, amount: 2000000 }; // Default to highest class
};

export function IGSEstablishmentsSection({ igsData, onIGSDataChange, assujetti }: IGSEstablishmentsProps) {
  // Safely handle undefined assujetti value
  const isAssujetti = assujetti === true;
  
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [igsClass, setIgsClass] = useState(0);
  const [igsAmount, setIgsAmount] = useState(0);
  const [cgaReduction, setCgaReduction] = useState(false);

  // Initialize with default establishment if none exists
  useEffect(() => {
    if (igsData) {
      setEstablishments(igsData.establishments || []);
      setCgaReduction(igsData.cgaReduction || false);
    } else if (establishments.length === 0) {
      // Add a default establishment
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

  // Calculate total revenue, IGS class and amount
  useEffect(() => {
    const total = establishments.reduce((sum, est) => sum + (est.revenue || 0), 0);
    setTotalRevenue(total);
    
    const { classNumber, amount } = calculateIGSClass(total);
    setIgsClass(classNumber);
    
    // Apply CGA reduction if applicable
    const finalAmount = cgaReduction ? amount * 0.5 : amount;
    setIgsAmount(finalAmount);
    
    // Update parent component
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
    if (establishments.length <= 1) {
      return; // Keep at least one establishment
    }
    setEstablishments(establishments.filter(est => est.id !== id));
  };

  const handleEstablishmentChange = (id: string, field: keyof Establishment, value: string | number) => {
    setEstablishments(establishments.map(est => 
      est.id === id ? { ...est, [field]: value } : est
    ));
  };

  const handleCgaReductionChange = (checked: boolean) => {
    setCgaReduction(checked);
  };

  if (!isAssujetti) {
    return null; // Don't render if not assujetti
  }

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
            <Card key={establishment.id} className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-gray-500" />
                    <h4 className="font-medium">{index === 0 ? "Établissement principal" : `Établissement ${index + 1}`}</h4>
                  </div>
                  {index > 0 && (
                    <Button 
                      onClick={() => handleRemoveEstablishment(establishment.id)} 
                      variant="ghost" 
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`est-name-${establishment.id}`}>Nom commercial</Label>
                    <Input 
                      id={`est-name-${establishment.id}`}
                      value={establishment.name}
                      onChange={(e) => handleEstablishmentChange(establishment.id, "name", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`est-activity-${establishment.id}`}>Activité</Label>
                    <Input 
                      id={`est-activity-${establishment.id}`}
                      value={establishment.activity}
                      onChange={(e) => handleEstablishmentChange(establishment.id, "activity", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`est-city-${establishment.id}`}>Ville</Label>
                    <Input 
                      id={`est-city-${establishment.id}`}
                      value={establishment.city}
                      onChange={(e) => handleEstablishmentChange(establishment.id, "city", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`est-department-${establishment.id}`}>Département</Label>
                    <Input 
                      id={`est-department-${establishment.id}`}
                      value={establishment.department}
                      onChange={(e) => handleEstablishmentChange(establishment.id, "department", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`est-district-${establishment.id}`}>Quartier</Label>
                    <Input 
                      id={`est-district-${establishment.id}`}
                      value={establishment.district}
                      onChange={(e) => handleEstablishmentChange(establishment.id, "district", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`est-revenue-${establishment.id}`}>Chiffre d'affaires HT</Label>
                    <Input 
                      id={`est-revenue-${establishment.id}`}
                      type="number"
                      value={establishment.revenue || ""}
                      onChange={(e) => handleEstablishmentChange(establishment.id, "revenue", Number(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* IGS Summary */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="pt-6">
              <h4 className="font-medium mb-4">Récapitulatif IGS</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Chiffre d'affaires total (année précédente):</span>
                  <span className="font-medium">{formatNumberWithSeparator(totalRevenue)} FCFA</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Classe IGS:</span>
                  <span className="font-medium">{igsClass}</span>
                </div>
                
                <div className="flex items-center space-x-2 py-2">
                  <Switch
                    id="cga-reduction"
                    checked={cgaReduction}
                    onCheckedChange={handleCgaReductionChange}
                  />
                  <Label htmlFor="cga-reduction">
                    Adhérent au Centre de Gestion Agréé (-50%)
                  </Label>
                </div>
                
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-semibold">Montant IGS à payer:</span>
                  <span className="font-semibold text-primary">{formatNumberWithSeparator(igsAmount)} FCFA</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
