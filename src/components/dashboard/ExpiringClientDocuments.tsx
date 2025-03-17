
import { FileWarning } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ExpiringClient } from "@/hooks/useExpiringClients";
import { Badge } from "@/components/ui/badge";

interface ExpiringClientDocumentsProps {
  clients: ExpiringClient[];
}

const ExpiringClientDocuments = ({ clients }: ExpiringClientDocumentsProps) => {
  console.log("Rendering ExpiringClientDocuments with clients:", clients);
  
  return (
    <Card className="mb-6 border-orange-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <FileWarning className="h-5 w-5 mr-2 text-orange-500" />
          Documents clients à renouveler
        </CardTitle>
      </CardHeader>
      <CardContent>
        {clients && clients.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Date d'expiration</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client, index) => (
                <TableRow key={index} className={client.daysRemaining < 0 ? "bg-red-50" : ""}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.document}</TableCell>
                  <TableCell>{client.expiryDate}</TableCell>
                  <TableCell>
                    {client.daysRemaining < 0 ? (
                      <Badge variant="destructive" className="font-semibold">
                        Expiré depuis {Math.abs(client.daysRemaining)} jour{Math.abs(client.daysRemaining) > 1 ? 's' : ''}
                      </Badge>
                    ) : (
                      <Badge variant={client.daysRemaining <= 5 ? "outline" : "secondary"} className="font-semibold">
                        Expire dans {client.daysRemaining} jour{client.daysRemaining > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 text-neutral-500">
            Aucun document client à renouveler
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpiringClientDocuments;
