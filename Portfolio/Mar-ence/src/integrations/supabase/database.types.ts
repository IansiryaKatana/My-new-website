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
        Update: Partial<Database['public']['Tables']['site_settings']['Insert']>
      }
      hero_content: {
        Row: {
          id: string
          logo_text: string
          title_line_one: string
          title_line_two: string
          intro_text: string
          statement: string
          background_image_url: string
          primary_cta_label: string
          primary_cta_href: string
          secondary_cta_label: string
          secondary_cta_href: string
          published: boolean
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['hero_content']['Row']> & {
          logo_text: string
        }
        Update: Partial<Database['public']['Tables']['hero_content']['Insert']>
      }
      navigation_items: {
        Row: {
          id: string
          label: string
          href: string
          sort_order: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['navigation_items']['Row']> & {
          label: string
          href: string
        }
        Update: Partial<Database['public']['Tables']['navigation_items']['Insert']>
      }
      trusted_logos: {
        Row: {
          id: string
          name: string
          image_url: string
          alt_text: string
          sort_order: number
          published: boolean
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['trusted_logos']['Row']> & {
          name: string
        }
        Update: Partial<Database['public']['Tables']['trusted_logos']['Insert']>
      }
      logo_strip: {
        Row: { id: string; label: string; published: boolean; updated_at: string }
        Insert: Partial<Database['public']['Tables']['logo_strip']['Row']> & {
          label: string
        }
        Update: Partial<Database['public']['Tables']['logo_strip']['Insert']>
      }
      perspective_section: {
        Row: {
          id: string
          eyebrow: string
          title: string
          description: string
          image_url: string
          published: boolean
          updated_at: string
        }
        Insert: Partial<
          Database['public']['Tables']['perspective_section']['Row']
        > & { title: string }
        Update: Partial<
          Database['public']['Tables']['perspective_section']['Insert']
        >
      }
      principles: {
        Row: {
          id: string
          number: string
          title: string
          description: string
          sort_order: number
          published: boolean
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['principles']['Row']> & {
          number: string
          title: string
        }
        Update: Partial<Database['public']['Tables']['principles']['Insert']>
      }
      portfolio_section: {
        Row: {
          id: string
          eyebrow: string
          title: string
          intro_text: string
          published: boolean
          updated_at: string
        }
        Insert: Partial<
          Database['public']['Tables']['portfolio_section']['Row']
        > & { title: string }
        Update: Partial<
          Database['public']['Tables']['portfolio_section']['Insert']
        >
      }
      portfolio_projects: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          image_large_url: string
          image_side_url: string
          project_url: string
          is_featured: boolean
          sort_order: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<
          Database['public']['Tables']['portfolio_projects']['Row']
        > & { name: string; slug: string }
        Update: Partial<
          Database['public']['Tables']['portfolio_projects']['Insert']
        >
      }
      image_break: {
        Row: {
          id: string
          image_url: string
          alt_text: string
          published: boolean
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['image_break']['Row']>
        Update: Partial<Database['public']['Tables']['image_break']['Insert']>
      }
      investment_approach: {
        Row: {
          id: string
          eyebrow: string
          title: string
          description: string
          published: boolean
          updated_at: string
        }
        Insert: Partial<
          Database['public']['Tables']['investment_approach']['Row']
        > & { title: string }
        Update: Partial<
          Database['public']['Tables']['investment_approach']['Insert']
        >
      }
      investment_approach_items: {
        Row: {
          id: string
          number: string
          title: string
          description: string
          sort_order: number
          published: boolean
          created_at: string
        }
        Insert: Partial<
          Database['public']['Tables']['investment_approach_items']['Row']
        > & { number: string; title: string }
        Update: Partial<
          Database['public']['Tables']['investment_approach_items']['Insert']
        >
      }
      final_cta: {
        Row: {
          id: string
          heading: string
          button_label: string
          button_href: string
          background_image_url: string
          published: boolean
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['final_cta']['Row']> & {
          heading: string
        }
        Update: Partial<Database['public']['Tables']['final_cta']['Insert']>
      }
      footer_content: {
        Row: {
          id: string
          statement: string
          wordmark: string
          published: boolean
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['footer_content']['Row']>
        Update: Partial<Database['public']['Tables']['footer_content']['Insert']>
      }
      footer_link_groups: {
        Row: {
          id: string
          title: string
          sort_order: number
          published: boolean
        }
        Insert: Partial<
          Database['public']['Tables']['footer_link_groups']['Row']
        > & { title: string }
        Update: Partial<
          Database['public']['Tables']['footer_link_groups']['Insert']
        >
      }
      footer_links: {
        Row: {
          id: string
          group_id: string | null
          label: string
          href: string
          sort_order: number
          published: boolean
        }
        Insert: Partial<Database['public']['Tables']['footer_links']['Row']> & {
          label: string
          href: string
        }
        Update: Partial<Database['public']['Tables']['footer_links']['Insert']>
      }
      social_links: {
        Row: {
          id: string
          platform: string
          url: string
          sort_order: number
          published: boolean
        }
        Insert: Partial<Database['public']['Tables']['social_links']['Row']> & {
          platform: string
          url: string
        }
        Update: Partial<Database['public']['Tables']['social_links']['Insert']>
      }
      legal_links: {
        Row: {
          id: string
          label: string
          href: string
          sort_order: number
          published: boolean
        }
        Insert: Partial<Database['public']['Tables']['legal_links']['Row']> & {
          label: string
          href: string
        }
        Update: Partial<Database['public']['Tables']['legal_links']['Insert']>
      }
      form_submissions: {
        Row: {
          id: string
          form_type: string
          name: string | null
          email: string | null
          company: string | null
          message: string | null
          status: string
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['form_submissions']['Row']>
        Update: Partial<
          Database['public']['Tables']['form_submissions']['Insert']
        >
      }
      admin_users: {
        Row: {
          id: string
          auth_user_id: string | null
          email: string
          role: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['admin_users']['Row']> & {
          email: string
        }
        Update: Partial<Database['public']['Tables']['admin_users']['Insert']>
      }
      cms_media: {
        Row: {
          id: string
          public_url: string
          storage_path: string
          folder: string
          kind: string
          alt_text: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['cms_media']['Row']> & {
          public_url: string
          storage_path: string
        }
        Update: Partial<Database['public']['Tables']['cms_media']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: { is_admin: { Args: Record<string, never>; Returns: boolean } }
    Enums: Record<string, never>
  }
}
