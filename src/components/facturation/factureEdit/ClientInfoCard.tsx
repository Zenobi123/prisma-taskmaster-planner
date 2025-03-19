
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Facture } from "@/types/facture";

interface ClientInfoCardProps {
  facture: Facture;
}

export const ClientInfoCard = ({ facture }: ClientInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-1">Nom</p>
            <p>{facture.client_nom}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Email</p>
            <p>{facture.client_email}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Téléphone</p>
            <p>{facture.client_telephone}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Adresse</p>
            <p>{facture.client_adresse}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
