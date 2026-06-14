// Définitions de tables Supabase absentes des types générés (src/integrations/supabase/types.ts)
// mais bien présentes en base. Permet d'utiliser le client typé sans `as any`.
// À fusionner dans le type Database (voir client.ts). Régénérer types.ts rendra
// les entrées correspondantes inutiles.

export type ExtraTables = {
  rapports_mission: {
    Row: {
      id: string;
      task_id: string;
      file_format: string;
      contenu_parse: string | null;
      file_path: string | null;
      statut: string;
      rapport_superviseur_id: string | null;
      rapport_client_id: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      task_id: string;
      file_format?: string;
      contenu_parse?: string | null;
      file_path?: string | null;
      statut?: string;
      rapport_superviseur_id?: string | null;
      rapport_client_id?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      task_id?: string;
      file_format?: string;
      contenu_parse?: string | null;
      file_path?: string | null;
      statut?: string;
      rapport_superviseur_id?: string | null;
      rapport_client_id?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Relationships: [
      {
        foreignKeyName: "rapports_mission_task_id_fkey";
        columns: ["task_id"];
        isOneToOne: false;
        referencedRelation: "tasks";
        referencedColumns: ["id"];
      },
    ];
  };
};
