
import { useFacturationPermissions } from "@/hooks/useFacturationPermissions";
import { FacturationTabs } from "@/components/facturation/FacturationTabs";

const Facturation = () => {
  // Hook pour les permissions
  const { hasPermission, isLoading: permissionsLoading } = useFacturationPermissions();

  // État de chargement
  if (permissionsLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Facturation</h1>
      <FacturationTabs />
    </div>
  );
};

export default Facturation;
