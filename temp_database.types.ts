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
          id: number
          sentence: string | null
        }
        Insert: {
          id?: number
          sentence?: string | null
        }
        Update: {
          id?: number
          sentence?: string | null
        }
        Relationships: []
      }
      images: {
        Row: {
          char: string | null
          created_at: string
          id: string
          index: number
        }
        Insert: {
          char?: string | null
          created_at?: string
          id?: string
          index?: number
        }
        Update: {
          char?: string | null
          created_at?: string
          id?: string
          index?: number
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
        }
        Insert: {
          character: string
          chosen_image?: number
          created_at?: string
          id?: string
          knowledgeLevel?: number | null
        }
        Update: {
          character?: string
          chosen_image?: number
          created_at?: string
          id?: string
          knowledgeLevel?: number | null
        }
        Relationships: []
      }
      MyKnownWords: {
        Row: {
          image_paths: string[] | null
          knowledgeLevel: number | null
          wordChinese: string
        }
        Insert: {
          image_paths?: string[] | null
          knowledgeLevel?: number | null
          wordChinese: string
        }
        Update: {
          image_paths?: string[] | null
          knowledgeLevel?: number | null
          wordChinese?: string
        }
        Relationships: []
      }
      Texts: {
        Row: {
          id: string
          sentence: number | null
          text_id: string | null
          translation: string | null
          word: string | null
          word_position: number | null
        }
        Insert: {
          id?: string
          sentence?: number | null
          text_id?: string | null
          translation?: string | null
          word?: string | null
          word_position?: number | null
        }
        Update: {
          id?: string
          sentence?: number | null
          text_id?: string | null
          translation?: string | null
          word?: string | null
          word_position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Texts_text_id_fkey"
            columns: ["text_id"]
            isOneToOne: false
            referencedRelation: "TextsMetadata"
            referencedColumns: ["text_id"]
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
        }
        Relationships: [
          {
            foreignKeyName: "Texts2_text_id_fkey"
            columns: ["text_id"]
            isOneToOne: false
            referencedRelation: "TextsMetadata"
            referencedColumns: ["text_id"]
          },
        ]
      }
      TextsMetadata: {
        Row: {
          currentSentence: number
          text_id: string
          title: string | null
        }
        Insert: {
          currentSentence?: number
          text_id?: string
          title?: string | null
        }
        Update: {
          currentSentence?: number
          text_id?: string
          title?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      distinct_text_id: {
        Row: {
          text_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Texts_text_id_fkey"
            columns: ["text_id"]
            isOneToOne: false
            referencedRelation: "TextsMetadata"
            referencedColumns: ["text_id"]
          },
        ]
      }
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
