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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          meta: Json
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          meta?: Json
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          meta?: Json
        }
        Relationships: []
      }
      agency_settings: {
        Row: {
          address: string | null
          agency_name: string
          brand_color: string | null
          color_charcoal: string
          color_mint_cream: string
          color_prussian: string
          color_royal_gold: string
          color_watermelon: string
          color_status_success: string
          color_status_warning: string
          color_status_info: string
          color_status_danger: string
          color_status_neutral: string
          contact_email: string | null
          contact_phone: string | null
          currency: string
          default_agency_fee_pct: number
          default_security_deposit_pct: number
          ejari_contact: string | null
          favicon_url: string | null
          id: number
          legal_name: string | null
          logo_url: string | null
          logo_url_dark: string | null
          rera_number: string | null
          resend_api_key: string | null
          resend_from_email: string | null
          resend_from_name: string | null
          resend_reply_to: string | null
          app_url: string | null
          stripe_account_id: string | null
          stripe_charges_enabled: boolean
          stripe_country: string | null
          stripe_payouts_enabled: boolean
          stripe_publishable_key: string | null
          stripe_secret_key: string | null
          stripe_webhook_secret: string | null
          trade_license: string | null
          updated_at: string
          vat_number: string | null
          whatsapp_number: string | null
        }
        Insert: {
          address?: string | null
          agency_name?: string
          brand_color?: string | null
          color_charcoal?: string
          color_mint_cream?: string
          color_prussian?: string
          color_royal_gold?: string
          color_watermelon?: string
          color_status_success?: string
          color_status_warning?: string
          color_status_info?: string
          color_status_danger?: string
          color_status_neutral?: string
          contact_email?: string | null
          contact_phone?: string | null
          currency?: string
          default_agency_fee_pct?: number
          default_security_deposit_pct?: number
          ejari_contact?: string | null
          favicon_url?: string | null
          id?: number
          legal_name?: string | null
          logo_url?: string | null
          logo_url_dark?: string | null
          rera_number?: string | null
          resend_api_key?: string | null
          resend_from_email?: string | null
          resend_from_name?: string | null
          resend_reply_to?: string | null
          app_url?: string | null
          stripe_account_id?: string | null
          stripe_charges_enabled?: boolean
          stripe_country?: string | null
          stripe_payouts_enabled?: boolean
          stripe_publishable_key?: string | null
          stripe_secret_key?: string | null
          stripe_webhook_secret?: string | null
          trade_license?: string | null
          updated_at?: string
          vat_number?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          address?: string | null
          agency_name?: string
          brand_color?: string | null
          color_charcoal?: string
          color_mint_cream?: string
          color_prussian?: string
          color_royal_gold?: string
          color_watermelon?: string
          color_status_success?: string
          color_status_warning?: string
          color_status_info?: string
          color_status_danger?: string
          color_status_neutral?: string
          contact_email?: string | null
          contact_phone?: string | null
          currency?: string
          default_agency_fee_pct?: number
          default_security_deposit_pct?: number
          ejari_contact?: string | null
          favicon_url?: string | null
          id?: number
          legal_name?: string | null
          logo_url?: string | null
          logo_url_dark?: string | null
          rera_number?: string | null
          resend_api_key?: string | null
          resend_from_email?: string | null
          resend_from_name?: string | null
          resend_reply_to?: string | null
          app_url?: string | null
          stripe_account_id?: string | null
          stripe_charges_enabled?: boolean
          stripe_country?: string | null
          stripe_payouts_enabled?: boolean
          stripe_publishable_key?: string | null
          stripe_secret_key?: string | null
          stripe_webhook_secret?: string | null
          trade_license?: string | null
          updated_at?: string
          vat_number?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      application_documents: {
        Row: {
          application_id: string
          created_at: string
          doc_type: Database["public"]["Enums"]["document_type"]
          file_name: string | null
          file_path: string
          id: string
          notes: string | null
          uploaded_by: string | null
          verified: boolean
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          application_id: string
          created_at?: string
          doc_type: Database["public"]["Enums"]["document_type"]
          file_name?: string | null
          file_path: string
          id?: string
          notes?: string | null
          uploaded_by?: string | null
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string
          doc_type?: Database["public"]["Enums"]["document_type"]
          file_name?: string | null
          file_path?: string
          id?: string
          notes?: string | null
          uploaded_by?: string | null
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          agent_id: string | null
          cheques_offered: number
          contract_url: string | null
          created_at: string
          employer: string | null
          id: string
          monthly_income: number | null
          move_in_date: string | null
          notes: string | null
          occupants: number
          offer_amount: number
          property_id: string
          rejection_reason: string | null
          status: Database["public"]["Enums"]["application_status"]
          tenant_id: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          cheques_offered?: number
          contract_url?: string | null
          created_at?: string
          employer?: string | null
          id?: string
          monthly_income?: number | null
          move_in_date?: string | null
          notes?: string | null
          occupants?: number
          offer_amount: number
          property_id: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          tenant_id: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          cheques_offered?: number
          contract_url?: string | null
          created_at?: string
          employer?: string | null
          id?: string
          monthly_income?: number | null
          move_in_date?: string | null
          notes?: string | null
          occupants?: number
          offer_amount?: number
          property_id?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          created_at: string
          description: string | null
          id: string
          resolved_at: string | null
          severity: Database["public"]["Enums"]["ticket_priority"]
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          tenancy_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["ticket_priority"]
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          tenancy_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["ticket_priority"]
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          tenancy_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaints_tenancy_id_fkey"
            columns: ["tenancy_id"]
            isOneToOne: false
            referencedRelation: "tenancies"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_templates: {
        Row: {
          body_html: string
          description: string | null
          id: string
          is_default: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          body_html: string
          description?: string | null
          id?: string
          is_default?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          body_html?: string
          description?: string | null
          id?: string
          is_default?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          meta: Json
          provider_id: string | null
          status: string
          subject: string
          template_key: string | null
          to_email: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          meta?: Json
          provider_id?: string | null
          status?: string
          subject: string
          template_key?: string | null
          to_email: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          meta?: Json
          provider_id?: string | null
          status?: string
          subject?: string
          template_key?: string | null
          to_email?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body_html: string
          description: string | null
          enabled: boolean
          id: string
          name: string
          subject: string
          template_key: string
          updated_at: string
        }
        Insert: {
          body_html: string
          description?: string | null
          enabled?: boolean
          id?: string
          name: string
          subject: string
          template_key: string
          updated_at?: string
        }
        Update: {
          body_html?: string
          description?: string | null
          enabled?: boolean
          id?: string
          name?: string
          subject?: string
          template_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      maintenance_tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string
          description: string | null
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          resolved_at: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          tenancy_id: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          tenancy_id: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          tenancy_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_tickets_tenancy_id_fkey"
            columns: ["tenancy_id"]
            isOneToOne: false
            referencedRelation: "tenancies"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_updates: {
        Row: {
          by_user: string
          created_at: string
          id: string
          note: string
          ticket_id: string
        }
        Insert: {
          by_user: string
          created_at?: string
          id?: string
          note: string
          ticket_id: string
        }
        Update: {
          by_user?: string
          created_at?: string
          id?: string
          note?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_updates_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "maintenance_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          application_id: string | null
          body: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
          tenancy_id: string | null
        }
        Insert: {
          application_id?: string | null
          body: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
          tenancy_id?: string | null
        }
        Update: {
          application_id?: string | null
          body?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
          tenancy_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_tenancy_id_fkey"
            columns: ["tenancy_id"]
            isOneToOne: false
            referencedRelation: "tenancies"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          bank_name: string | null
          cheque_no: string | null
          created_at: string
          due_date: string
          id: string
          method: Database["public"]["Enums"]["payment_method"] | null
          notes: string | null
          paid_at: string | null
          payment_type: Database["public"]["Enums"]["payment_type"]
          proof_url: string | null
          reference: string | null
          status: Database["public"]["Enums"]["payment_status"]
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          tenancy_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          bank_name?: string | null
          cheque_no?: string | null
          created_at?: string
          due_date: string
          id?: string
          method?: Database["public"]["Enums"]["payment_method"] | null
          notes?: string | null
          paid_at?: string | null
          payment_type?: Database["public"]["Enums"]["payment_type"]
          proof_url?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          tenancy_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          bank_name?: string | null
          cheque_no?: string | null
          created_at?: string
          due_date?: string
          id?: string
          method?: Database["public"]["Enums"]["payment_method"] | null
          notes?: string | null
          paid_at?: string | null
          payment_type?: Database["public"]["Enums"]["payment_type"]
          proof_url?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          tenancy_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_tenancy_id_fkey"
            columns: ["tenancy_id"]
            isOneToOne: false
            referencedRelation: "tenancies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          emirates_id: string | null
          full_name: string | null
          id: string
          nationality: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          emirates_id?: string | null
          full_name?: string | null
          id: string
          nationality?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          emirates_id?: string | null
          full_name?: string | null
          id?: string
          nationality?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          agency_fee: number | null
          amenities: string[]
          available_from: string | null
          baths: number
          beds: number
          building: string | null
          cheques_accepted: number
          community: string
          cover_image: string | null
          created_at: string
          description: string | null
          furnished: boolean
          id: string
          listed_by: string | null
          property_type: Database["public"]["Enums"]["property_type"]
          reference: string | null
          rent_yearly: number
          security_deposit: number | null
          sqft: number | null
          status: Database["public"]["Enums"]["property_status"]
          sub_community: string | null
          title: string
          unit_no: string | null
          updated_at: string
          view_count: number
        }
        Insert: {
          agency_fee?: number | null
          amenities?: string[]
          available_from?: string | null
          baths?: number
          beds?: number
          building?: string | null
          cheques_accepted?: number
          community: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          furnished?: boolean
          id?: string
          listed_by?: string | null
          property_type: Database["public"]["Enums"]["property_type"]
          reference?: string | null
          rent_yearly: number
          security_deposit?: number | null
          sqft?: number | null
          status?: Database["public"]["Enums"]["property_status"]
          sub_community?: string | null
          title: string
          unit_no?: string | null
          updated_at?: string
          view_count?: number
        }
        Update: {
          agency_fee?: number | null
          amenities?: string[]
          available_from?: string | null
          baths?: number
          beds?: number
          building?: string | null
          cheques_accepted?: number
          community?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          furnished?: boolean
          id?: string
          listed_by?: string | null
          property_type?: Database["public"]["Enums"]["property_type"]
          reference?: string | null
          rent_yearly?: number
          security_deposit?: number | null
          sqft?: number | null
          status?: Database["public"]["Enums"]["property_status"]
          sub_community?: string | null
          title?: string
          unit_no?: string | null
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "properties_listed_by_fkey"
            columns: ["listed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_images: {
        Row: {
          created_at: string
          id: string
          property_id: string
          sort_order: number
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          sort_order?: number
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      renewals: {
        Row: {
          created_at: string
          current_rent: number
          id: string
          notes: string | null
          offered_at: string | null
          proposed_cheques: number
          proposed_rent: number
          responded_at: string | null
          status: Database["public"]["Enums"]["renewal_status"]
          tenancy_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_rent: number
          id?: string
          notes?: string | null
          offered_at?: string | null
          proposed_cheques?: number
          proposed_rent: number
          responded_at?: string | null
          status?: Database["public"]["Enums"]["renewal_status"]
          tenancy_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_rent?: number
          id?: string
          notes?: string | null
          offered_at?: string | null
          proposed_cheques?: number
          proposed_rent?: number
          responded_at?: string | null
          status?: Database["public"]["Enums"]["renewal_status"]
          tenancy_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "renewals_tenancy_id_fkey"
            columns: ["tenancy_id"]
            isOneToOne: false
            referencedRelation: "tenancies"
            referencedColumns: ["id"]
          },
        ]
      }
      tenancies: {
        Row: {
          annual_rent: number
          application_id: string | null
          cheques: number
          contract_url: string | null
          created_at: string
          ejari_number: string | null
          ejari_status: string | null
          end_date: string
          id: string
          property_id: string
          security_deposit: number
          start_date: string
          status: Database["public"]["Enums"]["tenancy_status"]
          tenant_id: string
          updated_at: string
        }
        Insert: {
          annual_rent: number
          application_id?: string | null
          cheques?: number
          contract_url?: string | null
          created_at?: string
          ejari_number?: string | null
          ejari_status?: string | null
          end_date: string
          id?: string
          property_id: string
          security_deposit?: number
          start_date: string
          status?: Database["public"]["Enums"]["tenancy_status"]
          tenant_id: string
          updated_at?: string
        }
        Update: {
          annual_rent?: number
          application_id?: string | null
          cheques?: number
          contract_url?: string | null
          created_at?: string
          ejari_number?: string | null
          ejari_status?: string | null
          end_date?: string
          id?: string
          property_id?: string
          security_deposit?: number
          start_date?: string
          status?: Database["public"]["Enums"]["tenancy_status"]
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenancies_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenancies_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      viewings: {
        Row: {
          agent_id: string | null
          created_at: string
          feedback: string | null
          id: string
          notes: string | null
          property_id: string
          requested_at: string
          scheduled_at: string | null
          status: Database["public"]["Enums"]["viewing_status"]
          tenant_id: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          notes?: string | null
          property_id: string
          requested_at?: string
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["viewing_status"]
          tenant_id: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          notes?: string | null
          property_id?: string
          requested_at?: string
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["viewing_status"]
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "viewings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      agency_branding: {
        Row: {
          agency_name: string | null
          brand_color: string | null
          color_charcoal: string | null
          color_mint_cream: string | null
          color_prussian: string | null
          color_royal_gold: string | null
          color_watermelon: string | null
          color_status_success: string | null
          color_status_warning: string | null
          color_status_info: string | null
          color_status_danger: string | null
          color_status_neutral: string | null
          currency: string | null
          favicon_url: string | null
          id: number | null
          logo_url: string | null
          logo_url_dark: string | null
        }
        Insert: {
          agency_name?: string | null
          brand_color?: string | null
          color_charcoal?: string | null
          color_mint_cream?: string | null
          color_prussian?: string | null
          color_royal_gold?: string | null
          color_watermelon?: string | null
          color_status_success?: string | null
          color_status_warning?: string | null
          color_status_info?: string | null
          color_status_danger?: string | null
          color_status_neutral?: string | null
          currency?: string | null
          favicon_url?: string | null
          id?: number | null
          logo_url?: string | null
          logo_url_dark?: string | null
        }
        Update: {
          agency_name?: string | null
          brand_color?: string | null
          color_charcoal?: string | null
          color_mint_cream?: string | null
          color_prussian?: string | null
          color_royal_gold?: string | null
          color_watermelon?: string | null
          color_status_success?: string | null
          color_status_warning?: string | null
          color_status_info?: string | null
          color_status_danger?: string | null
          color_status_neutral?: string | null
          currency?: string | null
          favicon_url?: string | null
          id?: number | null
          logo_url?: string | null
          logo_url_dark?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      bootstrap_first_owner: { Args: never; Returns: boolean }
      generate_payment_schedule: {
        Args: { _tenancy_id: string }
        Returns: number
      }
      get_action_queue: {
        Args: never
        Returns: {
          created_at: string
          entity_id: string
          kind: string
          label: string
          sublabel: string
          urgency: string
        }[]
      }
      get_dashboard_overview: { Args: never; Returns: Json }
      get_listing_analytics: { Args: never; Returns: Json }
      get_payment_summary: { Args: never; Returns: Json }
      get_rental_funnel: { Args: never; Returns: Json }
      get_tenant_home: { Args: never; Returns: Json }
      get_tenant_journey: { Args: { _tenancy_id: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "owner" | "agent" | "tenant"
      application_status:
        | "submitted"
        | "docs_review"
        | "contract_sent"
        | "approved"
        | "rejected"
        | "withdrawn"
      document_type:
        | "emirates_id"
        | "passport"
        | "visa"
        | "salary_certificate"
        | "bank_statement"
        | "trade_license"
        | "other"
      payment_method: "cheque" | "bank_transfer" | "card" | "cash" | "stripe"
      payment_status:
        | "scheduled"
        | "pending"
        | "cleared"
        | "bounced"
        | "paid"
        | "refunded"
        | "cancelled"
      payment_type:
        | "rent"
        | "security_deposit"
        | "agency_fee"
        | "ejari_fee"
        | "dewa_deposit"
        | "chiller_deposit"
        | "other"
      property_status:
        | "draft"
        | "available"
        | "reserved"
        | "rented"
        | "off_market"
      property_type:
        | "apartment"
        | "villa"
        | "townhouse"
        | "penthouse"
        | "studio"
        | "office"
        | "retail"
      renewal_status:
        | "pending"
        | "offered"
        | "accepted"
        | "declined"
        | "expired"
      tenancy_status:
        | "upcoming"
        | "active"
        | "notice_given"
        | "ended"
        | "terminated"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      ticket_status:
        | "open"
        | "in_progress"
        | "awaiting_tenant"
        | "resolved"
        | "closed"
      viewing_status:
        | "requested"
        | "confirmed"
        | "completed"
        | "no_show"
        | "cancelled"
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
      app_role: ["owner", "agent", "tenant"],
      application_status: [
        "submitted",
        "docs_review",
        "contract_sent",
        "approved",
        "rejected",
        "withdrawn",
      ],
      document_type: [
        "emirates_id",
        "passport",
        "visa",
        "salary_certificate",
        "bank_statement",
        "trade_license",
        "other",
      ],
      payment_method: ["cheque", "bank_transfer", "card", "cash", "stripe"],
      payment_status: [
        "scheduled",
        "pending",
        "cleared",
        "bounced",
        "paid",
        "refunded",
        "cancelled",
      ],
      payment_type: [
        "rent",
        "security_deposit",
        "agency_fee",
        "ejari_fee",
        "dewa_deposit",
        "chiller_deposit",
        "other",
      ],
      property_status: [
        "draft",
        "available",
        "reserved",
        "rented",
        "off_market",
      ],
      property_type: [
        "apartment",
        "villa",
        "townhouse",
        "penthouse",
        "studio",
        "office",
        "retail",
      ],
      renewal_status: ["pending", "offered", "accepted", "declined", "expired"],
      tenancy_status: [
        "upcoming",
        "active",
        "notice_given",
        "ended",
        "terminated",
      ],
      ticket_priority: ["low", "medium", "high", "urgent"],
      ticket_status: [
        "open",
        "in_progress",
        "awaiting_tenant",
        "resolved",
        "closed",
      ],
      viewing_status: [
        "requested",
        "confirmed",
        "completed",
        "no_show",
        "cancelled",
      ],
    },
  },
} as const
