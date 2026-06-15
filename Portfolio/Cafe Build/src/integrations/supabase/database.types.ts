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
      products: {
        Row: {
          id: string
          name: string
          slug: string
          short_description: string
          description_html: string
          image_url: string
          price: number | null
          category: 'ceremonial' | 'seasonal' | 'signature'
          flavor: string | null
          is_featured: boolean
          published: boolean
          sort_order: number
          cta_href: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          short_description?: string
          description_html?: string
          image_url?: string
          price?: number | null
          category?: 'ceremonial' | 'seasonal' | 'signature'
          flavor?: string | null
          is_featured?: boolean
          published?: boolean
          sort_order?: number
          cta_href?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          short_description?: string
          description_html?: string
          image_url?: string
          price?: number | null
          category?: 'ceremonial' | 'seasonal' | 'signature'
          flavor?: string | null
          is_featured?: boolean
          published?: boolean
          sort_order?: number
          cta_href?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      benefits: {
        Row: {
          id: string
          label: string
          sort_order: number
          published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          label: string
          sort_order?: number
          published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          label?: string
          sort_order?: number
          published?: boolean
          created_at?: string
        }
        Relationships: []
      }
      nav_items: {
        Row: {
          id: string
          label: string
          href: string
          is_highlighted: boolean
          sort_order: number
          published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          label: string
          href: string
          is_highlighted?: boolean
          sort_order?: number
          published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          label?: string
          href?: string
          is_highlighted?: boolean
          sort_order?: number
          published?: boolean
          created_at?: string
        }
        Relationships: []
      }
      content_sections: {
        Row: {
          id: string
          section_key: string
          payload: Json
          published: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          section_key: string
          payload?: Json
          published?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          section_key?: string
          payload?: Json
          published?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          id: string
          author_name: string
          body: string
          image_url: string
          status: 'pending' | 'approved' | 'rejected'
          sort_order: number
          published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          author_name: string
          body: string
          image_url?: string
          status?: 'pending' | 'approved' | 'rejected'
          sort_order?: number
          published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          author_name?: string
          body?: string
          image_url?: string
          status?: 'pending' | 'approved' | 'rejected'
          sort_order?: number
          published?: boolean
          created_at?: string
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          id: string
          form_type: 'newsletter' | 'contact' | 'order'
          email: string
          payload: Json
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          form_type?: 'newsletter' | 'contact' | 'order'
          email: string
          payload?: Json
          source?: string
          created_at?: string
        }
        Update: {
          id?: string
          form_type?: 'newsletter' | 'contact' | 'order'
          email?: string
          payload?: Json
          source?: string
          created_at?: string
        }
        Relationships: []
      }
      cms_media: {
        Row: {
          id: string
          public_url: string
          storage_path: string
          folder: string
          kind: 'image' | 'video' | 'other'
          alt_text: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          public_url: string
          storage_path: string
          folder?: string
          kind?: 'image' | 'video' | 'other'
          alt_text?: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          public_url?: string
          storage_path?: string
          folder?: string
          kind?: 'image' | 'video' | 'other'
          alt_text?: string
          metadata?: Json
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
          display_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_user_id?: string | null
          email: string
          role?: 'owner' | 'admin' | 'editor' | 'viewer'
          is_active?: boolean
          display_name?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_user_id?: string | null
          email?: string
          role?: 'owner' | 'admin' | 'editor' | 'viewer'
          is_active?: boolean
          display_name?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketing_pages: {
        Row: {
          id: string
          title: string
          slug: string
          body_html: string
          meta: Json
          published: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          body_html?: string
          meta?: Json
          published?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          body_html?: string
          meta?: Json
          published?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      campaign_popups: {
        Row: {
          id: string
          title: string
          body_html: string
          image_url: string
          cta_text: string
          cta_href: string
          trigger_rules: Json
          published: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          body_html?: string
          image_url?: string
          cta_text?: string
          cta_href?: string
          trigger_rules?: Json
          published?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          body_html?: string
          image_url?: string
          cta_text?: string
          cta_href?: string
          trigger_rules?: Json
          published?: boolean
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      set_updated_at: {
        Args: Record<string, never>
        Returns: undefined
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
