
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { ChartDataItem } from "../types/AnalyseTypes";

interface StatusDistributionChartProps {
  chartData: ChartDataItem[];
}

export const StatusDistributionChart = ({ chartData }: StatusDistributionChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Répartition des factures par statut</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ChartContainer
          config={{
            payées: { label: "Payées", color: "#84A98C" },
            partiellementPayées: { label: "Partiellement payées", color: "#F59E0B" },
            nonPayées: { label: "Non payées", color: "#6B7280" },
            enRetard: { label: "En retard", color: "#EF4444" }
          }}
          className="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 12 }}
                width={150}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="value" 
                fill="#84A98C" 
                radius={[0, 4, 4, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
