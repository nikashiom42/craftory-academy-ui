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
      course_enrollments: {
        Row: {
          course_id: string
          created_at: string | null
          enrolled_at: string | null
          id: string
          paid_at: string | null
          ipay_order_id: string | null
          ipay_payment_hash: string | null
          ipay_payment_id: string | null
          payment_status: Database["public"]["Enums"]["enrollment_status"]
          price_paid: number
          tbc_order_id: string | null
          tbc_payment_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          enrolled_at?: string | null
          id?: string
          paid_at?: string | null
          ipay_order_id?: string | null
          ipay_payment_hash?: string | null
          ipay_payment_id?: string | null
          payment_status?: Database["public"]["Enums"]["enrollment_status"]
          price_paid: number
          tbc_order_id?: string | null
          tbc_payment_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          enrolled_at?: string | null
          id?: string
          paid_at?: string | null
          ipay_order_id?: string | null
          ipay_payment_hash?: string | null
          ipay_payment_id?: string | null
          payment_status?: Database["public"]["Enums"]["enrollment_status"]
          price_paid?: number
          tbc_order_id?: string | null
          tbc_payment_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_orders: {
        Row: {
          amount: number
          callback_url: string | null
          course_id: string
          course_title: string
          created_at: string | null
          currency_code: string
          error_code: string | null
          error_message: string | null
          id: string
          intent: string
          ipay_order_id: string | null
          ipay_payment_hash: string | null
          ipay_payment_id: string | null
          locale: string
          metadata: Json | null
          redirect_url: string | null
          shop_order_id: string
          status: Database["public"]["Enums"]["payment_order_status"]
          status_description: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          callback_url?: string | null
          course_id: string
          course_title: string
          created_at?: string | null
          currency_code?: string
          error_code?: string | null
          error_message?: string | null
          id?: string
          intent?: string
          ipay_order_id?: string | null
          ipay_payment_hash?: string | null
          ipay_payment_id?: string | null
          locale?: string
          metadata?: Json | null
          redirect_url?: string | null
          shop_order_id: string
          status?: Database["public"]["Enums"]["payment_order_status"]
          status_description?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          callback_url?: string | null
          course_id?: string
          course_title?: string
          created_at?: string | null
          currency_code?: string
          error_code?: string | null
          error_message?: string | null
          id?: string
          intent?: string
          ipay_order_id?: string | null
          ipay_payment_hash?: string | null
          ipay_payment_id?: string | null
          locale?: string
          metadata?: Json | null
          redirect_url?: string | null
          shop_order_id?: string
          status?: Database["public"]["Enums"]["payment_order_status"]
          status_description?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_orders_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_registrations: {
        Row: {
          city: string
          course_id: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          notes: string | null
          personal_id: string
          phone: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          city: string
          course_id?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          personal_id: string
          phone: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string
          course_id?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          personal_id?: string
          phone?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_registrations_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          cohort: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          duration: string | null
          end_date: string | null
          featured_on_home: boolean | null
          google_drive_link: string | null
          google_meet_link: string | null
          hero_claims: Json | null
          id: string
          image_url: string | null
          info_session_cta: Json | null
          participant_number: number | null
          price: number | null
          published: boolean | null
          skills: Json | null
          slug: string
          start_date: string | null
          subtitle: string | null
          syllabus: Json | null
          target_audience: Json | null
          title: string
          trainer: Json | null
          updated_at: string | null
          why_section: Json | null
        }
        Insert: {
          cohort?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration?: string | null
          end_date?: string | null
          featured_on_home?: boolean | null
          google_drive_link?: string | null
          google_meet_link?: string | null
          hero_claims?: Json | null
          id?: string
          image_url?: string | null
          info_session_cta?: Json | null
          participant_number?: number | null
          price?: number | null
          published?: boolean | null
          skills?: Json | null
          slug: string
          start_date?: string | null
          subtitle?: string | null
          syllabus?: Json | null
          target_audience?: Json | null
          title: string
          trainer?: Json | null
          updated_at?: string | null
          why_section?: Json | null
        }
        Update: {
          cohort?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration?: string | null
          end_date?: string | null
          featured_on_home?: boolean | null
          google_drive_link?: string | null
          google_meet_link?: string | null
          hero_claims?: Json | null
          id?: string
          image_url?: string | null
          info_session_cta?: Json | null
          participant_number?: number | null
          price?: number | null
          published?: boolean | null
          skills?: Json | null
          slug?: string
          start_date?: string | null
          subtitle?: string | null
          syllabus?: Json | null
          target_audience?: Json | null
          title?: string
          trainer?: Json | null
          updated_at?: string | null
          why_section?: Json | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          active: boolean
          created_at: string
          display_order: number
          id: string
          logo_url: string
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          display_order?: number
          id?: string
          logo_url: string
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          display_order?: number
          id?: string
          logo_url?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      enrollment_status: "pending" | "completed" | "test" | "paid" | "failed"
      payment_order_status: "pending" | "redirected" | "success" | "failed" | "cancelled"
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
      app_role: ["admin", "user"],
      enrollment_status: ["pending", "completed", "test", "paid", "failed"],
    },
  },
} as const
