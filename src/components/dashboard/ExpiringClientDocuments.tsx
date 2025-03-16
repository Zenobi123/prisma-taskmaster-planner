
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface ExpiringClient {
  id: string;
  name: string;
  document: string;
  expiryDate: string;
  daysRemaining: number;
}

interface ExpiringClientDocumentsProps {
  clients: ExpiringClient[];
}

const ExpiringClientDocuments = ({ clients }: ExpiringClientDocumentsProps) => {
  if (clients.length === 0) return null;
  
  return (
    <Card className="mt-6 border-2 border-red-200">
      <CardHeader className="pb-2 bg-red-50">
        <CardTitle className="text-lg flex items-center">
          <Users className="h-5 w-5 mr-2 text-red-500" />
          Clients avec documents expirant bientôt
        </CardTitle>
      </CardHeader>
      <CardContent>
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
              <TableRow key={index}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.document}</TableCell>
                <TableCell>{client.expiryDate}</TableCell>
                <TableCell>
                  {client.daysRemaining < 0 ? (
                    <span className="text-red-600 font-semibold">
                      Expiré depuis {Math.abs(client.daysRemaining)} jour{Math.abs(client.daysRemaining) > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className={
                      client.daysRemaining <= 5 
                        ? "text-red-600 font-semibold" 
                        : "text-amber-600 font-semibold"
                    }>
                      Expire dans {client.daysRemaining} jour{client.daysRemaining > 1 ? 's' : ''}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ExpiringClientDocuments;
