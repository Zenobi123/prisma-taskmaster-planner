
import { FileWarning } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ExpiringClient } from "@/hooks/useExpiringClients";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ExpiringClientDocumentsProps {
  clients: ExpiringClient[];
}

const ExpiringClientDocuments = ({ clients }: ExpiringClientDocumentsProps) => {
  console.log("Rendering ExpiringClientDocuments with clients:", clients);
  const navigate = useNavigate();
  
  const handleNavigateToFiscal = (clientId: string) => {
    navigate(`/gestion?client=${clientId}&tab=fiscal`);
  };
  
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
                <TableHead className="hidden sm:table-cell">Statut</TableHead>
                <TableHead className="hidden sm:table-cell">Date d'expiration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client, index) => (
                <TableRow key={index} className={client.daysRemaining < 0 ? "bg-red-50" : ""}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">
                    {client.daysRemaining < 0 
                      ? <span className="text-red-600">Expiré {Math.abs(client.daysRemaining)} jours</span>
                      : <span className="text-orange-500">Expire dans {client.daysRemaining} jours</span>
                    }
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">
                    {client.expiryDate}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleNavigateToFiscal(client.id)}
                    >
                      Gérer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-6 text-center border rounded-md bg-gray-50">
            <FileWarning className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground mb-4">
              Aucun document client à renouveler n'a été trouvé
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Les attestations de conformité fiscale doivent être configurées dans l'onglet "Obligations fiscales" de chaque client.
            </p>
            <Button 
              variant="outline"
              onClick={() => navigate('/gestion')}
            >
              Accéder à la gestion des clients
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpiringClientDocuments;
