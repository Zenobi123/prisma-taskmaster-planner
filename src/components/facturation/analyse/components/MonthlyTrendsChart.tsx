
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { formatMontant } from "@/utils/formatUtils";
import { MonthlyChartItem } from "../types/AnalyseTypes";

interface MonthlyTrendsChartProps {
  monthlyData: MonthlyChartItem[];
}

export const MonthlyTrendsChart = ({ monthlyData }: MonthlyTrendsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Évolution sur les derniers mois</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ChartContainer
          config={{
            facturé: { label: "Montant facturé", color: "#84A98C" },
            encaissé: { label: "Montant encaissé", color: "#60A5FA" }
          }}
          className="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => 
                  new Intl.NumberFormat('fr-FR', { 
                    notation: 'compact',
                    compactDisplay: 'short',
                    maximumFractionDigits: 0
                  }).format(Number(value))
                } 
              />
              <Tooltip content={<ChartTooltipContent formatter={(value) => formatMontant(Number(value))} />} />
              <Legend />
              <Bar dataKey="facturé" fill="#84A98C" />
              <Bar dataKey="encaissé" fill="#60A5FA" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
