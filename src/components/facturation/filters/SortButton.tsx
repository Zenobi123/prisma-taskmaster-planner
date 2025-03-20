
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface SortButtonProps {
  sortKey: string;
  sortDirection: "asc" | "desc";
  onSort: (key: string) => void;
}

const SortButton = ({ sortKey, sortDirection, onSort }: SortButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1"
      onClick={() => onSort("date")}
    >
      <ArrowUpDown size={16} />
      {sortKey === "date" ? (
        <span>Date {sortDirection === "asc" ? "↑" : "↓"}</span>
      ) : (
        <span>Trier</span>
      )}
    </Button>
  );
};

export default SortButton;
