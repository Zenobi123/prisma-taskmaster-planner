
import { Client } from "@/types/client";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SelectedClientCardProps {
  client: Client;
}

export function SelectedClientCard({ client }: SelectedClientCardProps) {
  return (
    <div className="mb-6">
      <Card className="bg-neutral-50">
        <CardHeader>
          <CardTitle>
            {client.type === "physique" ? client.nom : client.raisonsociale}
          </CardTitle>
          <CardDescription>
            NIU: {client.niu} | Centre: {client.centrerattachement}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
