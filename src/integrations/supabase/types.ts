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
      appointments: {
        Row: {
          created_at: string
          data_agendamento: string
          id: string
          observacoes: string | null
          patient_id: string
          professional_id: string
          status: string | null
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_agendamento: string
          id?: string
          observacoes?: string | null
          patient_id: string
          professional_id: string
          status?: string | null
          tipo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_agendamento?: string
          id?: string
          observacoes?: string | null
          patient_id?: string
          professional_id?: string
          status?: string | null
          tipo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_consultations: {
        Row: {
          atestados: string | null
          avaliacao: string | null
          created_at: string
          exames: string | null
          id: string
          objetivo: string | null
          patient_id: string
          plano: string | null
          professional_id: string
          receitas: string | null
          subjetivo: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          atestados?: string | null
          avaliacao?: string | null
          created_at?: string
          exames?: string | null
          id?: string
          objetivo?: string | null
          patient_id: string
          plano?: string | null
          professional_id: string
          receitas?: string | null
          subjetivo?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          atestados?: string | null
          avaliacao?: string | null
          created_at?: string
          exames?: string | null
          id?: string
          objetivo?: string | null
          patient_id?: string
          plano?: string | null
          professional_id?: string
          receitas?: string | null
          subjetivo?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_consultations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_consultations_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          convenio: string | null
          cpf: string
          created_at: string
          email: string | null
          endereco: string | null
          genero: string | null
          id: string
          nascimento: string
          nome: string
          observacoes: string | null
          responsavel: string | null
          status: string | null
          telefone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          convenio?: string | null
          cpf: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          genero?: string | null
          id?: string
          nascimento: string
          nome: string
          observacoes?: string | null
          responsavel?: string | null
          status?: string | null
          telefone: string
          updated_at?: string
          user_id: string
        }
        Update: {
          convenio?: string | null
          cpf?: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          genero?: string | null
          id?: string
          nascimento?: string
          nome?: string
          observacoes?: string | null
          responsavel?: string | null
          status?: string | null
          telefone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      professionals: {
        Row: {
          created_at: string
          dias_atendimento: string[] | null
          email: string
          especialidade: string
          horario_fim: string | null
          horario_inicio: string | null
          id: string
          nome: string
          observacoes: string | null
          registro: string
          status: string | null
          telefone: string
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dias_atendimento?: string[] | null
          email: string
          especialidade: string
          horario_fim?: string | null
          horario_inicio?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          registro: string
          status?: string | null
          telefone: string
          tipo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dias_atendimento?: string[] | null
          email?: string
          especialidade?: string
          horario_fim?: string | null
          horario_inicio?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          registro?: string
          status?: string | null
          telefone?: string
          tipo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          has_used_trial: boolean
          id: string
          is_trial_active: boolean
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          trial_ends_at: string | null
          trial_started_at: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          has_used_trial?: boolean
          id?: string
          is_trial_active?: boolean
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          trial_ends_at?: string | null
          trial_started_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          has_used_trial?: boolean
          id?: string
          is_trial_active?: boolean
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          trial_ends_at?: string | null
          trial_started_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      triagem: {
        Row: {
          classificacao_manchester: string
          created_at: string
          frequencia_cardiaca: number | null
          id: string
          observacoes: string | null
          patient_id: string
          pressao_arterial: string | null
          queixa_principal: string
          saturacao_oxigenio: number | null
          sintomas: string[] | null
          temperatura: number | null
          user_id: string
        }
        Insert: {
          classificacao_manchester: string
          created_at?: string
          frequencia_cardiaca?: number | null
          id?: string
          observacoes?: string | null
          patient_id: string
          pressao_arterial?: string | null
          queixa_principal: string
          saturacao_oxigenio?: number | null
          sintomas?: string[] | null
          temperatura?: number | null
          user_id: string
        }
        Update: {
          classificacao_manchester?: string
          created_at?: string
          frequencia_cardiaca?: number | null
          id?: string
          observacoes?: string | null
          patient_id?: string
          pressao_arterial?: string | null
          queixa_principal?: string
          saturacao_oxigenio?: number | null
          sintomas?: string[] | null
          temperatura?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "triagem_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
