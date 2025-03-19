
import { ChartContainer } from "@/components/ui/chart";
import { BarChart } from "recharts";

interface ChartData {
  name: string;
  total: number;
}

interface SituationChartProps {
  chartData: ChartData[];
}

export const SituationChart = ({ chartData }: SituationChartProps) => {
  return (
    <ChartContainer config={{}} className="h-[300px]">
      <BarChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <rect x="0" y="0" width="100%" height="100%" fill="#f8f9fa" />
        <g className="recharts-layer recharts-cartesian-axis recharts-xAxis xAxis">
          <g className="recharts-cartesian-axis-ticks">
            {chartData.map((entry, index) => (
              <text
                key={`text-${index}`}
                x={index * 100 + 50}
                y={280}
                textAnchor="middle"
                fill="#666"
              >
                {entry.name}
              </text>
            ))}
          </g>
        </g>
        <g className="recharts-layer recharts-bar">
          {chartData.map((entry, index) => (
            <rect
              key={`bar-${index}`}
              x={index * 100 + 30}
              y={280 - entry.total * 40}
              width={40}
              height={entry.total * 40}
              fill={
                entry.name === "À jour" 
                  ? "#84A98C" 
                  : entry.name === "Partiellement payé" 
                    ? "#F9C74F" 
                    : "#E63946"
              }
            />
          ))}
        </g>
      </BarChart>
    </ChartContainer>
  );
};
