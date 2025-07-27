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
          email: string
          username: string
          created_at: string
          updated_at: string
          onboarding_completed: boolean
          preferences: Json
          last_active: string
         first_name: string | null
         last_name: string | null
         date_of_birth: string | null
         height: number | null
         weight: number | null
         gender: string | null
         activity_level: string | null
         fitness_goal: string | null
        }
        Insert: {
          id: string
          email: string
          username: string
          created_at?: string
          updated_at?: string
          onboarding_completed?: boolean
          preferences?: Json
          last_active?: string
         first_name?: string | null
         last_name?: string | null
         date_of_birth?: string | null
         height?: number | null
         weight?: number | null
         gender?: string | null
         activity_level?: string | null
         fitness_goal?: string | null
        }
        Update: {
          id?: string
          email?: string
          username?: string
          created_at?: string
          updated_at?: string
          onboarding_completed?: boolean
          preferences?: Json
          last_active?: string
         first_name?: string | null
         last_name?: string | null
         date_of_birth?: string | null
         height?: number | null
         weight?: number | null
         gender?: string | null
         activity_level?: string | null
         fitness_goal?: string | null
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