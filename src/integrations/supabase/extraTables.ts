// Définitions de tables Supabase absentes des types générés (src/integrations/supabase/types.ts)
// mais bien présentes en base. Permet d'utiliser le client typé sans `as any`.
// À fusionner dans le type Database (voir client.ts). Régénérer types.ts rendra
// ce fichier inutile mais il restera compatible.

export type ExtraTables = {
  facture_prestations: {
    Row: {
      id: string;
      facture_id: string;
      description: string;
      type: string;
      quantite: number;
      prix_unitaire: number;
      montant: number;
      created_at: string | null;
      updated_at: string | null;
    };
    Insert: {
      id: string;
      facture_id: string;
      description: string;
      type?: string;
      quantite?: number;
      prix_unitaire?: number;
      montant?: number;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Update: {
      id?: string;
      facture_id?: string;
      description?: string;
      type?: string;
      quantite?: number;
      prix_unitaire?: number;
      montant?: number;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "facture_prestations_facture_id_fkey";
        columns: ["facture_id"];
        isOneToOne: false;
        referencedRelation: "factures";
        referencedColumns: ["id"];
      },
    ];
  };
  devis: {
    Row: {
      id: string;
      numero: string;
      client_id: string;
      date: string;
      date_validite: string | null;
      objet: string | null;
      status: string;
      montant_total: number;
      notes: string | null;
      facture_id: string | null;
      created_at: string | null;
      updated_at: string | null;
    };
    Insert: {
      id: string;
      numero: string;
      client_id: string;
      date: string;
      date_validite?: string | null;
      objet?: string | null;
      status?: string;
      montant_total?: number;
      notes?: string | null;
      facture_id?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Update: {
      id?: string;
      numero?: string;
      client_id?: string;
      date?: string;
      date_validite?: string | null;
      objet?: string | null;
      status?: string;
      montant_total?: number;
      notes?: string | null;
      facture_id?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "devis_client_id_fkey";
        columns: ["client_id"];
        isOneToOne: false;
        referencedRelation: "clients";
        referencedColumns: ["id"];
      },
    ];
  };
  devis_prestations: {
    Row: {
      id: string;
      devis_id: string;
      description: string;
      type: string;
      quantite: number;
      prix_unitaire: number;
      montant: number;
      created_at: string | null;
      updated_at: string | null;
    };
    Insert: {
      id: string;
      devis_id: string;
      description: string;
      type?: string;
      quantite?: number;
      prix_unitaire?: number;
      montant?: number;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Update: {
      id?: string;
      devis_id?: string;
      description?: string;
      type?: string;
      quantite?: number;
      prix_unitaire?: number;
      montant?: number;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "devis_prestations_devis_id_fkey";
        columns: ["devis_id"];
        isOneToOne: false;
        referencedRelation: "devis";
        referencedColumns: ["id"];
      },
    ];
  };
  propositions: {
    Row: {
      id: string;
      numero: string;
      client_id: string;
      date: string;
      date_manuelle: boolean;
      source_type: string | null;
      source_id: string | null;
      source_numero: string | null;
      lignes: Json;
      total: number;
      total_impots: number;
      total_honoraires: number;
      status: string;
      notes: string | null;
      created_at: string | null;
      updated_at: string | null;
    };
    Insert: {
      id: string;
      numero: string;
      client_id: string;
      date: string;
      date_manuelle?: boolean;
      source_type?: string | null;
      source_id?: string | null;
      source_numero?: string | null;
      lignes: Json;
      total?: number;
      total_impots?: number;
      total_honoraires?: number;
      status?: string;
      notes?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Update: {
      id?: string;
      numero?: string;
      client_id?: string;
      date?: string;
      date_manuelle?: boolean;
      source_type?: string | null;
      source_id?: string | null;
      source_numero?: string | null;
      lignes?: Json;
      total?: number;
      total_impots?: number;
      total_honoraires?: number;
      status?: string;
      notes?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "propositions_client_id_fkey";
        columns: ["client_id"];
        isOneToOne: false;
        referencedRelation: "clients";
        referencedColumns: ["id"];
      },
    ];
  };
  courriers: {
    Row: {
      id: string;
      reference: string;
      client_id: string | null;
      client_nom: string | null;
      template_id: string | null;
      template_titre: string | null;
      sujet: string | null;
      contenu: string | null;
      message_personnalise: string | null;
      statut: string;
      mode_envoi: string | null;
      date_creation: string;
      date_envoi: string | null;
      task_id: string | null;
      mission_doc_type: string | null;
      created_at: string | null;
      updated_at: string | null;
    };
    Insert: {
      id?: string;
      reference: string;
      client_id?: string | null;
      client_nom?: string | null;
      template_id?: string | null;
      template_titre?: string | null;
      sujet?: string | null;
      contenu?: string | null;
      message_personnalise?: string | null;
      statut?: string;
      mode_envoi?: string | null;
      date_creation?: string;
      date_envoi?: string | null;
      task_id?: string | null;
      mission_doc_type?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Update: {
      id?: string;
      reference?: string;
      client_id?: string | null;
      client_nom?: string | null;
      template_id?: string | null;
      template_titre?: string | null;
      sujet?: string | null;
      contenu?: string | null;
      message_personnalise?: string | null;
      statut?: string;
      mode_envoi?: string | null;
      date_creation?: string;
      date_envoi?: string | null;
      task_id?: string | null;
      mission_doc_type?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Relationships: [];
  };
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

// Réexport local de Json pour éviter une dépendance circulaire de types.
type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
