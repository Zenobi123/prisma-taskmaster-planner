
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChartDataItem {
  name: string;
  total: number;
}

interface ClientsChartProps {
  chartData: ChartDataItem[];
}

const ClientsChart = ({ chartData }: ClientsChartProps) => {
  const isMobile = useIsMobile();
  
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

  const getBarColor = (entry: any) => {
    if (entry.name === "À jour") return "#84A98C";
    if (entry.name === "Partiellement payé") return "#F9CB40";
    if (entry.name === "En retard") return "#E3625F";
    return "#84A98C";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Répartition des paiements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`h-[300px] w-full ${isMobile ? 'px-0' : ''}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ 
                top: 10, 
                right: isMobile ? 10 : 30, 
                left: isMobile ? 0 : 0, 
                bottom: isMobile ? 30 : 20 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: isMobile ? 10 : 12 }}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={isMobile ? 60 : 30}
              />
              <YAxis 
                allowDecimals={false} 
                tick={{ fontSize: isMobile ? 10 : 12 }}
                width={isMobile ? 25 : 30}
              />
              <Tooltip 
                formatter={(value) => [`${value} clients`, '']}
                contentStyle={{ fontSize: isMobile ? '12px' : '14px' }}
              />
              <Bar 
                dataKey="total" 
                fillOpacity={0.8}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
              <span className={isMobile ? "text-sm" : ""}>À jour</span>
            </span>
            <span className="font-medium">
              {chartData.find(d => d.name === "À jour")?.total || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-amber-500 mr-2"></span>
              <span className={isMobile ? "text-sm" : ""}>Partiellement payé</span>
            </span>
            <span className="font-medium">
              {chartData.find(d => d.name === "Partiellement payé")?.total || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
              <span className={isMobile ? "text-sm" : ""}>En retard</span>
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
