
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collaborateur } from "@/types/collaborateur";

interface CollaboratorFilterProps {
  collaborateurs?: Collaborateur[];
  value: string;
  onChange: (value: string) => void;
}

export const CollaboratorFilter = ({ collaborateurs, value, onChange }: CollaboratorFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filtrer par collaborateur" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tous les collaborateurs</SelectItem>
        {collaborateurs?.map((collaborateur: any) => (
          <SelectItem 
            key={collaborateur.id} 
            value={`${collaborateur.prenom} ${collaborateur.nom}`}
          >
            {collaborateur.prenom} {collaborateur.nom}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
