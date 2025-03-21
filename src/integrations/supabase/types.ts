export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          adresse: Json
          centrerattachement: string
          contact: Json
          created_at: string
          datecreation: string | null
          etatcivil: string | null
          fiscal_data: Json | null
          formejuridique: string | null
          gestionexternalisee: boolean | null
          id: string
          interactions: Json | null
          lieucreation: string | null
          niu: string
          nom: string | null
          nomdirigeant: string | null
          numerocnps: string | null
          raisonsociale: string | null
          regimefiscal: string | null
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
          etatcivil?: string | null
          fiscal_data?: Json | null
          formejuridique?: string | null
          gestionexternalisee?: boolean | null
          id?: string
          interactions?: Json | null
          lieucreation?: string | null
          niu: string
          nom?: string | null
          nomdirigeant?: string | null
          numerocnps?: string | null
          raisonsociale?: string | null
          regimefiscal?: string | null
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
          etatcivil?: string | null
          fiscal_data?: Json | null
          formejuridique?: string | null
          gestionexternalisee?: boolean | null
          id?: string
          interactions?: Json | null
          lieucreation?: string | null
          niu?: string
          nom?: string | null
          nomdirigeant?: string | null
          numerocnps?: string | null
          raisonsociale?: string | null
          regimefiscal?: string | null
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
      paiements: {
        Row: {
          created_at: string | null
          date: string
          facture_id: string
          id: string
          mode: string
          montant: number
          notes: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string
          facture_id: string
          id?: string
          mode: string
          montant: number
          notes?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          facture_id?: string
          id?: string
          mode?: string
          montant?: number
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paiements_facture_id_fkey"
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
      [_ in never]: never
    }
    Enums: {
      user_role: "admin" | "comptable" | "assistant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
