
interface LegendItem {
  label: string;
  count: number;
  color: string;
}

interface StatusLegendProps {
  items: LegendItem[];
}

export const StatusLegend = ({ items }: StatusLegendProps) => {
  return (
    <div className="mt-6 space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between items-center">
          <span className="flex items-center">
            <span 
              className="h-3 w-3 rounded-full mr-2" 
              style={{ backgroundColor: item.color }}
            ></span>
            {item.label}
          </span>
          <span className="font-medium">{item.count}</span>
        </div>
      ))}
    </div>
  );
};
