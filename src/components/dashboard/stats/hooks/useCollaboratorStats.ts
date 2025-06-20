
import { useMemo } from "react";

export const useCollaboratorStats = (tasks: any[], collaborateurs: any[], isLoading: boolean) => {
  return useMemo(() => {
    if (isLoading || !tasks || !collaborateurs) {
      return 0;
    }

    const collaborateurTaskCount = new Map();
    
    tasks.forEach((task: any) => {
      if (task.status === "en_cours" && task.collaborateur_id) {
        const collaborateurId = task.collaborateur_id;
        const currentCount = collaborateurTaskCount.get(collaborateurId) || 0;
        collaborateurTaskCount.set(collaborateurId, currentCount + 1);
      }
    });
    
    const activeCollaborateurs = collaborateurs.filter(collab => collab.statut === "actif");
    
    return activeCollaborateurs.filter(collab => 
      collaborateurTaskCount.has(collab.id) && collaborateurTaskCount.get(collab.id) > 0
    ).length;
  }, [tasks, collaborateurs, isLoading]);
};
