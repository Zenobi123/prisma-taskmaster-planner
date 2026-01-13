export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      actionnaires: {
        Row: {
          client_id: string
          created_at: string
          date_naissance: string | null
          id: string
          lieu_habitation: string | null
          nom: string
          nombre_actions_parts: number
          pourcentage: number
          prenom: string | null
          updated_at: string
          valeur_capital: number
        }
        Insert: {
          client_id: string
          created_at?: string
          date_naissance?: string | null
          id?: string
          lieu_habitation?: string | null
          nom: string
          nombre_actions_parts?: number
          pourcentage?: number
          prenom?: string | null
          updated_at?: string
          valeur_capital?: number
        }
        Update: {
          client_id?: string
          created_at?: string
          date_naissance?: string | null
          id?: string
          lieu_habitation?: string | null
          nom?: string
          nombre_actions_parts?: number
          pourcentage?: number
          prenom?: string | null
          updated_at?: string
          valeur_capital?: number
        }
        Relationships: [
          {
            foreignKeyName: "actionnaires_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      capital_social: {
        Row: {
          client_id: string
          created_at: string
          id: string
          montant_capital: number
          nombre_actions_parts: number | null
          type_capital: string | null
          updated_at: string
          valeur_action_part: number | null
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          montant_capital?: number
          nombre_actions_parts?: number | null
          type_capital?: string | null
          updated_at?: string
          valeur_action_part?: number | null
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          montant_capital?: number
          nombre_actions_parts?: number | null
          type_capital?: string | null
          updated_at?: string
          valeur_action_part?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "capital_social_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          adresse: Json
          centrerattachement: string
          contact: Json
          created_at: string
          datecreation: string | null
          deleted_at: string | null
          etatcivil: string | null
          fiscal_data: Json | null
          formejuridique: string | null
          gestionexternalisee: boolean | null
          id: string
          inscriptionfanrharmony2: boolean | null
          interactions: Json | null
          lieucreation: string | null
          niu: string
          nom: string | null
          nomcommercial: string | null
          nomdirigeant: string | null
          numerocnps: string | null
          numerorccm: string | null
          raisonsociale: string | null
          regimefiscal: string
          secteuractivite: string
          sexe: string | null
          sigle: string | null
          situationimmobiliere: Json | null
          statut: string
          type: string
        }
        Insert: {
          adresse: Json
          centrerattachement: string
          contact: Json
          created_at?: string
          datecreation?: string | null
          deleted_at?: string | null
          etatcivil?: string | null
          fiscal_data?: Json | null
          formejuridique?: string | null
          gestionexternalisee?: boolean | null
          id?: string
          inscriptionfanrharmony2?: boolean | null
          interactions?: Json | null
          lieucreation?: string | null
          niu: string
          nom?: string | null
          nomcommercial?: string | null
          nomdirigeant?: string | null
          numerocnps?: string | null
          numerorccm?: string | null
          raisonsociale?: string | null
          regimefiscal?: string
          secteuractivite: string
          sexe?: string | null
          sigle?: string | null
          situationimmobiliere?: Json | null
          statut?: string
          type: string
        }
        Update: {
          adresse?: Json
          centrerattachement?: string
          contact?: Json
          created_at?: string
          datecreation?: string | null
          deleted_at?: string | null
          etatcivil?: string | null
          fiscal_data?: Json | null
          formejuridique?: string | null
          gestionexternalisee?: boolean | null
          id?: string
          inscriptionfanrharmony2?: boolean | null
          interactions?: Json | null
          lieucreation?: string | null
          niu?: string
          nom?: string | null
          nomcommercial?: string | null
          nomdirigeant?: string | null
          numerocnps?: string | null
          numerorccm?: string | null
          raisonsociale?: string | null
          regimefiscal?: string
          secteuractivite?: string
          sexe?: string | null
          sigle?: string | null
          situationimmobiliere?: Json | null
          statut?: string
          type?: string
        }
        Relationships: []
      }
      collaborateurs: {
        Row: {
          created_at: string
          dateentree: string
          datenaissance: string
          email: string
          id: string
          niveauetude: string
          nom: string
          permissions: Json | null
          poste: string
          prenom: string
          quartier: string
          statut: string
          tachesencours: number | null
          telephone: string
          user_id: string | null
          ville: string
        }
        Insert: {
          created_at?: string
          dateentree: string
          datenaissance: string
          email: string
          id?: string
          niveauetude: string
          nom: string
          permissions?: Json | null
          poste: string
          prenom: string
          quartier: string
          statut?: string
          tachesencours?: number | null
          telephone: string
          user_id?: string | null
          ville: string
        }
        Update: {
          created_at?: string
          dateentree?: string
          datenaissance?: string
          email?: string
          id?: string
          niveauetude?: string
          nom?: string
          permissions?: Json | null
          poste?: string
          prenom?: string
          quartier?: string
          statut?: string
          tachesencours?: number | null
          telephone?: string
          user_id?: string | null
          ville?: string
        }
        Relationships: []
      }
      conges: {
        Row: {
          created_at: string
          date_debut: string
          date_fin: string
          duree_jours: number
          employe_id: string
          id: string
          motif: string | null
          statut: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_debut: string
          date_fin: string
          duree_jours: number
          employe_id: string
          id?: string
          motif?: string | null
          statut?: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_debut?: string
          date_fin?: string
          duree_jours?: number
          employe_id?: string
          id?: string
          motif?: string | null
          statut?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conges_employe_id_fkey"
            columns: ["employe_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
        ]
      }
      contrats_employes: {
        Row: {
          created_at: string
          date_debut: string
          date_fin: string | null
          details: Json | null
          employe_id: string
          fichier_url: string | null
          id: string
          statut: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_debut: string
          date_fin?: string | null
          details?: Json | null
          employe_id: string
          fichier_url?: string | null
          id?: string
          statut?: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_debut?: string
          date_fin?: string | null
          details?: Json | null
          employe_id?: string
          fichier_url?: string | null
          id?: string
          statut?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contrats_employes_employe_id_fkey"
            columns: ["employe_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
        ]
      }
      documents_administratifs: {
        Row: {
          client_id: string
          created_at: string
          date_creation: string
          date_expiration: string | null
          description: string | null
          fichier_url: string | null
          id: string
          nom: string
          statut: string
          type: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          date_creation?: string
          date_expiration?: string | null
          description?: string | null
          fichier_url?: string | null
          id?: string
          nom: string
          statut?: string
          type: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          date_creation?: string
          date_expiration?: string | null
          description?: string | null
          fichier_url?: string | null
          id?: string
          nom?: string
          statut?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_administratifs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      employes: {
        Row: {
          adresse: string | null
          banque: string | null
          client_id: string
          created_at: string
          date_embauche: string
          date_naissance: string | null
          departement: string | null
          email: string | null
          genre: string | null
          id: string
          nom: string
          numero_cnps: string | null
          numero_compte: string | null
          poste: string
          prenom: string
          salaire_base: number
          statut: string
          telephone: string | null
          type_contrat: string | null
          updated_at: string
        }
        Insert: {
          adresse?: string | null
          banque?: string | null
          client_id: string
          created_at?: string
          date_embauche: string
          date_naissance?: string | null
          departement?: string | null
          email?: string | null
          genre?: string | null
          id?: string
          nom: string
          numero_cnps?: string | null
          numero_compte?: string | null
          poste: string
          prenom: string
          salaire_base: number
          statut?: string
          telephone?: string | null
          type_contrat?: string | null
          updated_at?: string
        }
        Update: {
          adresse?: string | null
          banque?: string | null
          client_id?: string
          created_at?: string
          date_embauche?: string
          date_naissance?: string | null
          departement?: string | null
          email?: string | null
          genre?: string | null
          id?: string
          nom?: string
          numero_cnps?: string | null
          numero_compte?: string | null
          poste?: string
          prenom?: string
          salaire_base?: number
          statut?: string
          telephone?: string | null
          type_contrat?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      factures: {
        Row: {
          client_id: string
          created_at: string | null
          date: string
          echeance: string
          id: string
          mode_paiement: string
          montant: number
          montant_paye: number | null
          notes: string | null
          status: string
          status_paiement: string
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          date?: string
          echeance: string
          id: string
          mode_paiement?: string
          montant?: number
          montant_paye?: number | null
          notes?: string | null
          status?: string
          status_paiement?: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          date?: string
          echeance?: string
          id?: string
          mode_paiement?: string
          montant?: number
          montant_paye?: number | null
          notes?: string | null
          status?: string
          status_paiement?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "factures_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      fiscal_obligations: {
        Row: {
          client_id: string
          created_at: string
          date_depot: string | null
          date_echeance: string | null
          date_paiement: string | null
          depose: boolean
          id: string
          montant: number | null
          observations: string | null
          paye: boolean
          periode: string
          type_obligation: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          date_depot?: string | null
          date_echeance?: string | null
          date_paiement?: string | null
          depose?: boolean
          id?: string
          montant?: number | null
          observations?: string | null
          paye?: boolean
          periode: string
          type_obligation: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          date_depot?: string | null
          date_echeance?: string | null
          date_paiement?: string | null
          depose?: boolean
          id?: string
          montant?: number | null
          observations?: string | null
          paye?: boolean
          periode?: string
          type_obligation?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fiscal_obligations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      paie: {
        Row: {
          annee: number
          autres_retenues: Json | null
          cac: number | null
          cfc: number | null
          cnps_employe: number | null
          cnps_employeur: number | null
          created_at: string
          date_paiement: string | null
          employe_id: string
          heures_sup: number | null
          id: string
          irpp: number | null
          mode_paiement: string | null
          mois: number
          montant_heures_sup: number | null
          notes: string | null
          primes: Json | null
          reference_paiement: string | null
          salaire_base: number
          salaire_brut: number
          salaire_net: number
          statut: string
          taux_horaire_sup: number | null
          tdl: number | null
          total_primes: number | null
          total_retenues: number | null
          updated_at: string
        }
        Insert: {
          annee: number
          autres_retenues?: Json | null
          cac?: number | null
          cfc?: number | null
          cnps_employe?: number | null
          cnps_employeur?: number | null
          created_at?: string
          date_paiement?: string | null
          employe_id: string
          heures_sup?: number | null
          id?: string
          irpp?: number | null
          mode_paiement?: string | null
          mois: number
          montant_heures_sup?: number | null
          notes?: string | null
          primes?: Json | null
          reference_paiement?: string | null
          salaire_base: number
          salaire_brut: number
          salaire_net: number
          statut?: string
          taux_horaire_sup?: number | null
          tdl?: number | null
          total_primes?: number | null
          total_retenues?: number | null
          updated_at?: string
        }
        Update: {
          annee?: number
          autres_retenues?: Json | null
          cac?: number | null
          cfc?: number | null
          cnps_employe?: number | null
          cnps_employeur?: number | null
          created_at?: string
          date_paiement?: string | null
          employe_id?: string
          heures_sup?: number | null
          id?: string
          irpp?: number | null
          mode_paiement?: string | null
          mois?: number
          montant_heures_sup?: number | null
          notes?: string | null
          primes?: Json | null
          reference_paiement?: string | null
          salaire_base?: number
          salaire_brut?: number
          salaire_net?: number
          statut?: string
          taux_horaire_sup?: number | null
          tdl?: number | null
          total_primes?: number | null
          total_retenues?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "paie_employe_id_fkey"
            columns: ["employe_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
        ]
      }
      paiements: {
        Row: {
          client_id: string | null
          created_at: string | null
          date: string
          elements_specifiques: Json | null
          est_credit: boolean | null
          est_verifie: boolean | null
          facture_id: string
          id: string
          mode: string
          montant: number
          notes: string | null
          reference: string | null
          reference_transaction: string | null
          solde_restant: number | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          date?: string
          elements_specifiques?: Json | null
          est_credit?: boolean | null
          est_verifie?: boolean | null
          facture_id: string
          id?: string
          mode: string
          montant: number
          notes?: string | null
          reference?: string | null
          reference_transaction?: string | null
          solde_restant?: number | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          date?: string
          elements_specifiques?: Json | null
          est_credit?: boolean | null
          est_verifie?: boolean | null
          facture_id?: string
          id?: string
          mode?: string
          montant?: number
          notes?: string | null
          reference?: string | null
          reference_transaction?: string | null
          solde_restant?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "paiements_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paiements_facture_id_fkey"
            columns: ["facture_id"]
            isOneToOne: false
            referencedRelation: "factures"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_reminders: {
        Row: {
          client_id: string
          created_at: string | null
          facture_id: string
          id: string
          is_active: boolean | null
          last_sent: string | null
          method: string
          send_frequency: number | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          facture_id: string
          id?: string
          is_active?: boolean | null
          last_sent?: string | null
          method: string
          send_frequency?: number | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          facture_id?: string
          id?: string
          is_active?: boolean | null
          last_sent?: string | null
          method?: string
          send_frequency?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_reminders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_reminders_facture_id_fkey"
            columns: ["facture_id"]
            isOneToOne: false
            referencedRelation: "factures"
            referencedColumns: ["id"]
          },
        ]
      }
      prestations: {
        Row: {
          created_at: string | null
          description: string
          facture_id: string
          id: string
          montant: number
          quantite: number
          taux: number | null
        }
        Insert: {
          created_at?: string | null
          description: string
          facture_id: string
          id?: string
          montant: number
          quantite?: number
          taux?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string
          facture_id?: string
          id?: string
          montant?: number
          quantite?: number
          taux?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prestations_facture_id_fkey"
            columns: ["facture_id"]
            isOneToOne: false
            referencedRelation: "factures"
            referencedColumns: ["id"]
          },
        ]
      }
      procedures_administratives: {
        Row: {
          client_id: string
          created_at: string
          date_debut: string
          date_fin: string | null
          description: string | null
          etapes: Json | null
          id: string
          priorite: string
          responsable: string | null
          statut: string
          titre: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          date_debut?: string
          date_fin?: string | null
          description?: string | null
          etapes?: Json | null
          id?: string
          priorite?: string
          responsable?: string | null
          statut?: string
          titre: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          date_debut?: string
          date_fin?: string | null
          description?: string | null
          etapes?: Json | null
          id?: string
          priorite?: string
          responsable?: string | null
          statut?: string
          titre?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "procedures_administratives_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          nom: string | null
          prenom: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          nom?: string | null
          prenom?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          nom?: string | null
          prenom?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          client_id: string | null
          collaborateur_id: string
          created_at: string
          end_date: string | null
          end_time: string | null
          id: string
          start_date: string | null
          start_time: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          collaborateur_id: string
          created_at?: string
          end_date?: string | null
          end_time?: string | null
          id?: string
          start_date?: string | null
          start_time?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          collaborateur_id?: string
          created_at?: string
          end_date?: string | null
          end_time?: string | null
          id?: string
          start_date?: string | null
          start_time?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_tasks_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tasks_collaborateur"
            columns: ["collaborateur_id"]
            isOneToOne: false
            referencedRelation: "collaborateurs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_collaborateur_id_fkey"
            columns: ["collaborateur_id"]
            isOneToOne: false
            referencedRelation: "collaborateurs"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          collaborateur_id: string | null
          created_at: string
          email: string
          id: string
          password: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          collaborateur_id?: string | null
          created_at?: string
          email: string
          id?: string
          password: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          collaborateur_id?: string | null
          created_at?: string
          email?: string
          id?: string
          password?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_users_collaborateur"
            columns: ["collaborateur_id"]
            isOneToOne: false
            referencedRelation: "collaborateurs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_collaborateur_id_fkey"
            columns: ["collaborateur_id"]
            isOneToOne: false
            referencedRelation: "collaborateurs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_client_financial_details: {
        Args: { client_id: string }
        Returns: {
          factures: Json
          paiements: Json
          solde_disponible: number
        }[]
      }
      get_client_financial_summary: {
        Args: { client_id: string }
        Returns: {
          solde_disponible: number
          statut: string
          total_facture: number
          total_paye: number
        }[]
      }
      get_clients_with_financial_status: {
        Args: never
        Returns: {
          facturesmontant: number
          id: string
          nom: string
          paiementsmontant: number
          solde: number
          status: string
        }[]
      }
    }
    Enums: {
      user_role: "admin" | "comptable" | "assistant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "comptable", "assistant"],
    },
  },
} as const
