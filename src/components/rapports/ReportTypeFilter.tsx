
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportTypeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const ReportTypeFilter = ({ value, onChange }: ReportTypeFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Type de rapport" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tous les types</SelectItem>
        <SelectItem value="activite">Activité</SelectItem>
        <SelectItem value="financier">Financier</SelectItem>
        <SelectItem value="temps">Temps</SelectItem>
        <SelectItem value="clients">Clients</SelectItem>
      </SelectContent>
    </Select>
  );
};
