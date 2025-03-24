
import { Badge } from "@/components/ui/badge";
import { UserCheck, CalendarClock } from "lucide-react";

interface FactureHeaderProps {
  id: string;
  client: string;
  date: string;
  status_paiement: string;
}

export const FactureHeader = ({ id, client, date, status_paiement }: FactureHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start mb-4">
      <div>
        <h2 className="text-2xl font-bold mb-1">{id}</h2>
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <UserCheck className="h-4 w-4" />
          <span>{client}</span>
          <CalendarClock className="h-4 w-4 ml-2" />
          <span>Émise le {date}</span>
        </div>
      </div>
      <Badge 
        className={`
          ${status_paiement === 'payée' ? 'bg-green-500' : 
            status_paiement === 'partiellement_payée' ? 'bg-orange-500' : 
            status_paiement === 'en_retard' ? 'bg-red-500' : 
            'bg-gray-500'}
        `}
      >
        {status_paiement === 'non_payée' ? 'Non payée' :
          status_paiement === 'partiellement_payée' ? 'Partiellement payée' :
          status_paiement === 'en_retard' ? 'En retard' :
          'Payée'}
      </Badge>
    </div>
  );
};
