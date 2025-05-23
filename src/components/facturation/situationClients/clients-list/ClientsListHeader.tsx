
import { Search, Users } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ClientsListHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isMobile?: boolean;
}

const ClientsListHeader = ({ searchTerm, setSearchTerm, isMobile }: ClientsListHeaderProps) => {
  return (
    <CardHeader className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-between gap-3`}>
      <CardTitle className="text-xl flex items-center gap-2">
        <Users className="h-5 w-5" /> 
        Situation financière des clients
      </CardTitle>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Rechercher un client..."
          className="pl-8 w-full sm:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </CardHeader>
  );
};

export default ClientsListHeader;
