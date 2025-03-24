
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface ChartDataItem {
  name: string;
  total: number;
}

interface ClientsChartProps {
  chartData: ChartDataItem[];
}

const ClientsChart = ({ chartData }: ClientsChartProps) => {
  // Define a proper config object for the chart
  const chartConfig = {
    // Define colors for each status
    ajour: {
      label: "À jour",
      color: "#84A98C" // Green
    },
    partiel: {
      label: "Partiellement payé",
      color: "#F9CB40" // Amber
    },
    retard: {
      label: "En retard",
      color: "#E3625F" // Red
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des paiements</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px]" config={chartConfig}>
          {chartData.length > 0 ? (
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => [`${value} clients`, '']} />
              <Bar 
                dataKey="total" 
                fill="#84A98C"
                // Determine color based on status
                fillOpacity={0.8}
              />
            </BarChart>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Chargement des données...</p>
            </div>
          )}
        </ChartContainer>
        <div className="mt-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
              À jour
            </span>
            <span className="font-medium">
              {chartData.find(d => d.name === "À jour")?.total || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-amber-500 mr-2"></span>
              Partiellement payé
            </span>
            <span className="font-medium">
              {chartData.find(d => d.name === "Partiellement payé")?.total || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
              En retard
            </span>
            <span className="font-medium">
              {chartData.find(d => d.name === "En retard")?.total || 0}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientsChart;
