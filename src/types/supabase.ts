export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          date_of_birth: string | null
          gender: string | null
          height: number | null
          weight: number | null
          activity_level: string | null
          fitness_goal: string | null
          target_weight: number | null
          email: string
          username: string
          created_at: string
          updated_at: string
          onboarding_completed: boolean
          preferences: Json
          last_active: string
        }
        Insert: {
          id: string
          email: string
          username: string
          created_at?: string
          updated_at?: string
          onboarding_completed?: boolean
          preferences?: Json
          full_name?: string
          date_of_birth?: string
          gender?: string
          height?: number
          weight?: number
          activity_level?: string
          fitness_goal?: string
          target_weight?: number
          last_active?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          created_at?: string
          updated_at?: string
          onboarding_completed?: boolean
          preferences?: Json
          full_name?: string
          date_of_birth?: string
          gender?: string
          height?: number
          weight?: number
          activity_level?: string
          fitness_goal?: string
          target_weight?: number
          last_active?: string
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}