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
      actions: {
        Row: {
          action_number: string
          assigned_to: string
          audit_id: string | null
          created_at: string | null
          created_by: string
          description: string
          due_date: string
          effectiveness_verified: boolean | null
          id: string
          nc_id: string | null
          status: Database["public"]["Enums"]["action_status"]
          type: Database["public"]["Enums"]["action_type"]
          updated_at: string | null
          verification_notes: string | null
        }
        Insert: {
          action_number: string
          assigned_to: string
          audit_id?: string | null
          created_at?: string | null
          created_by: string
          description: string
          due_date: string
          effectiveness_verified?: boolean | null
          id?: string
          nc_id?: string | null
          status?: Database["public"]["Enums"]["action_status"]
          type: Database["public"]["Enums"]["action_type"]
          updated_at?: string | null
          verification_notes?: string | null
        }
        Update: {
          action_number?: string
          assigned_to?: string
          audit_id?: string | null
          created_at?: string | null
          created_by?: string
          description?: string
          due_date?: string
          effectiveness_verified?: boolean | null
          id?: string
          nc_id?: string | null
          status?: Database["public"]["Enums"]["action_status"]
          type?: Database["public"]["Enums"]["action_type"]
          updated_at?: string | null
          verification_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "actions_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_nc_id_fkey"
            columns: ["nc_id"]
            isOneToOne: false
            referencedRelation: "non_conformities"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_reports: {
        Row: {
          ai_output: string
          context: string
          created_at: string | null
          created_by: string
          id: string
          related_id: string | null
          report_type: string
        }
        Insert: {
          ai_output: string
          context: string
          created_at?: string | null
          created_by: string
          id?: string
          related_id?: string | null
          report_type: string
        }
        Update: {
          ai_output?: string
          context?: string
          created_at?: string | null
          created_by?: string
          id?: string
          related_id?: string | null
          report_type?: string
        }
        Relationships: []
      }
      audits: {
        Row: {
          audit_date: string
          audit_number: string
          auditor_id: string
          created_at: string | null
          created_by: string
          id: string
          observations: string | null
          report_url: string | null
          score: number | null
          status: Database["public"]["Enums"]["audit_status"]
          title: string
          type: Database["public"]["Enums"]["audit_type"]
          updated_at: string | null
        }
        Insert: {
          audit_date: string
          audit_number: string
          auditor_id: string
          created_at?: string | null
          created_by: string
          id?: string
          observations?: string | null
          report_url?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["audit_status"]
          title: string
          type: Database["public"]["Enums"]["audit_type"]
          updated_at?: string | null
        }
        Update: {
          audit_date?: string
          audit_number?: string
          auditor_id?: string
          created_at?: string | null
          created_by?: string
          id?: string
          observations?: string | null
          report_url?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["audit_status"]
          title?: string
          type?: Database["public"]["Enums"]["audit_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string
          created_at: string | null
          created_by: string
          document_number: string
          expiry_date: string | null
          file_url: string
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
          validated_by: string | null
          validation_date: string | null
          version: string
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by: string
          document_number: string
          expiry_date?: string | null
          file_url: string
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string | null
          validated_by?: string | null
          validation_date?: string | null
          version?: string
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string
          document_number?: string
          expiry_date?: string | null
          file_url?: string
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
          validated_by?: string | null
          validation_date?: string | null
          version?: string
        }
        Relationships: []
      }
      kpi: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          name: string
          period: string | null
          target: string | null
          value: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          name: string
          period?: string | null
          target?: string | null
          value: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          name?: string
          period?: string | null
          target?: string | null
          value?: string
        }
        Relationships: []
      }
      non_conformities: {
        Row: {
          assigned_to: string | null
          attachment_url: string | null
          cause: string | null
          closed_at: string | null
          corrective_action: string | null
          created_at: string | null
          created_by: string
          description: string
          due_date: string | null
          id: string
          nc_number: string
          priority: Database["public"]["Enums"]["nc_priority"]
          status: Database["public"]["Enums"]["nc_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          attachment_url?: string | null
          cause?: string | null
          closed_at?: string | null
          corrective_action?: string | null
          created_at?: string | null
          created_by: string
          description: string
          due_date?: string | null
          id?: string
          nc_number: string
          priority?: Database["public"]["Enums"]["nc_priority"]
          status?: Database["public"]["Enums"]["nc_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          attachment_url?: string | null
          cause?: string | null
          closed_at?: string | null
          corrective_action?: string | null
          created_at?: string | null
          created_by?: string
          description?: string
          due_date?: string | null
          id?: string
          nc_number?: string
          priority?: Database["public"]["Enums"]["nc_priority"]
          status?: Database["public"]["Enums"]["nc_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          comments: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          evaluation_score: number | null
          id: string
          is_active: boolean | null
          last_evaluation_date: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          comments?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          evaluation_score?: number | null
          id?: string
          is_active?: boolean | null
          last_evaluation_date?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          comments?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          evaluation_score?: number | null
          id?: string
          is_active?: boolean | null
          last_evaluation_date?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_action_number: { Args: never; Returns: string }
      generate_audit_number: { Args: never; Returns: string }
      generate_nc_number: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      action_status:
        | "planifiee"
        | "en_cours"
        | "terminee"
        | "verifiee"
        | "inefficace"
      action_type: "corrective" | "preventive" | "amelioration"
      app_role: "admin" | "responsable_qualite" | "auditeur" | "employe"
      audit_status: "planifie" | "en_cours" | "termine" | "reporte"
      audit_type: "interne" | "externe" | "fournisseur" | "client"
      nc_priority: "basse" | "moyenne" | "haute" | "critique"
      nc_status: "ouverte" | "en_cours" | "resolue" | "cloturee" | "rejetee"
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
      action_status: [
        "planifiee",
        "en_cours",
        "terminee",
        "verifiee",
        "inefficace",
      ],
      action_type: ["corrective", "preventive", "amelioration"],
      app_role: ["admin", "responsable_qualite", "auditeur", "employe"],
      audit_status: ["planifie", "en_cours", "termine", "reporte"],
      audit_type: ["interne", "externe", "fournisseur", "client"],
      nc_priority: ["basse", "moyenne", "haute", "critique"],
      nc_status: ["ouverte", "en_cours", "resolue", "cloturee", "rejetee"],
    },
  },
} as const
