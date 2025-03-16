
import { FileWarning } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ExpiringClient } from "@/hooks/useExpiringClients";

interface ExpiringClientDocumentsProps {
  clients: ExpiringClient[];
}

const ExpiringClientDocuments = ({ clients }: ExpiringClientDocumentsProps) => {
  return (
    <Card className="mb-6 border-orange-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <FileWarning className="h-5 w-5 mr-2 text-orange-500" />
          Documents clients expirant bientôt
        </CardTitle>
      </CardHeader>
      <CardContent>
        {clients.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Date d'expiration</TableHead>
                <TableHead>Jours restants</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.document}</TableCell>
                  <TableCell>{client.expiryDate}</TableCell>
                  <TableCell>
                    <span className={
                      client.daysRemaining <= 2 
                        ? "text-red-600 font-semibold" 
                        : client.daysRemaining <= 5 
                          ? "text-amber-600 font-semibold" 
                          : "text-blue-600"
                    }>
                      {client.daysRemaining} jour{client.daysRemaining > 1 ? 's' : ''}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 text-neutral-500">
            Aucun document client n'expire bientôt
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpiringClientDocuments;
