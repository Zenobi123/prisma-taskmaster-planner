
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Facture } from "@/types/facture";

interface FactureClientInfoProps {
  facture: Facture;
}

export function FactureClientInfo({ facture }: FactureClientInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations client</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Client</p>
          <p className="mt-1 font-medium">{facture.client.nom}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Adresse</p>
          <p className="mt-1">{facture.client.adresse}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Téléphone</p>
            <p className="mt-1">{facture.client.telephone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="mt-1">{facture.client.email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
