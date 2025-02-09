
import { Client } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPinIcon } from "lucide-react";

interface AddressCardProps {
  client: Client;
}

export function AddressCard({ client }: AddressCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-5 h-5 text-muted-foreground" />
          <CardTitle className="text-lg font-semibold">Adresse</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Ville</p>
            <p className="font-medium">{client.adresse?.ville}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Quartier</p>
            <p className="font-medium">{client.adresse?.quartier}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Lieu-dit</p>
            <p className="font-medium">{client.adresse?.lieuDit || "-"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
