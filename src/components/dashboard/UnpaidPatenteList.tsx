
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnpaidPatente } from "@/services/unpaidPatenteService";
import { AlertTriangle, FileWarning, Phone, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const UnpaidPatenteList = () => {
  const navigate = useNavigate();
  
  const { data: clients = [], isLoading, isFetched, error } = useQuery({
    queryKey: ["clients-unpaid-patente"],
    queryFn: getClientsWithUnpaidPatente,
  });

  console.log("UnpaidPatenteList - Clients:", clients);
  console.log("UnpaidPatenteList - Clients length:", clients.length);
  console.log("UnpaidPatenteList - isLoading:", isLoading);
  console.log("UnpaidPatenteList - isFetched:", isFetched);
  console.log("UnpaidPatenteList - error:", error);
  console.log("UnpaidPatenteList - Le composant est bien rendu");

  const handleNavigateToClient = (clientId: string) => {
    navigate(`/gestion?client=${clientId}&tab=obligations-fiscales`);
  };

  if (isLoading) {
    return (
      <Card className="border-[3px] border-red-400 shadow-md animate-pulse">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
            Liste des patentes impayées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-100 rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  // Si nous avons des clients et qu'ils ne sont pas affichés, ajoutons plus de visibilité
  console.log("UnpaidPatenteList - Clients à afficher:", clients.length > 0 ? "OUI" : "NON");

  return (
    <Card className="border-[3px] border-red-400 shadow-lg overflow-visible">
      <CardHeader className="pb-2 bg-red-50">
        <CardTitle className="text-lg flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
          Liste des patentes impayées ({clients.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {clients && clients.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>NIU</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      <span>Centre des impôts</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>Contact</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-red-50">
                    <TableCell className="font-medium">
                      {client.type === "physique" ? client.nom : client.raisonsociale}
                    </TableCell>
                    <TableCell>{client.niu}</TableCell>
                    <TableCell>{client.centrerattachement}</TableCell>
                    <TableCell>{client.contact.telephone}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleNavigateToClient(client.id)}
                        className="border-red-300 hover:bg-red-50 hover:text-red-700"
                      >
                        Gérer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-8 text-center border-2 border-red-200 rounded-md bg-red-50">
            <FileWarning className="h-12 w-12 mx-auto text-red-500 mb-3" />
            <p className="text-gray-700 font-medium text-lg mb-2">
              Aucun client avec patente impayée
            </p>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Tous les clients assujettis à la patente sont à jour avec leurs paiements.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnpaidPatenteList;
