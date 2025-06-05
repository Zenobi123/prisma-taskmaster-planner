
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getClientsNotInFanrH2 } from "@/services/fanrH2Service";

export const FanrH2Section = () => {
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ["clients-not-fanr-h2"],
    queryFn: getClientsNotInFanrH2,
    refetchInterval: 10000,
    refetchOnWindowFocus: true
  });

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-600">Erreur lors du chargement des clients non inscrits FANR H2</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-800">
          Clients non inscrits en FANR Harmony2
        </h3>
        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
          {clients.length} client{clients.length > 1 ? 's' : ''}
        </Badge>
      </div>

      {clients.length === 0 ? (
        <Card>
          <CardContent className="p-4">
            <p className="text-neutral-600 text-center">
              Tous les clients actifs sont inscrits en FANR Harmony2
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {clients.map((client: any) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-neutral-800">
                      {client.nom || client.raisonsociale}
                    </h4>
                    <p className="text-sm text-neutral-600">
                      NIU: {client.niu}
                    </p>
                    <p className="text-sm text-neutral-600">
                      Centre: {client.centrerattachement}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                    Non inscrit
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
