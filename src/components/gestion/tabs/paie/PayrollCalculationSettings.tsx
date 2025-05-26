
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator, Save } from "lucide-react";

export interface PayrollCalculationSettingsProps {
  onSave: () => void;
  cnpsEmployeeRate?: number;
  cnpsEmployerRate?: number;
  cfcEmployeeRate?: number;
  cfcEmployerRate?: number;
  fneRate?: number;
  cacRate?: number;
}

export function PayrollCalculationSettings({
  onSave,
  cnpsEmployeeRate = 2.8,
  cnpsEmployerRate = 12.95,
  cfcEmployeeRate = 1,
  cfcEmployerRate = 1.5,
  fneRate = 1,
  cacRate = 10
}: PayrollCalculationSettingsProps) {
  const [rates, setRates] = useState({
    cnpsEmployee: cnpsEmployeeRate,
    cnpsEmployer: cnpsEmployerRate,
    cfcEmployee: cfcEmployeeRate,
    cfcEmployer: cfcEmployerRate,
    fne: fneRate,
    cac: cacRate
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRates(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Paramètres de calcul</CardTitle>
        <CardDescription>
          Configuration des taux de cotisations sociales et fiscales
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Charges salariales (employé)</h3>
              
              <div className="space-y-1">
                <Label htmlFor="cnpsEmployee">CNPS (Pension vieillesse) %</Label>
                <div className="flex items-center">
                  <Input
                    id="cnpsEmployee"
                    name="cnpsEmployee"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={rates.cnpsEmployee}
                    onChange={handleChange}
                    className="max-w-[120px]"
                  />
                  <span className="ml-2 text-sm">%</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="cfcEmployee">CFC (Crédit foncier) %</Label>
                <div className="flex items-center">
                  <Input
                    id="cfcEmployee"
                    name="cfcEmployee"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={rates.cfcEmployee}
                    onChange={handleChange}
                    className="max-w-[120px]"
                  />
                  <span className="ml-2 text-sm">%</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="cac">CAC (sur IRPP) %</Label>
                <div className="flex items-center">
                  <Input
                    id="cac"
                    name="cac"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={rates.cac}
                    onChange={handleChange}
                    className="max-w-[120px]"
                  />
                  <span className="ml-2 text-sm">%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Charges patronales (employeur)</h3>
              
              <div className="space-y-1">
                <Label htmlFor="cnpsEmployer">CNPS (Total) %</Label>
                <div className="flex items-center">
                  <Input
                    id="cnpsEmployer"
                    name="cnpsEmployer"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={rates.cnpsEmployer}
                    onChange={handleChange}
                    className="max-w-[120px]"
                  />
                  <span className="ml-2 text-sm">%</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="fne">FNE %</Label>
                <div className="flex items-center">
                  <Input
                    id="fne"
                    name="fne"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={rates.fne}
                    onChange={handleChange}
                    className="max-w-[120px]"
                  />
                  <span className="ml-2 text-sm">%</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="cfcEmployer">CFC %</Label>
                <div className="flex items-center">
                  <Input
                    id="cfcEmployer"
                    name="cfcEmployer"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={rates.cfcEmployer}
                    onChange={handleChange}
                    className="max-w-[120px]"
                  />
                  <span className="ml-2 text-sm">%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" className="flex items-center">
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
