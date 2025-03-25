
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building, UserCheck } from "lucide-react";
import { formatMontant } from "@/utils/formatUtils";
import { PieChart as RechartsDonut, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { FacturePrestation } from "../types/DetailFactureTypes";

// Define chart colors
const COLORS = ['#84A98C', '#52796F', '#354F52', '#2F3E46', '#CAD2C5'];

interface RepartitionTabContentProps {
  totalImpots: number;
  totalHonoraires: number;
  totalMontant: number;
  prestations: FacturePrestation[];
}

export const RepartitionTabContent = ({ 
  totalImpots, 
  totalHonoraires, 
  totalMontant, 
  prestations 
}: RepartitionTabContentProps) => {
  // Prepare chart data
  const chartData = [
    { name: 'Impôts', value: totalImpots },
    { name: 'Honoraires', value: totalHonoraires }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Répartition des montants</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ChartContainer
            config={{
              impots: { label: "Impôts", color: "#84A98C" },
              honoraires: { label: "Honoraires", color: "#2F3E46" }
            }}
            className="h-[250px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsDonut>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
              </RechartsDonut>
            </ResponsiveContainer>
          </ChartContainer>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Total impôts</p>
              <p className="text-xl font-bold text-[#84A98C]">{formatMontant(totalImpots)}</p>
              <p className="text-xs text-gray-500">{Math.round((totalImpots / totalMontant) * 100)}% du total</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Total honoraires</p>
              <p className="text-xl font-bold text-[#2F3E46]">{formatMontant(totalHonoraires)}</p>
              <p className="text-xs text-gray-500">{Math.round((totalHonoraires / totalMontant) * 100)}% du total</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Détail par catégorie</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Building className="h-4 w-4 mr-2 text-[#84A98C]" />
                Impôts dus à l'administration fiscale
              </h3>
              <div className="space-y-2">
                {prestations.filter(p => p.type === "impots").length > 0 ? (
                  prestations
                    .filter(p => p.type === "impots")
                    .map(prestation => (
                      <div key={prestation.id} className="flex justify-between px-2 py-1 bg-gray-50 rounded">
                        <span className="text-sm">{prestation.description}</span>
                        <span className="text-sm font-medium">{formatMontant(prestation.montant)}</span>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-gray-500 italic">Aucun impôt sur cette facture</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <UserCheck className="h-4 w-4 mr-2 text-[#2F3E46]" />
                Honoraires du Cabinet
              </h3>
              <div className="space-y-2">
                {prestations.filter(p => p.type === "honoraires").length > 0 ? (
                  prestations
                    .filter(p => p.type === "honoraires")
                    .map(prestation => (
                      <div key={prestation.id} className="flex justify-between px-2 py-1 bg-gray-50 rounded">
                        <span className="text-sm">{prestation.description}</span>
                        <span className="text-sm font-medium">{formatMontant(prestation.montant)}</span>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-gray-500 italic">Aucun honoraire sur cette facture</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
