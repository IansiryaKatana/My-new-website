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
      site_settings: {
        Row: { key: string; value: Json; updated_at: string }
        Insert: { key: string; value?: Json; updated_at?: string }
        Update: Partial<{ key: string; value: Json; updated_at: string }>
      }
      navigation_links: {
        Row: {
          id: string
          label: string
          href: string
          sort_order: number
          published: boolean
          is_cta: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['navigation_links']['Row']> & {
          label: string
        }
        Update: Partial<Database['public']['Tables']['navigation_links']['Row']>
      }
      hero_content: {
        Row: {
          id: string
          headline_line1: string
          headline_line2: string
          subcopy: string | null
          cta_label: string
          cta_url: string
          background_image_url: string
          thumbnail_image_url: string | null
          published: boolean
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['hero_content']['Row']> & {
          background_image_url: string
        }
        Update: Partial<Database['public']['Tables']['hero_content']['Row']>
      }
      metrics: {
        Row: {
          id: string
          value: string
          label: string
          sort_order: number
          published: boolean
          featured: boolean
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['metrics']['Row']> & {
          value: string
          label: string
        }
        Update: Partial<Database['public']['Tables']['metrics']['Row']>
      }
      projects: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          phase: string | null
          location: string | null
          image_url: string
          category: string
          layout: string
          cta_label: string
          cta_url: string
          sort_order: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['projects']['Row']> & {
          title: string
          slug: string
          image_url: string
        }
        Update: Partial<Database['public']['Tables']['projects']['Row']>
      }
      services: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          active: boolean
          sort_order: number
          published: boolean
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['services']['Row']> & {
          name: string
          slug: string
        }
        Update: Partial<Database['public']['Tables']['services']['Row']>
      }
      capabilities_section: {
        Row: {
          id: string
          eyebrow: string
          heading: string
          body: string | null
          cta_label: string
          cta_url: string
          background_image_url: string
          services_card_title: string
          published: boolean
          updated_at: string
        }
        Insert: Partial<
          Database['public']['Tables']['capabilities_section']['Row']
        > & { background_image_url: string }
        Update: Partial<Database['public']['Tables']['capabilities_section']['Row']>
      }
      process_stages: {
        Row: {
          id: string
          number: string
          title: string
          description: string
          sort_order: number
          published: boolean
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['process_stages']['Row']> & {
          number: string
          title: string
        }
        Update: Partial<Database['public']['Tables']['process_stages']['Row']>
      }
      map_section: {
        Row: {
          id: string
          eyebrow: string | null
          heading: string
          cta_label: string
          cta_url: string
          published: boolean
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['map_section']['Row']> & {
          heading: string
        }
        Update: Partial<Database['public']['Tables']['map_section']['Row']>
      }
      map_locations: {
        Row: {
          id: string
          country: string
          region: string | null
          x_percent: number
          y_percent: number
          status: string
          sort_order: number
          published: boolean
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['map_locations']['Row']> & {
          country: string
        }
        Update: Partial<Database['public']['Tables']['map_locations']['Row']>
      }
      footer_columns: {
        Row: {
          id: string
          title: string
          links: Json
          sort_order: number
          published: boolean
        }
        Insert: Partial<Database['public']['Tables']['footer_columns']['Row']> & {
          title: string
        }
        Update: Partial<Database['public']['Tables']['footer_columns']['Row']>
      }
      social_links: {
        Row: {
          id: string
          label: string
          href: string
          sort_order: number
          published: boolean
        }
        Insert: Partial<Database['public']['Tables']['social_links']['Row']> & {
          label: string
          href: string
        }
        Update: Partial<Database['public']['Tables']['social_links']['Row']>
      }
      section_copy: {
        Row: {
          id: string
          section_key: string
          eyebrow: string | null
          heading: string | null
          body: string | null
          published: boolean
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['section_copy']['Row']> & {
          section_key: string
        }
        Update: Partial<Database['public']['Tables']['section_copy']['Row']>
      }
      form_submissions: {
        Row: {
          id: string
          form_type: string
          name: string | null
          email: string | null
          message: string | null
          payload: Json
          status: string
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['form_submissions']['Row']>
        Update: Partial<Database['public']['Tables']['form_submissions']['Row']>
      }
      cms_media: {
        Row: {
          id: string
          filename: string
          public_url: string
          folder: string
          kind: string
          metadata: Json
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['cms_media']['Row']> & {
          filename: string
          public_url: string
        }
        Update: Partial<Database['public']['Tables']['cms_media']['Row']>
      }
      admin_users: {
        Row: {
          id: string
          auth_user_id: string | null
          email: string
          role: string
          is_active: boolean
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['admin_users']['Row']> & {
          email: string
        }
        Update: Partial<Database['public']['Tables']['admin_users']['Row']>
      }
    }
    Views: Record<string, never>
    Functions: { is_admin: { Args: Record<string, never>; Returns: boolean } }
    Enums: Record<string, never>
  }
}
