export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';
export type RoomStatus = 'available' | 'occupied' | 'maintenance';
export type ContractStatus = 'active' | 'ended' | 'cancelled';
export type InvoiceStatus = 'unpaid' | 'paid' | 'overdue';
export type MaintenanceCategory = 'Listrik' | 'Air' | 'AC' | 'Kunci' | 'Bangunan' | 'Lainnya';
export type MaintenanceStatus = 'pending' | 'in_progress' | 'resolved';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          full_name: string;
          company_name: string | null;
          email: string;
          phone_number: string | null;
          subscription_plan: SubscriptionPlan;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          company_name?: string | null;
          email: string;
          phone_number?: string | null;
          subscription_plan?: SubscriptionPlan;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          company_name?: string | null;
          email?: string;
          phone_number?: string | null;
          subscription_plan?: SubscriptionPlan;
          created_at?: string;
        };
        Relationships: [];
      };
      properties: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          address: string | null;
          total_rooms: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          address?: string | null;
          total_rooms?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          address?: string | null;
          total_rooms?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "properties_tenant_id_fkey";
            columns: ["tenant_id"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          }
        ];
      };
      rooms: {
        Row: {
          id: string;
          property_id: string;
          tenant_id: string;
          room_number: string;
          room_type: string | null;
          base_price: number;
          status: RoomStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          tenant_id: string;
          room_number: string;
          room_type?: string | null;
          base_price: number;
          status?: RoomStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          tenant_id?: string;
          room_number?: string;
          room_type?: string | null;
          base_price?: number;
          status?: RoomStatus;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rooms_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rooms_tenant_id_fkey";
            columns: ["tenant_id"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          }
        ];
      };
      renters: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string | null;
          full_name: string;
          whatsapp_number: string;
          id_card_number: string | null;
          id_card_url: string | null;
          emergency_contact: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id?: string | null;
          full_name: string;
          whatsapp_number: string;
          id_card_number?: string | null;
          id_card_url?: string | null;
          emergency_contact?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          user_id?: string | null;
          full_name?: string;
          whatsapp_number?: string;
          id_card_number?: string | null;
          id_card_url?: string | null;
          emergency_contact?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "renters_tenant_id_fkey";
            columns: ["tenant_id"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          }
        ];
      };
      contracts: {
        Row: {
          id: string;
          tenant_id: string;
          room_id: string;
          renter_id: string;
          start_date: string;
          end_date: string | null;
          deposit_amount: number;
          status: ContractStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          room_id: string;
          renter_id: string;
          start_date: string;
          end_date?: string | null;
          deposit_amount?: number;
          status?: ContractStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          room_id?: string;
          renter_id?: string;
          start_date?: string;
          end_date?: string | null;
          deposit_amount?: number;
          status?: ContractStatus;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "contracts_tenant_id_fkey";
            columns: ["tenant_id"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "contracts_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "contracts_renter_id_fkey";
            columns: ["renter_id"];
            isOneToOne: false;
            referencedRelation: "renters";
            referencedColumns: ["id"];
          }
        ];
      };
      invoices: {
        Row: {
          id: string;
          tenant_id: string;
          contract_id: string;
          billing_month: string;
          room_fee: number;
          additional_fee: number;
          penalty_fee: number;
          total_amount: number;
          due_date: string;
          status: InvoiceStatus;
          payment_proof_url: string | null;
          paid_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          contract_id: string;
          billing_month: string;
          room_fee: number;
          additional_fee?: number;
          penalty_fee?: number;
          total_amount: number;
          due_date: string;
          status?: InvoiceStatus;
          payment_proof_url?: string | null;
          paid_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          contract_id?: string;
          billing_month?: string;
          room_fee?: number;
          additional_fee?: number;
          penalty_fee?: number;
          total_amount?: number;
          due_date?: string;
          status?: InvoiceStatus;
          payment_proof_url?: string | null;
          paid_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_tenant_id_fkey";
            columns: ["tenant_id"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_contract_id_fkey";
            columns: ["contract_id"];
            isOneToOne: false;
            referencedRelation: "contracts";
            referencedColumns: ["id"];
          }
        ];
      };
      maintenance_tickets: {
        Row: {
          id: string;
          tenant_id: string;
          room_id: string;
          renter_id: string;
          issue_category: MaintenanceCategory;
          description: string;
          photo_url: string | null;
          status: MaintenanceStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          room_id: string;
          renter_id: string;
          issue_category: MaintenanceCategory;
          description: string;
          photo_url?: string | null;
          status?: MaintenanceStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          room_id?: string;
          renter_id?: string;
          issue_category?: MaintenanceCategory;
          description?: string;
          photo_url?: string | null;
          status?: MaintenanceStatus;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "maintenance_tickets_tenant_id_fkey";
            columns: ["tenant_id"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "maintenance_tickets_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "maintenance_tickets_renter_id_fkey";
            columns: ["renter_id"];
            isOneToOne: false;
            referencedRelation: "renters";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      subscription_plan_type: SubscriptionPlan;
      room_status_type: RoomStatus;
      contract_status_type: ContractStatus;
      invoice_status_type: InvoiceStatus;
      maintenance_category_type: MaintenanceCategory;
      maintenance_status_type: MaintenanceStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
