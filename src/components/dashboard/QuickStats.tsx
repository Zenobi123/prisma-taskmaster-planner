import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Calendar, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const QuickStats = () => {
  const isMobile = useIsMobile();

  // Data fetching queries
  const { data: expiringFiscalAttestations } = useQuery({
    queryKey: ["expiring-fiscal-attestations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fiscal_attestations")
        .select("id, expiration_date")
        .lt("expiration_date", new Date().toISOString());

      if (error) throw error;

      return data?.length || 0;
    }
  });

  const { data: clientsUnpaidPatenteSummary } = useQuery({
    queryKey: ["clients-unpaid-patente-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id")
        .eq("patente_a_jour", false)
        .is("deleted_at", null);

      if (error) throw error;

      return data?.length || 0;
    }
  });

  const { data: clientsUnfiledDsfSummary } = useQuery({
    queryKey: ["clients-unfiled-dsf-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id")
        .eq("dsf_a_jour", false)
        .is("deleted_at", null);

      if (error) throw error;

      return data?.length || 0;
    }
  });

  const { data: clientStats } = useQuery({
    queryKey: ["client-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, statut")
        .is("deleted_at", null);

      if (error) throw error;

      const total = data.length;
      const actifs = data.filter(client => client.statut === "actif").length;

      return { total, actifs };
    }
  });

  const { data: taskStats } = useQuery({
    queryKey: ["task-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, status");

      if (error) throw error;

      const total = data.length;
      const enCours = data.filter(task => task.status === "en_cours").length;
      const enRetard = data.filter(task => task.status === "en_retard").length;

      return { total, enCours, enRetard };
    }
  });

  const stats = [
    {
      title: "Clients totaux",
      value: clientStats?.total || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Clients actifs",
      value: clientStats?.actifs || 0,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Missions en cours",
      value: taskStats?.enCours || 0,
      icon: FileText,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Missions en retard",
      value: taskStats?.enRetard || 0,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  return (
    <div className={`grid gap-4 ${
      isMobile 
        ? 'grid-cols-2' 
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    }`}>
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${
              isMobile ? 'pb-2' : 'pb-2'
            }`}>
              <CardTitle className={`font-medium ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <IconComponent className={`${stat.color} ${
                  isMobile ? 'h-3 w-3' : 'h-4 w-4'
                }`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`font-bold ${
                isMobile ? 'text-xl' : 'text-2xl'
              }`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickStats;
