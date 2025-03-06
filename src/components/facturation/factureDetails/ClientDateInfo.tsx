
import { Facture } from "@/types/facture";

interface ClientDateInfoProps {
  selectedFacture: Facture;
}

export const ClientDateInfo = ({ selectedFacture }: ClientDateInfoProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-neutral-500">Client</h3>
        <p className="font-medium">{selectedFacture.client.nom}</p>
        {selectedFacture.client.adresse && (
          <p className="text-sm text-neutral-600">{selectedFacture.client.adresse}</p>
        )}
      </div>
      <div className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-neutral-500">Date d'émission</h3>
          <p>{selectedFacture.date}</p>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-neutral-500">Échéance</h3>
          <p>{selectedFacture.echeance}</p>
        </div>
      </div>
    </div>
  );
};
