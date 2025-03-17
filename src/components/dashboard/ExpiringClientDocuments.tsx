
import { FileWarning, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ExpiringClient } from "@/hooks/useExpiringClients";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ExpiringClientDocumentsProps {
  clients: ExpiringClient[];
}

const ExpiringClientDocuments = ({ clients }: ExpiringClientDocumentsProps) => {
  console.log("Rendering ExpiringClientDocuments with clients:", clients);
  const navigate = useNavigate();
  
  const handleNavigateToFiscal = (clientId: string) => {
    navigate(`/gestion?client=${clientId}&tab=obligations-fiscales`);
  };
  
  const getStatusBadge = (daysRemaining: number) => {
    if (daysRemaining < 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3.5 w-3.5" />
          <span>Expirée depuis {Math.abs(daysRemaining)} jours</span>
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Expire dans {daysRemaining} jours</span>
        </Badge>
      );
    }
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
                  <TableCell className="hidden sm:table-cell">
                    {getStatusBadge(client.daysRemaining)}
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
            <FileWarning className="h-10 w-10 mx-auto text-orange-500 mb-2" />
            <p className="text-gray-700 font-medium mb-2">
              Aucun document client à renouveler n'a été trouvé
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Les attestations de conformité fiscale doivent être configurées dans l'onglet "Obligations fiscales" de chaque client.
            </p>
            <Button 
              variant="outline"
              onClick={() => navigate('/gestion')}
              className="bg-white hover:bg-gray-100"
            >
              Configurer les attestations fiscales
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpiringClientDocuments;
