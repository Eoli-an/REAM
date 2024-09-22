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
      currentSentence: {
        Row: {
          sentence: string | null
          user_id: string
        }
        Insert: {
          sentence?: string | null
          user_id: string
        }
        Update: {
          sentence?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "currentSentence_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
        Row: {
          char: string | null
          created_at: string
          explanation: string | null
          id: string
          index: number
          prompt: string | null
          type: Database["public"]["Enums"]["Image Type"] | null
        }
        Insert: {
          char?: string | null
          created_at?: string
          explanation?: string | null
          id?: string
          index?: number
          prompt?: string | null
          type?: Database["public"]["Enums"]["Image Type"] | null
        }
        Update: {
          char?: string | null
          created_at?: string
          explanation?: string | null
          id?: string
          index?: number
          prompt?: string | null
          type?: Database["public"]["Enums"]["Image Type"] | null
        }
        Relationships: []
      }
      MyKnownCharacters: {
        Row: {
          character: string
          chosen_image: number
          created_at: string
          id: string
          knowledgeLevel: number | null
          user_id: string | null
        }
        Insert: {
          character: string
          chosen_image?: number
          created_at?: string
          id?: string
          knowledgeLevel?: number | null
          user_id?: string | null
        }
        Update: {
          character?: string
          chosen_image?: number
          created_at?: string
          id?: string
          knowledgeLevel?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "MyKnownCharacters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      MyKnownWords: {
        Row: {
          image_paths: string[] | null
          knowledgeLevel: number | null
          user_id: string | null
          wordChinese: string
        }
        Insert: {
          image_paths?: string[] | null
          knowledgeLevel?: number | null
          user_id?: string | null
          wordChinese: string
        }
        Update: {
          image_paths?: string[] | null
          knowledgeLevel?: number | null
          user_id?: string | null
          wordChinese?: string
        }
        Relationships: [
          {
            foreignKeyName: "MyKnownWords_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      Texts2: {
        Row: {
          id: string
          sentence: string[] | null
          sentence_id: number | null
          sentence_simplified_translation: string | null
          sentence_simplified_word_translations: string[] | null
          sentence_translation: string | null
          sentence_word_translations: string[] | null
          simplified_sentence: string[] | null
          text_id: string
          user_id: string | null
        }
        Insert: {
          id?: string
          sentence?: string[] | null
          sentence_id?: number | null
          sentence_simplified_translation?: string | null
          sentence_simplified_word_translations?: string[] | null
          sentence_translation?: string | null
          sentence_word_translations?: string[] | null
          simplified_sentence?: string[] | null
          text_id: string
          user_id?: string | null
        }
        Update: {
          id?: string
          sentence?: string[] | null
          sentence_id?: number | null
          sentence_simplified_translation?: string | null
          sentence_simplified_word_translations?: string[] | null
          sentence_translation?: string | null
          sentence_word_translations?: string[] | null
          simplified_sentence?: string[] | null
          text_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Texts2_text_id_fkey"
            columns: ["text_id"]
            isOneToOne: false
            referencedRelation: "TextsMetadata"
            referencedColumns: ["text_id"]
          },
          {
            foreignKeyName: "Texts2_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      TextsMetadata: {
        Row: {
          currentSentence: number
          sentenceAmount: number | null
          text_id: string
          title: string | null
          user_id: string | null
        }
        Insert: {
          currentSentence?: number
          sentenceAmount?: number | null
          text_id?: string
          title?: string | null
          user_id?: string | null
        }
        Update: {
          currentSentence?: number
          sentenceAmount?: number | null
          text_id?: string
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "TextsMetadata_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      Users: {
        Row: {
          id: string
        }
        Insert: {
          id?: string
        }
        Update: {
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
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
      "Image Type": "Meaning" | "Mnemonic"
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
