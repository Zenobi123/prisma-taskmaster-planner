
import { Facture } from "@/types/facture";

interface ClientDateInfoProps {
  clientName: string;
  clientAddress?: string;
  date: string;
  echeance: string;
}

export const ClientDateInfo = ({ 
  clientName, 
  clientAddress, 
  date, 
  echeance 
}: ClientDateInfoProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-neutral-500">Client</h3>
        <p className="font-medium">{clientName}</p>
        {clientAddress && (
          <p className="text-sm text-neutral-600">{clientAddress}</p>
        )}
      </div>
      <div className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-neutral-500">Date d'émission</h3>
          <p>{date}</p>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-neutral-500">Échéance</h3>
          <p>{echeance}</p>
        </div>
      </div>
    </div>
  );
};
