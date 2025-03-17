
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnfiledDsf } from "@/services/unfiledDsfService";
import { FileText, FileWarning, Phone, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const UnfiledDsfList = () => {
  const navigate = useNavigate();
  
  const { data: clients = [], isLoading, isFetched, error } = useQuery({
    queryKey: ["clients-unfiled-dsf"],
    queryFn: getClientsWithUnfiledDsf,
    // Configurer le rafraîchissement automatique
    refetchInterval: 10000,
    refetchOnWindowFocus: true
  });

  console.log("UnfiledDsfList - Clients:", clients);
  console.log("UnfiledDsfList - Clients length:", clients.length);
  console.log("UnfiledDsfList - isLoading:", isLoading);
  console.log("UnfiledDsfList - isFetched:", isFetched);
  console.log("UnfiledDsfList - error:", error);
  console.log("UnfiledDsfList - Le composant est bien rendu");

  const handleNavigateToClient = (clientId: string) => {
    navigate(`/gestion?client=${clientId}&tab=obligations-fiscales`);
  };

  if (isLoading) {
    return (
      <Card className="border-[3px] border-blue-400 shadow-md animate-pulse">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-500" />
            Liste des DSF non déposées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-100 rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[3px] border-blue-400 shadow-lg overflow-visible">
      <CardHeader className="pb-2 bg-blue-50">
        <CardTitle className="text-lg flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-500" />
          Liste des DSF non déposées ({clients.length})
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
                  <TableRow key={client.id} className="hover:bg-blue-50">
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
                        className="border-blue-300 hover:bg-blue-50 hover:text-blue-700"
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
          <div className="py-8 text-center border-2 border-blue-200 rounded-md bg-blue-50">
            <FileWarning className="h-12 w-12 mx-auto text-blue-500 mb-3" />
            <p className="text-gray-700 font-medium text-lg mb-2">
              Aucun client avec DSF non déposée
            </p>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Tous les clients assujettis à la DSF sont à jour avec leurs déclarations.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnfiledDsfList;
