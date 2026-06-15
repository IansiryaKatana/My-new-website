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
      accommodation_rooms: {
        Row: {
          accommodation_id: string
          capacity: number
          created_at: string
          floor: string | null
          id: string
          notes: string | null
          room_no: string
          updated_at: string
        }
        Insert: {
          accommodation_id: string
          capacity?: number
          created_at?: string
          floor?: string | null
          id?: string
          notes?: string | null
          room_no: string
          updated_at?: string
        }
        Update: {
          accommodation_id?: string
          capacity?: number
          created_at?: string
          floor?: string | null
          id?: string
          notes?: string | null
          room_no?: string
          updated_at?: string
        }
        Relationships: []
      }
      accommodations: {
        Row: {
          address: string | null
          building_type: string | null
          city: string | null
          created_at: string
          emirate: string | null
          id: string
          is_active: boolean
          monthly_rent: number | null
          name: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          building_type?: string | null
          city?: string | null
          created_at?: string
          emirate?: string | null
          id?: string
          is_active?: boolean
          monthly_rent?: number | null
          name: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          building_type?: string | null
          city?: string | null
          created_at?: string
          emirate?: string | null
          id?: string
          is_active?: boolean
          monthly_rent?: number | null
          name?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      airport_pickups: {
        Row: {
          accommodation_id: string | null
          airline: string | null
          arrival_at: string
          candidate_id: string | null
          checklist: Json | null
          created_at: string
          created_by: string | null
          driver_id: string | null
          flight_no: string | null
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["pickup_status"]
          terminal: string | null
          updated_at: string
          vehicle_id: string | null
          worker_id: string | null
        }
        Insert: {
          accommodation_id?: string | null
          airline?: string | null
          arrival_at: string
          candidate_id?: string | null
          checklist?: Json | null
          created_at?: string
          created_by?: string | null
          driver_id?: string | null
          flight_no?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["pickup_status"]
          terminal?: string | null
          updated_at?: string
          vehicle_id?: string | null
          worker_id?: string | null
        }
        Update: {
          accommodation_id?: string | null
          airline?: string | null
          arrival_at?: string
          candidate_id?: string | null
          checklist?: Json | null
          created_at?: string
          created_by?: string | null
          driver_id?: string | null
          flight_no?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["pickup_status"]
          terminal?: string | null
          updated_at?: string
          vehicle_id?: string | null
          worker_id?: string | null
        }
        Relationships: []
      }
      asset_issuances: {
        Row: {
          acknowledged: boolean
          category: string | null
          created_at: string
          deduction_amount: number | null
          id: string
          issue_date: string
          issued_by: string | null
          item_name: string
          notes: string | null
          quantity: number
          return_date: string | null
          size: string | null
          status: Database["public"]["Enums"]["asset_status"]
          updated_at: string
          worker_id: string
        }
        Insert: {
          acknowledged?: boolean
          category?: string | null
          created_at?: string
          deduction_amount?: number | null
          id?: string
          issue_date?: string
          issued_by?: string | null
          item_name: string
          notes?: string | null
          quantity?: number
          return_date?: string | null
          size?: string | null
          status?: Database["public"]["Enums"]["asset_status"]
          updated_at?: string
          worker_id: string
        }
        Update: {
          acknowledged?: boolean
          category?: string | null
          created_at?: string
          deduction_amount?: number | null
          id?: string
          issue_date?: string
          issued_by?: string | null
          item_name?: string
          notes?: string | null
          quantity?: number
          return_date?: string | null
          size?: string | null
          status?: Database["public"]["Enums"]["asset_status"]
          updated_at?: string
          worker_id?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          created_at: string
          date: string
          hours: number | null
          id: string
          location: string | null
          notes: string | null
          overtime_hours: number | null
          placement_id: string | null
          recorded_by: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          updated_at: string
          worker_id: string
        }
        Insert: {
          created_at?: string
          date: string
          hours?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          overtime_hours?: number | null
          placement_id?: string | null
          recorded_by?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          updated_at?: string
          worker_id: string
        }
        Update: {
          created_at?: string
          date?: string
          hours?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          overtime_hours?: number | null
          placement_id?: string | null
          recorded_by?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          updated_at?: string
          worker_id?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      bed_assignments: {
        Row: {
          bed_no: string | null
          check_in: string
          check_out: string | null
          created_at: string
          id: string
          is_active: boolean
          notes: string | null
          room_id: string
          updated_at: string
          worker_id: string
        }
        Insert: {
          bed_no?: string | null
          check_in?: string
          check_out?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          room_id: string
          updated_at?: string
          worker_id: string
        }
        Update: {
          bed_no?: string | null
          check_in?: string
          check_out?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          room_id?: string
          updated_at?: string
          worker_id?: string
        }
        Relationships: []
      }
      branding_settings: {
        Row: {
          accent_color: string
          background_color: string
          company_name: string
          favicon_url: string | null
          font_display_family: string
          font_family: string
          font_weights: string
          foreground_color: string
          id: string
          is_active: boolean
          logo_dark_url: string | null
          logo_url: string | null
          primary_color: string
          short_name: string
          singleton: boolean
          support_email: string | null
          support_phone: string | null
          tagline: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          accent_color?: string
          background_color?: string
          company_name?: string
          favicon_url?: string | null
          font_display_family?: string
          font_family?: string
          font_weights?: string
          foreground_color?: string
          id?: string
          is_active?: boolean
          logo_dark_url?: string | null
          logo_url?: string | null
          primary_color?: string
          short_name?: string
          singleton?: boolean
          support_email?: string | null
          support_phone?: string | null
          tagline?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          accent_color?: string
          background_color?: string
          company_name?: string
          favicon_url?: string | null
          font_display_family?: string
          font_family?: string
          font_weights?: string
          foreground_color?: string
          id?: string
          is_active?: boolean
          logo_dark_url?: string | null
          logo_url?: string | null
          primary_color?: string
          short_name?: string
          singleton?: boolean
          support_email?: string | null
          support_phone?: string | null
          tagline?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      candidate_documents: {
        Row: {
          candidate_id: string
          created_at: string
          doc_type: string
          expiry_date: string | null
          file_name: string | null
          file_path: string
          id: string
          mime_type: string | null
          size_bytes: number | null
          uploaded_by: string | null
        }
        Insert: {
          candidate_id: string
          created_at?: string
          doc_type: string
          expiry_date?: string | null
          file_name?: string | null
          file_path: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          uploaded_by?: string | null
        }
        Update: {
          candidate_id?: string
          created_at?: string
          doc_type?: string
          expiry_date?: string | null
          file_name?: string | null
          file_path?: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_documents_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          agent_id: string | null
          assigned_recruiter_id: string | null
          avatar_url: string | null
          created_at: string
          created_by: string | null
          current_city: string | null
          current_country: string | null
          current_salary: number | null
          cv_url: string | null
          date_of_birth: string | null
          email: string | null
          expected_salary: number | null
          full_name: string
          gender: string | null
          id: string
          job_order_id: string | null
          languages: string[] | null
          marital_status: string | null
          nationality: string | null
          notes: string | null
          notice_period_days: number | null
          passport_expiry: string | null
          passport_no: string | null
          phone: string | null
          rating: number | null
          reference: string | null
          religion: string | null
          skills: string[] | null
          source: string | null
          status: Database["public"]["Enums"]["candidate_status"]
          updated_at: string
          whatsapp: string | null
          years_experience: number | null
        }
        Insert: {
          agent_id?: string | null
          assigned_recruiter_id?: string | null
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          current_city?: string | null
          current_country?: string | null
          current_salary?: number | null
          cv_url?: string | null
          date_of_birth?: string | null
          email?: string | null
          expected_salary?: number | null
          full_name: string
          gender?: string | null
          id?: string
          job_order_id?: string | null
          languages?: string[] | null
          marital_status?: string | null
          nationality?: string | null
          notes?: string | null
          notice_period_days?: number | null
          passport_expiry?: string | null
          passport_no?: string | null
          phone?: string | null
          rating?: number | null
          reference?: string | null
          religion?: string | null
          skills?: string[] | null
          source?: string | null
          status?: Database["public"]["Enums"]["candidate_status"]
          updated_at?: string
          whatsapp?: string | null
          years_experience?: number | null
        }
        Update: {
          agent_id?: string | null
          assigned_recruiter_id?: string | null
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          current_city?: string | null
          current_country?: string | null
          current_salary?: number | null
          cv_url?: string | null
          date_of_birth?: string | null
          email?: string | null
          expected_salary?: number | null
          full_name?: string
          gender?: string | null
          id?: string
          job_order_id?: string | null
          languages?: string[] | null
          marital_status?: string | null
          nationality?: string | null
          notes?: string | null
          notice_period_days?: number | null
          passport_expiry?: string | null
          passport_no?: string | null
          phone?: string | null
          rating?: number | null
          reference?: string | null
          religion?: string | null
          skills?: string[] | null
          source?: string | null
          status?: Database["public"]["Enums"]["candidate_status"]
          updated_at?: string
          whatsapp?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_assigned_recruiter_id_fkey"
            columns: ["assigned_recruiter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidates_job_order_id_fkey"
            columns: ["job_order_id"]
            isOneToOne: false
            referencedRelation: "job_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contacts: {
        Row: {
          client_id: string
          created_at: string
          email: string | null
          id: string
          is_primary: boolean
          name: string
          phone: string | null
          role_title: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean
          name: string
          phone?: string | null
          role_title?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean
          name?: string
          phone?: string | null
          role_title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          account_manager_id: string | null
          address_line: string | null
          billing_terms_days: number | null
          city: string | null
          country: string | null
          created_at: string
          created_by: string | null
          credit_limit: number | null
          currency: string | null
          email: string | null
          emirate: string | null
          id: string
          industry: string | null
          legal_name: string
          logo_url: string | null
          notes: string | null
          phone: string | null
          status: Database["public"]["Enums"]["client_status"]
          trade_license_expiry: string | null
          trade_license_no: string | null
          trade_name: string | null
          updated_at: string
          vat_number: string | null
          website: string | null
        }
        Insert: {
          account_manager_id?: string | null
          address_line?: string | null
          billing_terms_days?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          credit_limit?: number | null
          currency?: string | null
          email?: string | null
          emirate?: string | null
          id?: string
          industry?: string | null
          legal_name: string
          logo_url?: string | null
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          trade_license_expiry?: string | null
          trade_license_no?: string | null
          trade_name?: string | null
          updated_at?: string
          vat_number?: string | null
          website?: string | null
        }
        Update: {
          account_manager_id?: string | null
          address_line?: string | null
          billing_terms_days?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          credit_limit?: number | null
          currency?: string | null
          email?: string | null
          emirate?: string | null
          id?: string
          industry?: string | null
          legal_name?: string
          logo_url?: string | null
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          trade_license_expiry?: string | null
          trade_license_no?: string | null
          trade_name?: string | null
          updated_at?: string
          vat_number?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_account_manager_id_fkey"
            columns: ["account_manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_logs: {
        Row: {
          attachment_url: string | null
          body: string | null
          candidate_id: string | null
          channel: Database["public"]["Enums"]["comm_channel"]
          client_id: string | null
          contacted_at: string
          created_at: string
          created_by: string | null
          direction: Database["public"]["Enums"]["comm_direction"]
          id: string
          subject: string | null
          worker_id: string | null
        }
        Insert: {
          attachment_url?: string | null
          body?: string | null
          candidate_id?: string | null
          channel: Database["public"]["Enums"]["comm_channel"]
          client_id?: string | null
          contacted_at?: string
          created_at?: string
          created_by?: string | null
          direction?: Database["public"]["Enums"]["comm_direction"]
          id?: string
          subject?: string | null
          worker_id?: string | null
        }
        Update: {
          attachment_url?: string | null
          body?: string | null
          candidate_id?: string | null
          channel?: Database["public"]["Enums"]["comm_channel"]
          client_id?: string | null
          contacted_at?: string
          created_at?: string
          created_by?: string | null
          direction?: Database["public"]["Enums"]["comm_direction"]
          id?: string
          subject?: string | null
          worker_id?: string | null
        }
        Relationships: []
      }
      contract_documents: {
        Row: {
          body: string | null
          client_id: string | null
          created_at: string
          created_by: string | null
          doc_type: Database["public"]["Enums"]["contract_doc_type"]
          id: string
          issued_date: string | null
          pdf_url: string | null
          signed: boolean
          signed_url: string | null
          title: string
          updated_at: string
          worker_id: string | null
        }
        Insert: {
          body?: string | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          doc_type: Database["public"]["Enums"]["contract_doc_type"]
          id?: string
          issued_date?: string | null
          pdf_url?: string | null
          signed?: boolean
          signed_url?: string | null
          title: string
          updated_at?: string
          worker_id?: string | null
        }
        Update: {
          body?: string | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          doc_type?: Database["public"]["Enums"]["contract_doc_type"]
          id?: string
          issued_date?: string | null
          pdf_url?: string | null
          signed?: boolean
          signed_url?: string | null
          title?: string
          updated_at?: string
          worker_id?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: Database["public"]["Enums"]["doc_category"]
          created_at: string
          expiry_date: string | null
          file_name: string | null
          file_path: string
          id: string
          issue_date: string | null
          mime_type: string | null
          notes: string | null
          size_bytes: number | null
          title: string | null
          updated_at: string
          uploaded_by: string | null
          worker_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["doc_category"]
          created_at?: string
          expiry_date?: string | null
          file_name?: string | null
          file_path: string
          id?: string
          issue_date?: string | null
          mime_type?: string | null
          notes?: string | null
          size_bytes?: number | null
          title?: string | null
          updated_at?: string
          uploaded_by?: string | null
          worker_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["doc_category"]
          created_at?: string
          expiry_date?: string | null
          file_name?: string | null
          file_path?: string
          id?: string
          issue_date?: string | null
          mime_type?: string | null
          notes?: string | null
          size_bytes?: number | null
          title?: string | null
          updated_at?: string
          uploaded_by?: string | null
          worker_id?: string
        }
        Relationships: []
      }
      drivers: {
        Row: {
          created_at: string
          full_name: string
          id: string
          is_active: boolean
          license_expiry: string | null
          license_no: string | null
          notes: string | null
          phone: string | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          full_name: string
          id?: string
          is_active?: boolean
          license_expiry?: string | null
          license_no?: string | null
          notes?: string | null
          phone?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          is_active?: boolean
          license_expiry?: string | null
          license_no?: string | null
          notes?: string | null
          phone?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: []
      }
      incidents: {
        Row: {
          action_taken: string | null
          client_id: string | null
          created_at: string
          description: string
          id: string
          incident_type: Database["public"]["Enums"]["incident_type"]
          location: string | null
          medical_treatment: string | null
          occurred_at: string
          photos: Json | null
          police_report: string | null
          reported_by: string | null
          status: Database["public"]["Enums"]["incident_status"]
          updated_at: string
          witnesses: string | null
          worker_id: string | null
        }
        Insert: {
          action_taken?: string | null
          client_id?: string | null
          created_at?: string
          description: string
          id?: string
          incident_type?: Database["public"]["Enums"]["incident_type"]
          location?: string | null
          medical_treatment?: string | null
          occurred_at?: string
          photos?: Json | null
          police_report?: string | null
          reported_by?: string | null
          status?: Database["public"]["Enums"]["incident_status"]
          updated_at?: string
          witnesses?: string | null
          worker_id?: string | null
        }
        Update: {
          action_taken?: string | null
          client_id?: string | null
          created_at?: string
          description?: string
          id?: string
          incident_type?: Database["public"]["Enums"]["incident_type"]
          location?: string | null
          medical_treatment?: string | null
          occurred_at?: string
          photos?: Json | null
          police_report?: string | null
          reported_by?: string | null
          status?: Database["public"]["Enums"]["incident_status"]
          updated_at?: string
          witnesses?: string | null
          worker_id?: string | null
        }
        Relationships: []
      }
      internal_tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: Database["public"]["Enums"]["task_priority"]
          related_client_id: string | null
          related_job_order_id: string | null
          related_worker_id: string | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          related_client_id?: string | null
          related_job_order_id?: string | null
          related_worker_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          related_client_id?: string | null
          related_job_order_id?: string | null
          related_worker_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          category: string | null
          created_at: string
          id: string
          is_active: boolean
          low_stock_threshold: number | null
          name: string
          notes: string | null
          sku: string | null
          stock_qty: number
          supplier: string | null
          unit: string | null
          unit_cost: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          low_stock_threshold?: number | null
          name: string
          notes?: string | null
          sku?: string | null
          stock_qty?: number
          supplier?: string | null
          unit?: string | null
          unit_cost?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          low_stock_threshold?: number | null
          name?: string
          notes?: string | null
          sku?: string | null
          stock_qty?: number
          supplier?: string | null
          unit?: string | null
          unit_cost?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      inventory_transactions: {
        Row: {
          created_at: string
          id: string
          item_id: string
          notes: string | null
          quantity: number
          recorded_by: string | null
          reference: string | null
          txn_type: Database["public"]["Enums"]["inv_txn_type"]
          worker_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          notes?: string | null
          quantity: number
          recorded_by?: string | null
          reference?: string | null
          txn_type: Database["public"]["Enums"]["inv_txn_type"]
          worker_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          notes?: string | null
          quantity?: number
          recorded_by?: string | null
          reference?: string | null
          txn_type?: Database["public"]["Enums"]["inv_txn_type"]
          worker_id?: string | null
        }
        Relationships: []
      }
      invoice_lines: {
        Row: {
          amount: number
          created_at: string
          description: string
          hours: number
          id: string
          invoice_id: string
          placement_id: string | null
          rate: number
          worker_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          description: string
          hours?: number
          id?: string
          invoice_id: string
          placement_id?: string | null
          rate?: number
          worker_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          hours?: number
          id?: string
          invoice_id?: string
          placement_id?: string | null
          rate?: number
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_lines_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_lines_placement_id_fkey"
            columns: ["placement_id"]
            isOneToOne: false
            referencedRelation: "placements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_lines_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_paid: number
          client_id: string
          created_at: string
          created_by: string | null
          currency: string
          due_date: string | null
          id: string
          issue_date: string
          notes: string | null
          period_end: string | null
          period_start: string | null
          reference: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal: number
          total: number
          updated_at: string
          vat_amount: number
          vat_rate: number
        }
        Insert: {
          amount_paid?: number
          client_id: string
          created_at?: string
          created_by?: string | null
          currency?: string
          due_date?: string | null
          id?: string
          issue_date?: string
          notes?: string | null
          period_end?: string | null
          period_start?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          total?: number
          updated_at?: string
          vat_amount?: number
          vat_rate?: number
        }
        Update: {
          amount_paid?: number
          client_id?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          due_date?: string | null
          id?: string
          issue_date?: string
          notes?: string | null
          period_end?: string | null
          period_start?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          total?: number
          updated_at?: string
          vat_amount?: number
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_comments: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          issue_id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          issue_id: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          issue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_comments_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      issues: {
        Row: {
          assigned_to: string | null
          category: Database["public"]["Enums"]["issue_category"]
          created_at: string
          description: string | null
          id: string
          reported_by: string | null
          resolution: string | null
          resolved_at: string | null
          severity: Database["public"]["Enums"]["issue_severity"]
          status: Database["public"]["Enums"]["issue_status"]
          title: string
          updated_at: string
          worker_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          category?: Database["public"]["Enums"]["issue_category"]
          created_at?: string
          description?: string | null
          id?: string
          reported_by?: string | null
          resolution?: string | null
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["issue_severity"]
          status?: Database["public"]["Enums"]["issue_status"]
          title: string
          updated_at?: string
          worker_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: Database["public"]["Enums"]["issue_category"]
          created_at?: string
          description?: string | null
          id?: string
          reported_by?: string | null
          resolution?: string | null
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["issue_severity"]
          status?: Database["public"]["Enums"]["issue_status"]
          title?: string
          updated_at?: string
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issues_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      job_orders: {
        Row: {
          account_manager_id: string | null
          bill_rate: number | null
          category: string | null
          client_id: string
          contract_type: Database["public"]["Enums"]["contract_type"] | null
          created_at: string
          created_by: string | null
          currency: string | null
          description: string | null
          emirate: string | null
          end_date: string | null
          filled_count: number
          id: string
          location: string | null
          pay_rate: number | null
          priority: Database["public"]["Enums"]["job_priority"] | null
          quantity: number
          recruiter_id: string | null
          reference: string | null
          requirements: Json | null
          sla_days: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["job_order_status"]
          title: string
          updated_at: string
          working_hours_per_day: number | null
        }
        Insert: {
          account_manager_id?: string | null
          bill_rate?: number | null
          category?: string | null
          client_id: string
          contract_type?: Database["public"]["Enums"]["contract_type"] | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          description?: string | null
          emirate?: string | null
          end_date?: string | null
          filled_count?: number
          id?: string
          location?: string | null
          pay_rate?: number | null
          priority?: Database["public"]["Enums"]["job_priority"] | null
          quantity?: number
          recruiter_id?: string | null
          reference?: string | null
          requirements?: Json | null
          sla_days?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["job_order_status"]
          title: string
          updated_at?: string
          working_hours_per_day?: number | null
        }
        Update: {
          account_manager_id?: string | null
          bill_rate?: number | null
          category?: string | null
          client_id?: string
          contract_type?: Database["public"]["Enums"]["contract_type"] | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          description?: string | null
          emirate?: string | null
          end_date?: string | null
          filled_count?: number
          id?: string
          location?: string | null
          pay_rate?: number | null
          priority?: Database["public"]["Enums"]["job_priority"] | null
          quantity?: number
          recruiter_id?: string | null
          reference?: string | null
          requirements?: Json | null
          sla_days?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["job_order_status"]
          title?: string
          updated_at?: string
          working_hours_per_day?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "job_orders_account_manager_id_fkey"
            columns: ["account_manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_orders_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          created_at: string
          days: number
          decided_at: string | null
          decided_by: string | null
          decision_note: string | null
          end_date: string
          id: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason: string | null
          start_date: string
          status: Database["public"]["Enums"]["leave_status"]
          updated_at: string
          worker_id: string
        }
        Insert: {
          created_at?: string
          days?: number
          decided_at?: string | null
          decided_by?: string | null
          decision_note?: string | null
          end_date: string
          id?: string
          leave_type?: Database["public"]["Enums"]["leave_type"]
          reason?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["leave_status"]
          updated_at?: string
          worker_id: string
        }
        Update: {
          created_at?: string
          days?: number
          decided_at?: string | null
          decided_by?: string | null
          decision_note?: string | null
          end_date?: string
          id?: string
          leave_type?: Database["public"]["Enums"]["leave_type"]
          reason?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["leave_status"]
          updated_at?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          appointment_at: string | null
          assigned_pro: string | null
          certificate_url: string | null
          cost: number | null
          created_at: string
          created_by: string | null
          id: string
          medical_center: string | null
          notes: string | null
          result_date: string | null
          status: Database["public"]["Enums"]["medical_status"]
          transport_pickup: string | null
          updated_at: string
          worker_id: string
        }
        Insert: {
          appointment_at?: string | null
          assigned_pro?: string | null
          certificate_url?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          medical_center?: string | null
          notes?: string | null
          result_date?: string | null
          status?: Database["public"]["Enums"]["medical_status"]
          transport_pickup?: string | null
          updated_at?: string
          worker_id: string
        }
        Update: {
          appointment_at?: string | null
          assigned_pro?: string | null
          certificate_url?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          medical_center?: string | null
          notes?: string | null
          result_date?: string | null
          status?: Database["public"]["Enums"]["medical_status"]
          transport_pickup?: string | null
          updated_at?: string
          worker_id?: string
        }
        Relationships: []
      }
      message_templates: {
        Row: {
          body: string
          category: string | null
          channel: Database["public"]["Enums"]["comm_channel"]
          created_at: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          body: string
          category?: string | null
          channel?: Database["public"]["Enums"]["comm_channel"]
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          body?: string
          category?: string | null
          channel?: Database["public"]["Enums"]["comm_channel"]
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          category: string
          created_at: string
          id: string
          link: string | null
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          category?: string
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          category?: string
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          method: string | null
          notes: string | null
          paid_on: string
          recorded_by: string | null
          reference: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id: string
          method?: string | null
          notes?: string | null
          paid_on?: string
          recorded_by?: string | null
          reference?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          method?: string | null
          notes?: string | null
          paid_on?: string
          recorded_by?: string | null
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      payslips: {
        Row: {
          created_at: string
          created_by: string | null
          currency: string
          deductions: number
          gross: number
          id: string
          issued_at: string | null
          line_items: Json
          net: number
          paid_at: string | null
          pdf_url: string | null
          period_month: number
          period_year: number
          status: Database["public"]["Enums"]["payslip_status"]
          updated_at: string
          worker_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          currency?: string
          deductions?: number
          gross?: number
          id?: string
          issued_at?: string | null
          line_items?: Json
          net?: number
          paid_at?: string | null
          pdf_url?: string | null
          period_month: number
          period_year: number
          status?: Database["public"]["Enums"]["payslip_status"]
          updated_at?: string
          worker_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          currency?: string
          deductions?: number
          gross?: number
          id?: string
          issued_at?: string | null
          line_items?: Json
          net?: number
          paid_at?: string | null
          pdf_url?: string | null
          period_month?: number
          period_year?: number
          status?: Database["public"]["Enums"]["payslip_status"]
          updated_at?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payslips_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      placements: {
        Row: {
          bill_rate: number | null
          client_id: string
          created_at: string
          created_by: string | null
          currency: string | null
          end_date: string | null
          id: string
          job_order_id: string
          notes: string | null
          pay_rate: number | null
          start_date: string
          status: Database["public"]["Enums"]["placement_status"]
          updated_at: string
          worker_id: string
        }
        Insert: {
          bill_rate?: number | null
          client_id: string
          created_at?: string
          created_by?: string | null
          currency?: string | null
          end_date?: string | null
          id?: string
          job_order_id: string
          notes?: string | null
          pay_rate?: number | null
          start_date: string
          status?: Database["public"]["Enums"]["placement_status"]
          updated_at?: string
          worker_id: string
        }
        Update: {
          bill_rate?: number | null
          client_id?: string
          created_at?: string
          created_by?: string | null
          currency?: string | null
          end_date?: string | null
          id?: string
          job_order_id?: string
          notes?: string | null
          pay_rate?: number | null
          start_date?: string
          status?: Database["public"]["Enums"]["placement_status"]
          updated_at?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "placements_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placements_job_order_id_fkey"
            columns: ["job_order_id"]
            isOneToOne: false
            referencedRelation: "job_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placements_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      pro_tasks: {
        Row: {
          assigned_to: string | null
          candidate_id: string | null
          client_id: string | null
          completed_at: string | null
          cost: number | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          reference_no: string | null
          status: Database["public"]["Enums"]["pro_task_status"]
          task_type: Database["public"]["Enums"]["pro_task_type"]
          title: string
          updated_at: string
          worker_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          candidate_id?: string | null
          client_id?: string | null
          completed_at?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          reference_no?: string | null
          status?: Database["public"]["Enums"]["pro_task_status"]
          task_type?: Database["public"]["Enums"]["pro_task_type"]
          title: string
          updated_at?: string
          worker_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          candidate_id?: string | null
          client_id?: string | null
          completed_at?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          reference_no?: string | null
          status?: Database["public"]["Enums"]["pro_task_status"]
          task_type?: Database["public"]["Enums"]["pro_task_type"]
          title?: string
          updated_at?: string
          worker_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean
          job_title: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean
          job_title?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          job_title?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recruitment_agents: {
        Row: {
          agreement_url: string | null
          commission_pct: number | null
          contact_person: string | null
          country: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          agreement_url?: string | null
          commission_pct?: number | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          agreement_url?: string | null
          commission_pct?: number | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      timesheets: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          client_id: string | null
          created_at: string
          currency: string | null
          id: string
          notes: string | null
          overtime_hours: number | null
          period_end: string
          period_start: string
          placement_id: string | null
          status: Database["public"]["Enums"]["timesheet_status"]
          submitted_at: string | null
          submitted_by: string | null
          total_amount: number | null
          total_hours: number | null
          updated_at: string
          worker_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          client_id?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          notes?: string | null
          overtime_hours?: number | null
          period_end: string
          period_start: string
          placement_id?: string | null
          status?: Database["public"]["Enums"]["timesheet_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          total_amount?: number | null
          total_hours?: number | null
          updated_at?: string
          worker_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          client_id?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          notes?: string | null
          overtime_hours?: number | null
          period_end?: string
          period_start?: string
          placement_id?: string | null
          status?: Database["public"]["Enums"]["timesheet_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          total_amount?: number | null
          total_hours?: number | null
          updated_at?: string
          worker_id?: string
        }
        Relationships: []
      }
      transport_routes: {
        Row: {
          client_id: string | null
          created_at: string
          driver_id: string | null
          dropoff_point: string | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          pickup_point: string | null
          shift: string | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          driver_id?: string | null
          dropoff_point?: string | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          pickup_point?: string | null
          shift?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          driver_id?: string | null
          dropoff_point?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          pickup_point?: string | null
          shift?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: []
      }
      uae_banks: {
        Row: {
          bank_code: string | null
          country: string
          created_at: string
          emirate: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          routing_code: string | null
          short_name: string | null
          swift_code: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          bank_code?: string | null
          country?: string
          created_at?: string
          emirate?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          routing_code?: string | null
          short_name?: string | null
          swift_code?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          bank_code?: string | null
          country?: string
          created_at?: string
          emirate?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          routing_code?: string | null
          short_name?: string | null
          swift_code?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
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
      vehicles: {
        Row: {
          capacity: number | null
          created_at: string
          id: string
          insurance_expiry: string | null
          is_active: boolean
          make: string | null
          model: string | null
          notes: string | null
          plate_no: string
          registration_expiry: string | null
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          id?: string
          insurance_expiry?: string | null
          is_active?: boolean
          make?: string | null
          model?: string | null
          notes?: string | null
          plate_no: string
          registration_expiry?: string | null
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          id?: string
          insurance_expiry?: string | null
          is_active?: boolean
          make?: string | null
          model?: string | null
          notes?: string | null
          plate_no?: string
          registration_expiry?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      visa_records: {
        Row: {
          assigned_pro: string | null
          completed_date: string | null
          cost: number | null
          created_at: string
          created_by: string | null
          entry_permit_no: string | null
          id: string
          notes: string | null
          reference_no: string | null
          scheduled_date: string | null
          sponsor: string | null
          stage: Database["public"]["Enums"]["visa_stage"]
          status: Database["public"]["Enums"]["visa_step_status"]
          uid_no: string | null
          updated_at: string
          visa_type: string | null
          worker_id: string
        }
        Insert: {
          assigned_pro?: string | null
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          entry_permit_no?: string | null
          id?: string
          notes?: string | null
          reference_no?: string | null
          scheduled_date?: string | null
          sponsor?: string | null
          stage: Database["public"]["Enums"]["visa_stage"]
          status?: Database["public"]["Enums"]["visa_step_status"]
          uid_no?: string | null
          updated_at?: string
          visa_type?: string | null
          worker_id: string
        }
        Update: {
          assigned_pro?: string | null
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          entry_permit_no?: string | null
          id?: string
          notes?: string | null
          reference_no?: string | null
          scheduled_date?: string | null
          sponsor?: string | null
          stage?: Database["public"]["Enums"]["visa_stage"]
          status?: Database["public"]["Enums"]["visa_step_status"]
          uid_no?: string | null
          updated_at?: string
          visa_type?: string | null
          worker_id?: string
        }
        Relationships: []
      }
      warning_letters: {
        Row: {
          acknowledged_at: string | null
          client_id: string | null
          created_at: string
          description: string | null
          evidence_url: string | null
          follow_up_date: string | null
          id: string
          incident_date: string
          issued_at: string | null
          issued_by: string | null
          pdf_url: string | null
          reason: string
          status: Database["public"]["Enums"]["warning_status"]
          updated_at: string
          warning_type: Database["public"]["Enums"]["warning_type"]
          worker_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          evidence_url?: string | null
          follow_up_date?: string | null
          id?: string
          incident_date?: string
          issued_at?: string | null
          issued_by?: string | null
          pdf_url?: string | null
          reason: string
          status?: Database["public"]["Enums"]["warning_status"]
          updated_at?: string
          warning_type?: Database["public"]["Enums"]["warning_type"]
          worker_id: string
        }
        Update: {
          acknowledged_at?: string | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          evidence_url?: string | null
          follow_up_date?: string | null
          id?: string
          incident_date?: string
          issued_at?: string | null
          issued_by?: string | null
          pdf_url?: string | null
          reason?: string
          status?: Database["public"]["Enums"]["warning_status"]
          updated_at?: string
          warning_type?: Database["public"]["Enums"]["warning_type"]
          worker_id?: string
        }
        Relationships: []
      }
      workers: {
        Row: {
          accommodation: string | null
          avatar_url: string | null
          bank_name: string | null
          base_salary: number | null
          candidate_id: string | null
          contract_end: string | null
          contract_start: string | null
          created_at: string
          created_by: string | null
          currency: string | null
          date_of_birth: string | null
          department: string | null
          designation: string | null
          email: string | null
          emirates_id: string | null
          emirates_id_expiry: string | null
          employee_code: string | null
          full_name: string
          gender: string | null
          housing_allowance: number | null
          iban: string | null
          id: string
          insurance_expiry: string | null
          joining_date: string | null
          labor_card_expiry: string | null
          labor_card_no: string | null
          medical_expiry: string | null
          nationality: string | null
          other_allowance: number | null
          passport_expiry: string | null
          passport_no: string | null
          phone: string | null
          routing_code: string | null
          shirt_size: string | null
          shoe_size: string | null
          status: Database["public"]["Enums"]["worker_status"]
          transport_allowance: number | null
          trouser_size: string | null
          updated_at: string
          user_id: string | null
          visa_expiry: string | null
          visa_number: string | null
          whatsapp: string | null
          wps_personal_id: string | null
        }
        Insert: {
          accommodation?: string | null
          avatar_url?: string | null
          bank_name?: string | null
          base_salary?: number | null
          candidate_id?: string | null
          contract_end?: string | null
          contract_start?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          date_of_birth?: string | null
          department?: string | null
          designation?: string | null
          email?: string | null
          emirates_id?: string | null
          emirates_id_expiry?: string | null
          employee_code?: string | null
          full_name: string
          gender?: string | null
          housing_allowance?: number | null
          iban?: string | null
          id?: string
          insurance_expiry?: string | null
          joining_date?: string | null
          labor_card_expiry?: string | null
          labor_card_no?: string | null
          medical_expiry?: string | null
          nationality?: string | null
          other_allowance?: number | null
          passport_expiry?: string | null
          passport_no?: string | null
          phone?: string | null
          routing_code?: string | null
          shirt_size?: string | null
          shoe_size?: string | null
          status?: Database["public"]["Enums"]["worker_status"]
          transport_allowance?: number | null
          trouser_size?: string | null
          updated_at?: string
          user_id?: string | null
          visa_expiry?: string | null
          visa_number?: string | null
          whatsapp?: string | null
          wps_personal_id?: string | null
        }
        Update: {
          accommodation?: string | null
          avatar_url?: string | null
          bank_name?: string | null
          base_salary?: number | null
          candidate_id?: string | null
          contract_end?: string | null
          contract_start?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          date_of_birth?: string | null
          department?: string | null
          designation?: string | null
          email?: string | null
          emirates_id?: string | null
          emirates_id_expiry?: string | null
          employee_code?: string | null
          full_name?: string
          gender?: string | null
          housing_allowance?: number | null
          iban?: string | null
          id?: string
          insurance_expiry?: string | null
          joining_date?: string | null
          labor_card_expiry?: string | null
          labor_card_no?: string | null
          medical_expiry?: string | null
          nationality?: string | null
          other_allowance?: number | null
          passport_expiry?: string | null
          passport_no?: string | null
          phone?: string | null
          routing_code?: string | null
          shirt_size?: string | null
          shoe_size?: string | null
          status?: Database["public"]["Enums"]["worker_status"]
          transport_allowance?: number | null
          trouser_size?: string | null
          updated_at?: string
          user_id?: string | null
          visa_expiry?: string | null
          visa_number?: string | null
          whatsapp?: string | null
          wps_personal_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workers_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_client_margin: {
        Args: { _from: string; _to: string }
        Returns: {
          client_id: string
          client_name: string
          cost: number
          margin: number
          margin_pct: number
          revenue: number
        }[]
      }
      get_compliance_expiries: {
        Args: { _days_ahead?: number }
        Returns: {
          category: string
          days_remaining: number
          employee_code: string
          expiry_date: string
          worker_id: string
          worker_name: string
        }[]
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      search_staff: {
        Args: {
          _active_only?: boolean
          _limit?: number
          _q?: string
          _role?: Database["public"]["Enums"]["app_role"]
        }
        Returns: {
          avatar_url: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          job_title: string
          phone: string
          roles: string[]
        }[]
      }
      search_uae_banks: {
        Args: { _active_only?: boolean; _limit?: number; _q?: string }
        Returns: {
          bank_code: string
          emirate: string
          id: string
          logo_url: string
          name: string
          routing_code: string
          short_name: string
          swift_code: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      app_role:
        | "admin"
        | "manager"
        | "recruiter"
        | "accountant"
        | "worker"
        | "client"
      asset_status: "issued" | "returned" | "lost" | "damaged"
      attendance_status:
        | "present"
        | "absent"
        | "leave"
        | "sick"
        | "holiday"
        | "off"
      candidate_status:
        | "new"
        | "screening"
        | "shortlisted"
        | "interviewing"
        | "offered"
        | "hired"
        | "rejected"
        | "withdrawn"
        | "blacklisted"
      client_status:
        | "prospect"
        | "active"
        | "on_hold"
        | "inactive"
        | "blacklisted"
      comm_channel:
        | "whatsapp"
        | "sms"
        | "email"
        | "phone"
        | "in_person"
        | "other"
      comm_direction: "inbound" | "outbound"
      contract_doc_type:
        | "offer_letter"
        | "employment_contract"
        | "noc"
        | "salary_certificate"
        | "experience_certificate"
        | "termination_letter"
        | "visa_cancellation"
        | "deployment_letter"
        | "warning_letter"
        | "other"
      contract_type:
        | "limited"
        | "unlimited"
        | "part_time"
        | "project"
        | "seasonal"
      doc_category:
        | "passport"
        | "visa"
        | "emirates_id"
        | "labor_card"
        | "medical"
        | "insurance"
        | "contract"
        | "certificate"
        | "other"
      incident_status:
        | "open"
        | "investigating"
        | "resolved"
        | "escalated"
        | "closed"
      incident_type:
        | "injury"
        | "accident"
        | "damage"
        | "theft"
        | "fight"
        | "misconduct"
        | "site_accident"
        | "transport_accident"
        | "accommodation"
        | "other"
      inv_txn_type: "in" | "out" | "adjust" | "return" | "damage"
      invoice_status: "draft" | "sent" | "partial" | "paid" | "overdue" | "void"
      issue_category:
        | "welfare"
        | "accommodation"
        | "transport"
        | "payroll"
        | "safety"
        | "hr"
        | "other"
      issue_severity: "low" | "medium" | "high" | "critical"
      issue_status: "open" | "in_progress" | "resolved" | "closed"
      job_order_status:
        | "draft"
        | "open"
        | "in_progress"
        | "partially_filled"
        | "filled"
        | "on_hold"
        | "cancelled"
        | "closed"
      job_priority: "low" | "normal" | "high" | "urgent"
      leave_status: "pending" | "approved" | "rejected" | "cancelled"
      leave_type:
        | "annual"
        | "sick"
        | "unpaid"
        | "emergency"
        | "maternity"
        | "paternity"
        | "other"
      medical_status:
        | "required"
        | "booked"
        | "attended"
        | "missed"
        | "passed"
        | "failed"
        | "retest"
        | "certified"
      payslip_status: "draft" | "issued" | "paid"
      pickup_status:
        | "pending"
        | "arranged"
        | "completed"
        | "missed"
        | "cancelled"
      placement_status:
        | "proposed"
        | "confirmed"
        | "active"
        | "completed"
        | "terminated"
        | "cancelled"
      pro_task_status:
        | "open"
        | "in_progress"
        | "submitted"
        | "on_hold"
        | "done"
        | "cancelled"
      pro_task_type:
        | "quota_request"
        | "work_permit"
        | "offer_letter"
        | "entry_permit"
        | "status_change"
        | "medical_booking"
        | "emirates_id"
        | "visa_stamping"
        | "labour_card"
        | "insurance"
        | "visa_renewal"
        | "visa_cancellation"
        | "absconding"
        | "fine_check"
        | "document_collection"
        | "other"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "todo" | "in_progress" | "blocked" | "done" | "cancelled"
      timesheet_status: "draft" | "submitted" | "approved" | "rejected" | "paid"
      visa_stage:
        | "offer_accepted"
        | "documents_collected"
        | "entry_permit"
        | "status_change"
        | "medical_booked"
        | "medical_done"
        | "emirates_id"
        | "visa_stamping"
        | "labour_contract"
        | "activated"
        | "renewal_pending"
        | "cancellation"
        | "cancelled"
      visa_step_status:
        | "pending"
        | "in_progress"
        | "done"
        | "failed"
        | "skipped"
      warning_status:
        | "draft"
        | "issued"
        | "acknowledged"
        | "disputed"
        | "closed"
      warning_type:
        | "verbal"
        | "first_written"
        | "second_written"
        | "final"
        | "suspension"
        | "termination"
        | "absconding"
        | "performance"
      worker_status:
        | "onboarding"
        | "active"
        | "on_leave"
        | "suspended"
        | "terminated"
        | "absconded"
        | "exited"
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
      app_role: [
        "admin",
        "manager",
        "recruiter",
        "accountant",
        "worker",
        "client",
      ],
      asset_status: ["issued", "returned", "lost", "damaged"],
      attendance_status: [
        "present",
        "absent",
        "leave",
        "sick",
        "holiday",
        "off",
      ],
      candidate_status: [
        "new",
        "screening",
        "shortlisted",
        "interviewing",
        "offered",
        "hired",
        "rejected",
        "withdrawn",
        "blacklisted",
      ],
      client_status: [
        "prospect",
        "active",
        "on_hold",
        "inactive",
        "blacklisted",
      ],
      comm_channel: ["whatsapp", "sms", "email", "phone", "in_person", "other"],
      comm_direction: ["inbound", "outbound"],
      contract_doc_type: [
        "offer_letter",
        "employment_contract",
        "noc",
        "salary_certificate",
        "experience_certificate",
        "termination_letter",
        "visa_cancellation",
        "deployment_letter",
        "warning_letter",
        "other",
      ],
      contract_type: [
        "limited",
        "unlimited",
        "part_time",
        "project",
        "seasonal",
      ],
      doc_category: [
        "passport",
        "visa",
        "emirates_id",
        "labor_card",
        "medical",
        "insurance",
        "contract",
        "certificate",
        "other",
      ],
      incident_status: [
        "open",
        "investigating",
        "resolved",
        "escalated",
        "closed",
      ],
      incident_type: [
        "injury",
        "accident",
        "damage",
        "theft",
        "fight",
        "misconduct",
        "site_accident",
        "transport_accident",
        "accommodation",
        "other",
      ],
      inv_txn_type: ["in", "out", "adjust", "return", "damage"],
      invoice_status: ["draft", "sent", "partial", "paid", "overdue", "void"],
      issue_category: [
        "welfare",
        "accommodation",
        "transport",
        "payroll",
        "safety",
        "hr",
        "other",
      ],
      issue_severity: ["low", "medium", "high", "critical"],
      issue_status: ["open", "in_progress", "resolved", "closed"],
      job_order_status: [
        "draft",
        "open",
        "in_progress",
        "partially_filled",
        "filled",
        "on_hold",
        "cancelled",
        "closed",
      ],
      job_priority: ["low", "normal", "high", "urgent"],
      leave_status: ["pending", "approved", "rejected", "cancelled"],
      leave_type: [
        "annual",
        "sick",
        "unpaid",
        "emergency",
        "maternity",
        "paternity",
        "other",
      ],
      medical_status: [
        "required",
        "booked",
        "attended",
        "missed",
        "passed",
        "failed",
        "retest",
        "certified",
      ],
      payslip_status: ["draft", "issued", "paid"],
      pickup_status: [
        "pending",
        "arranged",
        "completed",
        "missed",
        "cancelled",
      ],
      placement_status: [
        "proposed",
        "confirmed",
        "active",
        "completed",
        "terminated",
        "cancelled",
      ],
      pro_task_status: [
        "open",
        "in_progress",
        "submitted",
        "on_hold",
        "done",
        "cancelled",
      ],
      pro_task_type: [
        "quota_request",
        "work_permit",
        "offer_letter",
        "entry_permit",
        "status_change",
        "medical_booking",
        "emirates_id",
        "visa_stamping",
        "labour_card",
        "insurance",
        "visa_renewal",
        "visa_cancellation",
        "absconding",
        "fine_check",
        "document_collection",
        "other",
      ],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["todo", "in_progress", "blocked", "done", "cancelled"],
      timesheet_status: ["draft", "submitted", "approved", "rejected", "paid"],
      visa_stage: [
        "offer_accepted",
        "documents_collected",
        "entry_permit",
        "status_change",
        "medical_booked",
        "medical_done",
        "emirates_id",
        "visa_stamping",
        "labour_contract",
        "activated",
        "renewal_pending",
        "cancellation",
        "cancelled",
      ],
      visa_step_status: ["pending", "in_progress", "done", "failed", "skipped"],
      warning_status: ["draft", "issued", "acknowledged", "disputed", "closed"],
      warning_type: [
        "verbal",
        "first_written",
        "second_written",
        "final",
        "suspension",
        "termination",
        "absconding",
        "performance",
      ],
      worker_status: [
        "onboarding",
        "active",
        "on_leave",
        "suspended",
        "terminated",
        "absconded",
        "exited",
      ],
    },
  },
} as const
