
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnpaidPatente } from "@/services/fiscal/unpaidPatenteService";
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
    // Configurer le rafraîchissement automatique
    refetchInterval: 60000,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true
  });


  const handleNavigateToClient = (clientId: string) => {
    navigate(`/gestion?client=${clientId}&tab=obligations-fiscales`);
  };

  if (isLoading) {
    return (
      <Card className="border-[3px] border-red-400 shadow-md animate-pulse">
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg flex items-center">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-red-500 shrink-0" />
            <span className="hidden sm:inline">Liste des patentes impayées</span>
            <span className="sm:hidden">Patentes impayées</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-100 rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  // Si nous avons des clients et qu'ils ne sont pas affichés, ajoutons plus de visibilité

  return (
    <Card className="border-[3px] border-red-400 shadow-lg overflow-visible">
      <CardHeader className="pb-2 bg-red-50 px-3 sm:px-6">
        <CardTitle className="text-base sm:text-lg flex items-center">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-red-500 shrink-0" />
          <span className="hidden sm:inline">Liste des patentes impayées ({clients.length})</span>
          <span className="sm:hidden">Patentes impayées ({clients.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        {clients && clients.length > 0 ? (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
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

            {/* Mobile card list */}
            <div className="sm:hidden space-y-2">
              {clients.map((client) => (
                <div key={client.id} className="border rounded-lg p-3 hover:bg-red-50/50">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="font-medium text-sm leading-tight">
                      {client.type === "physique" ? client.nom : client.raisonsociale}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs shrink-0 border-red-300 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleNavigateToClient(client.id)}
                    >
                      Gérer
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                    <span>NIU: {client.niu}</span>
                    {client.centrerattachement && <span>{client.centrerattachement}</span>}
                    {client.contact?.telephone && <span>{client.contact.telephone}</span>}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-8 text-center border-2 border-red-200 rounded-md bg-red-50">
            <FileWarning className="h-12 w-12 mx-auto text-red-500 mb-3" />
            <p className="text-gray-700 font-medium text-lg mb-2">
              Aucun client avec patente impayée
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Tous les clients assujettis à la patente sont à jour avec leurs paiements.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnpaidPatenteList;
