-- ==============================================================================
-- KAMARHUB DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- Multi-Tenant Architecture for Boarding House (Kos) Management SaaS
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE subscription_plan_type AS ENUM ('free', 'pro', 'enterprise');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE room_status_type AS ENUM ('available', 'occupied', 'maintenance');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE contract_status_type AS ENUM ('active', 'ended', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE invoice_status_type AS ENUM ('unpaid', 'paid', 'overdue');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE maintenance_category_type AS ENUM ('Listrik', 'Air', 'AC', 'Kunci', 'Bangunan', 'Lainnya');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE maintenance_status_type AS ENUM ('pending', 'in_progress', 'resolved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. TABLES DEFINITION
-- ==============================================================================

-- SAAS CORE: Tenants (Pemilik Kos / Admin)
-- ID corresponds to Supabase auth.users.id
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    subscription_plan subscription_plan_type DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ASSET MANAGEMENT: Properties (Gedung / Cabang Kos)
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    total_rooms INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ASSET MANAGEMENT: Rooms (Kamar Kos)
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    room_number VARCHAR(50) NOT NULL,
    room_type VARCHAR(100) DEFAULT 'Standard',
    base_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status room_status_type DEFAULT 'available' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE (property_id, room_number)
);

-- TENANT LIFECYCLE: Renters (Penghuni / Anak Kos)
CREATE TABLE IF NOT EXISTS public.renters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional if renter has auth account
    full_name VARCHAR(255) NOT NULL,
    whatsapp_number VARCHAR(50) NOT NULL,
    id_card_number VARCHAR(50),
    id_card_url TEXT,
    emergency_contact VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- TENANT LIFECYCLE: Contracts (Kontrak Sewa)
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE RESTRICT,
    renter_id UUID NOT NULL REFERENCES public.renters(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE,
    deposit_amount NUMERIC(12, 2) DEFAULT 0 NOT NULL,
    status contract_status_type DEFAULT 'active' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- BILLING & FINANCE: Invoices (Tagihan Sewa Bulanan & Biaya Tambahan)
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    billing_month DATE NOT NULL,
    room_fee NUMERIC(12, 2) NOT NULL,
    additional_fee NUMERIC(12, 2) DEFAULT 0 NOT NULL,
    penalty_fee NUMERIC(12, 2) DEFAULT 0 NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    due_date DATE NOT NULL,
    status invoice_status_type DEFAULT 'unpaid' NOT NULL,
    payment_proof_url TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- OPERATIONS: Maintenance Tickets (Keluhan & Perbaikan Fasilitas)
CREATE TABLE IF NOT EXISTS public.maintenance_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE RESTRICT,
    renter_id UUID NOT NULL REFERENCES public.renters(id) ON DELETE RESTRICT,
    issue_category maintenance_category_type NOT NULL,
    description TEXT NOT NULL,
    photo_url TEXT,
    status maintenance_status_type DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ==============================================================================
-- 4. INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_properties_tenant ON public.properties(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rooms_property ON public.rooms(property_id);
CREATE INDEX IF NOT EXISTS idx_rooms_tenant ON public.rooms(tenant_id);
CREATE INDEX IF NOT EXISTS idx_renters_tenant ON public.renters(tenant_id);
CREATE INDEX IF NOT EXISTS idx_contracts_tenant ON public.contracts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_contracts_room ON public.contracts(room_id);
CREATE INDEX IF NOT EXISTS idx_contracts_renter ON public.contracts(renter_id);
CREATE INDEX IF NOT EXISTS idx_invoices_tenant ON public.invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_contract ON public.invoices(contract_id);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_tenant ON public.maintenance_tickets(tenant_id);

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) - ABSOLUTE TENANT ISOLATION
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.renters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_tickets ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- POLICIES: TENANTS TABLE
-- ------------------------------------------------------------------------------
CREATE POLICY "Tenants can view and manage their own profile"
    ON public.tenants
    FOR ALL
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- POLICIES: PROPERTIES TABLE
-- ------------------------------------------------------------------------------
CREATE POLICY "Tenants can manage their own properties"
    ON public.properties
    FOR ALL
    USING (auth.uid() = tenant_id)
    WITH CHECK (auth.uid() = tenant_id);

-- ------------------------------------------------------------------------------
-- POLICIES: ROOMS TABLE
-- ------------------------------------------------------------------------------
CREATE POLICY "Tenants can manage their own rooms"
    ON public.rooms
    FOR ALL
    USING (auth.uid() = tenant_id)
    WITH CHECK (auth.uid() = tenant_id);

-- ------------------------------------------------------------------------------
-- POLICIES: RENTERS TABLE
-- ------------------------------------------------------------------------------
CREATE POLICY "Tenants can manage their own renters"
    ON public.renters
    FOR ALL
    USING (auth.uid() = tenant_id)
    WITH CHECK (auth.uid() = tenant_id);

CREATE POLICY "Renters can view their own data"
    ON public.renters
    FOR SELECT
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- POLICIES: CONTRACTS TABLE
-- ------------------------------------------------------------------------------
CREATE POLICY "Tenants can manage their own contracts"
    ON public.contracts
    FOR ALL
    USING (auth.uid() = tenant_id)
    WITH CHECK (auth.uid() = tenant_id);

CREATE POLICY "Renters can view their own contracts"
    ON public.contracts
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.renters
            WHERE renters.id = contracts.renter_id
            AND renters.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------------------------
-- POLICIES: INVOICES TABLE
-- ------------------------------------------------------------------------------
CREATE POLICY "Tenants can manage their own invoices"
    ON public.invoices
    FOR ALL
    USING (auth.uid() = tenant_id)
    WITH CHECK (auth.uid() = tenant_id);

CREATE POLICY "Renters can view their own invoices"
    ON public.invoices
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.contracts
            JOIN public.renters ON contracts.renter_id = renters.id
            WHERE contracts.id = invoices.contract_id
            AND renters.user_id = auth.uid()
        )
    );

CREATE POLICY "Renters can upload payment proof to their invoices"
    ON public.invoices
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.contracts
            JOIN public.renters ON contracts.renter_id = renters.id
            WHERE contracts.id = invoices.contract_id
            AND renters.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.contracts
            JOIN public.renters ON contracts.renter_id = renters.id
            WHERE contracts.id = invoices.contract_id
            AND renters.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------------------------
-- POLICIES: MAINTENANCE TICKETS TABLE
-- ------------------------------------------------------------------------------
CREATE POLICY "Tenants can manage their own maintenance tickets"
    ON public.maintenance_tickets
    FOR ALL
    USING (auth.uid() = tenant_id)
    WITH CHECK (auth.uid() = tenant_id);

CREATE POLICY "Renters can view and create their own maintenance tickets"
    ON public.maintenance_tickets
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.renters
            WHERE renters.id = maintenance_tickets.renter_id
            AND renters.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.renters
            WHERE renters.id = maintenance_tickets.renter_id
            AND renters.user_id = auth.uid()
        )
    );

-- ==============================================================================
-- 6. AUTOMATION TRIGGERS: ROOM COUNT SYNC & NEW USER ONBOARDING
-- ==============================================================================

-- Trigger to sync total_rooms on public.properties
CREATE OR REPLACE FUNCTION public.sync_property_room_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.properties
        SET total_rooms = total_rooms + 1
        WHERE id = NEW.property_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.properties
        SET total_rooms = GREATEST(0, total_rooms - 1)
        WHERE id = OLD.property_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_sync_property_room_count
AFTER INSERT OR DELETE ON public.rooms
FOR EACH ROW EXECUTE FUNCTION public.sync_property_room_count();

-- Trigger to automatically create tenant row when new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_tenant()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.tenants (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_tenant();

-- ==============================================================================
-- 7. STORAGE BUCKET CONFIGURATION (PDP / PRIVACY)
-- ==============================================================================
-- Create private storage buckets for KTPs and payment receipts
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('ktp-documents', 'ktp-documents', false),
    ('payment-proofs', 'payment-proofs', false),
    ('maintenance-photos', 'maintenance-photos', false)
ON CONFLICT (id) DO NOTHING;
