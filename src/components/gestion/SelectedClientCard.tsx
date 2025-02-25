
import { Client } from "@/types/client";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SelectedClientCardProps {
  client: Client;
}

export function SelectedClientCard({ client }: SelectedClientCardProps) {
  return (
    <div className="mb-6">
      <Card className="bg-gradient-to-r from-[#F2FCE2] to-white border-[#A8C1AE] shadow-lg shadow-green-100/50">
        <CardHeader>
          <CardTitle className="text-[#1A1F2C]">
            {client.type === "physique" ? client.nom : client.raisonsociale}
          </CardTitle>
          <CardDescription className="text-[#8E9196]">
            NIU: {client.niu} | Centre: {client.centrerattachement}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
