
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { getClientsWithNonCompliantFiscalSituation } from "@/services/fiscal/nonCompliantFiscalService";

export const FanrH2StatsCard = () => {
  const { data: clientStats, isLoading: isClientStatsLoading } = useQuery({
    queryKey: ["fanr-h2-stats"],
    queryFn: async () => {
      // Get FANR H2 inscribed clients count
      const { data: allClients } = await supabase
        .from('clients')
        .select('*')
        .eq('statut', 'actif');
      
      const fanrH2Clients = allClients?.filter(client => client.inscriptionfanrharmony2 === true).length || 0;
      return { fanrH2Clients };
    },
    refetchInterval: 30000,
  });

  const { data: nonCompliantClients = [], isLoading: isLoadingNonCompliant } = useQuery({
    queryKey: ["clients-non-compliant-fiscal"],
    queryFn: getClientsWithNonCompliantFiscalSituation,
    refetchInterval: 30000,
  });

  if (isClientStatsLoading || isLoadingNonCompliant) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clients inscrits en FANR H2</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-4 w-20 mb-1" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Clients inscrits en FANR H2</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{clientStats?.fanrH2Clients || 0}</div>
        <p className="text-xs text-muted-foreground mb-2">Total</p>
        {nonCompliantClients.length > 0 && (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 text-xs">
            {nonCompliantClients.length} Situation Non Conforme
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};
