
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export interface ChartData {
  name: string;
  value: number;
  total: number;
  color: string;
}

interface SituationChartProps {
  data: ChartData[];
}

export const SituationChart = ({ data }: SituationChartProps) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number, name: string, entry: { payload: ChartData }) => [
              `${value.toLocaleString('fr-FR')} XAF (${Math.round(value / entry.payload.total * 100)}%)`,
              name
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
