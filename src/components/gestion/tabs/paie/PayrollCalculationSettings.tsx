
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { calculationService } from "@/services/calculationService";

interface PayrollCalculationSettingsProps {
  onSave: () => void;
}

export function PayrollCalculationSettings({ onSave }: PayrollCalculationSettingsProps) {
  // Obtenir les taux par défaut depuis le service
  const employerRates = calculationService.getEmployerRates();
  const employeeRates = calculationService.getEmployeeRates();
  
  const [cnpsEmployeeRate, setCnpsEmployeeRate] = useState(employeeRates.cnpsRate);
  const [cnpsEmployerRate, setCnpsEmployerRate] = useState(employerRates.cnpsRate);
  const [cfcEmployeeRate, setCfcEmployeeRate] = useState(employeeRates.cfcRate);
  const [cfcEmployerRate, setCfcEmployerRate] = useState(employerRates.cfcRate);
  const [fneRate, setFneRate] = useState(employerRates.fneRate);
  const [cacRate, setCacRate] = useState(employeeRates.cacRate);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Paramètres de Calcul de Paie</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Charges salariales */}
          <div className="space-y-4">
            <h3 className="font-medium text-md">Charges salariales (employé)</h3>
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="cnps-rate-employee">Taux CNPS (%)</Label>
              <Input 
                id="cnps-rate-employee" 
                type="number" 
                value={cnpsEmployeeRate} 
                onChange={(e) => setCnpsEmployeeRate(parseFloat(e.target.value))} 
                step="0.1" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cfc-rate-employee">Taux CFC (%)</Label>
              <Input 
                id="cfc-rate-employee" 
                type="number" 
                value={cfcEmployeeRate} 
                onChange={(e) => setCfcEmployeeRate(parseFloat(e.target.value))} 
                step="0.1" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cac-rate">Taux CAC sur IRPP (%)</Label>
              <Input 
                id="cac-rate" 
                type="number" 
                value={cacRate} 
                onChange={(e) => setCacRate(parseFloat(e.target.value))} 
                step="0.1" 
              />
            </div>
            
            <div className="space-y-2">
              <Label>TDL (Taxe de Développement Local)</Label>
              <div className="text-xs text-muted-foreground">Appliquée selon barème (voir tableau)</div>
            </div>
            
            <div className="space-y-2">
              <Label>RAV (Redevance Audiovisuelle)</Label>
              <div className="text-xs text-muted-foreground">Appliquée selon barème (voir tableau)</div>
            </div>
          </div>
          
          {/* Charges patronales */}
          <div className="space-y-4">
            <h3 className="font-medium text-md">Charges patronales (employeur)</h3>
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="cnps-rate-employer">Taux CNPS total (%)</Label>
              <Input 
                id="cnps-rate-employer" 
                type="number" 
                value={cnpsEmployerRate} 
                onChange={(e) => setCnpsEmployerRate(parseFloat(e.target.value))} 
                step="0.1" 
              />
              <div className="text-xs text-muted-foreground">
                Inclut Pension Vieillesse, Prestations Familiales et Accidents de Travail
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fne-rate">Taux FNE (%)</Label>
              <Input 
                id="fne-rate" 
                type="number" 
                value={fneRate} 
                onChange={(e) => setFneRate(parseFloat(e.target.value))} 
                step="0.1" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cfc-rate-employer">Taux CFC (%)</Label>
              <Input 
                id="cfc-rate-employer" 
                type="number" 
                value={cfcEmployerRate} 
                onChange={(e) => setCfcEmployerRate(parseFloat(e.target.value))} 
                step="0.1" 
              />
            </div>
          </div>
        </div>
        
        <Button onClick={onSave} className="mt-4">
          Enregistrer les paramètres
        </Button>
        
        <div className="bg-muted p-4 rounded-md mt-4">
          <h4 className="font-medium mb-2">Information</h4>
          <p className="text-sm text-muted-foreground">
            Les paramètres de calcul sont appliqués automatiquement lors du traitement de la paie.
            Les barèmes TDL et RAV sont mis à jour selon la législation en vigueur.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
