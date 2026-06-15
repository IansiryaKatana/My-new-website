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
      properties: {
        Row: {
          id: string
          slug: string
          title: string
          location: string
          description: string
          price_from: number
          image_url: string
          category: 'loft' | 'budget' | 'rent'
          status: string | null
          bedrooms: number
          bathrooms: number
          area_label: string
          year_label: string | null
          published: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          location?: string
          description?: string
          price_from?: number
          image_url?: string
          category?: 'loft' | 'budget' | 'rent'
          status?: string | null
          bedrooms?: number
          bathrooms?: number
          area_label?: string
          year_label?: string | null
          published?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          location?: string
          description?: string
          price_from?: number
          image_url?: string
          category?: 'loft' | 'budget' | 'rent'
          status?: string | null
          bedrooms?: number
          bathrooms?: number
          area_label?: string
          year_label?: string | null
          published?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      property_categories: {
        Row: {
          id: string
          slug: string
          label: string
          sort_order: number
          active: boolean
        }
        Insert: {
          id?: string
          slug: string
          label: string
          sort_order?: number
          active?: boolean
        }
        Update: {
          id?: string
          slug?: string
          label?: string
          sort_order?: number
          active?: boolean
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          id: string
          client_name: string
          client_location: string
          title: string
          quote: string
          avatar_url: string | null
          property_image_url: string | null
          assigned_agent: string | null
          card_type: 'text' | 'image'
          published: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          client_name: string
          client_location?: string
          title?: string
          quote?: string
          avatar_url?: string | null
          property_image_url?: string | null
          assigned_agent?: string | null
          card_type?: 'text' | 'image'
          published?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          client_name?: string
          client_location?: string
          title?: string
          quote?: string
          avatar_url?: string | null
          property_image_url?: string | null
          assigned_agent?: string | null
          card_type?: 'text' | 'image'
          published?: boolean
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          name: string
          role: string
          bio: string
          image_url: string
          bullets: Json
          published: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          role?: string
          bio?: string
          image_url?: string
          bullets?: Json
          published?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          bio?: string
          image_url?: string
          bullets?: Json
          published?: boolean
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }
      faq_topics: {
        Row: {
          id: string
          title: string
          sort_order: number
          published: boolean
        }
        Insert: {
          id?: string
          title: string
          sort_order?: number
          published?: boolean
        }
        Update: {
          id?: string
          title?: string
          sort_order?: number
          published?: boolean
        }
        Relationships: []
      }
      faq_entries: {
        Row: {
          id: string
          topic_id: string
          question: string
          answer: string
          sort_order: number
          published: boolean
        }
        Insert: {
          id?: string
          topic_id: string
          question: string
          answer?: string
          sort_order?: number
          published?: boolean
        }
        Update: {
          id?: string
          topic_id?: string
          question?: string
          answer?: string
          sort_order?: number
          published?: boolean
        }
        Relationships: []
      }
      process_steps: {
        Row: {
          id: string
          step_number: string
          title: string
          description: string
          image_url: string | null
          published: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          step_number: string
          title: string
          description?: string
          image_url?: string | null
          published?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          step_number?: string
          title?: string
          description?: string
          image_url?: string | null
          published?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      hero_stats: {
        Row: {
          id: string
          label: string
          value: string
          sort_order: number
          published: boolean
        }
        Insert: {
          id?: string
          label: string
          value: string
          sort_order?: number
          published?: boolean
        }
        Update: {
          id?: string
          label?: string
          value?: string
          sort_order?: number
          published?: boolean
        }
        Relationships: []
      }
      marketing_blocks: {
        Row: {
          id: string
          key: string
          title: string | null
          body: string | null
          cta_label: string | null
          cta_href: string | null
          image_url: string | null
          published: boolean
        }
        Insert: {
          id?: string
          key: string
          title?: string | null
          body?: string | null
          cta_label?: string | null
          cta_href?: string | null
          image_url?: string | null
          published?: boolean
        }
        Update: {
          id?: string
          key?: string
          title?: string | null
          body?: string | null
          cta_label?: string | null
          cta_href?: string | null
          image_url?: string | null
          published?: boolean
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          key: string
          value?: Json
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      cms_media: {
        Row: {
          id: string
          public_url: string
          folder: string
          kind: string
          file_name: string
          created_at: string
        }
        Insert: {
          id?: string
          public_url: string
          folder?: string
          kind?: string
          file_name?: string
          created_at?: string
        }
        Update: {
          id?: string
          public_url?: string
          folder?: string
          kind?: string
          file_name?: string
          created_at?: string
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          id: string
          name: string
          phone: string
          email: string | null
          goal: string | null
          source_page: string
          property_interest: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email?: string | null
          goal?: string | null
          source_page?: string
          property_interest?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string | null
          goal?: string | null
          source_page?: string
          property_interest?: string | null
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          id: string
          auth_user_id: string | null
          email: string
          role: 'owner' | 'admin' | 'editor' | 'viewer'
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          auth_user_id?: string | null
          email: string
          role?: 'owner' | 'admin' | 'editor' | 'viewer'
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          auth_user_id?: string | null
          email?: string
          role?: 'owner' | 'admin' | 'editor' | 'viewer'
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      get_public_cms_snapshot: {
        Args: Record<string, never>
        Returns: Json
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
