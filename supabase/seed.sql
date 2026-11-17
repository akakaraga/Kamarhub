-- ==============================================================================
-- KAMARHUB SEED DATA SCRIPT (100% GOTRUE COMPATIBLE)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
    v_admin_id UUID := 'a0000000-0000-0000-0000-000000000001';
    v_admin_email TEXT := 'admin@kamarhub.id';
    v_admin_password TEXT := 'Password123!';
    v_property_id UUID := 'b0000000-0000-0000-0000-000000000001';
    v_room_101_id UUID := 'c0000000-0000-0000-0000-000000000101';
    v_room_102_id UUID := 'c0000000-0000-0000-0000-000000000102';
    v_room_103_id UUID := 'c0000000-0000-0000-0000-000000000103';
    v_room_104_id UUID := 'c0000000-0000-0000-0000-000000000104';
    v_renter_id UUID := 'd0000000-0000-0000-0000-000000000001';
    v_contract_id UUID := 'e0000000-0000-0000-0000-000000000001';
BEGIN
    -- 1. Bersihkan data lama jika ada
    DELETE FROM auth.identities WHERE user_id = v_admin_id OR identity_data->>'email' = v_admin_email;
    DELETE FROM public.invoices WHERE tenant_id = v_admin_id;
    DELETE FROM public.contracts WHERE tenant_id = v_admin_id;
    DELETE FROM public.renters WHERE tenant_id = v_admin_id;
    DELETE FROM public.rooms WHERE tenant_id = v_admin_id;
    DELETE FROM public.properties WHERE tenant_id = v_admin_id;
    DELETE FROM public.tenants WHERE id = v_admin_id OR email = v_admin_email;
    DELETE FROM auth.users WHERE id = v_admin_id OR email = v_admin_email;

    -- 2. Sisipkan ke auth.users DENGAN SELURUH TOKEN STRING KOSONG (Wajib untuk GoTrue parser)
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change,
        email_change_token_current,
        phone_change,
        phone_change_token,
        reauthentication_token
    )
    VALUES (
        v_admin_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        v_admin_email,
        crypt(v_admin_password, gen_salt('bf')),
        NOW(),
        NOW(),1
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        '{"full_name": "Budi Santoso", "company_name": "Grup Kos Mawar Indah", "phone_number": "081234567890"}'::jsonb,
        FALSE,
        NOW(),
        NOW(),
        '', -- confirmation_token: TIDAK BOLEH NULL
        '', -- recovery_token: TIDAK BOLEH NULL
        '', -- email_change_token_new: TIDAK BOLEH NULL
        '', -- email_change: TIDAK BOLEH NULL
        '', -- email_change_token_current: TIDAK BOLEH NULL
        '', -- phone_change: TIDAK BOLEH NULL
        '', -- phone_change_token: TIDAK BOLEH NULL
        ''  -- reauthentication_token: TIDAK BOLEH NULL
    );

    -- 3. Sisipkan ke auth.identities
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
    )
    VALUES (
        v_admin_id,
        v_admin_id,
        jsonb_build_object('sub', v_admin_id::text, 'email', v_admin_email),
        'email',
        v_admin_email,
        NOW(),
        NOW(),
        NOW()
    );

    -- 4. Sisipkan ke public.tenants
    INSERT INTO public.tenants (
        id,
        full_name,
        company_name,
        email,
        phone_number,
        subscription_plan
    )
    VALUES (
        v_admin_id,
        'Budi Santoso',
        'Grup Kos Mawar Indah',
        v_admin_email,
        '081234567890',
        'pro'
    )
    ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        company_name = EXCLUDED.company_name;

    -- 5. Properti Sampel
    INSERT INTO public.properties (
        id,
        tenant_id,
        name,
        address,
        total_rooms
    )
    VALUES (
        v_property_id,
        v_admin_id,
        'Kos Mawar Residence',
        'Jl. Kaliurang KM 5, Gang Mawar No. 12, Sleman, D.I. Yogyakarta',
        4
    )
    ON CONFLICT (id) DO NOTHING;

    -- 6. Kamar Sampel
    INSERT INTO public.rooms (
        id,
        property_id,
        tenant_id,
        room_number,
        room_type,
        base_price,
        status
    )
    VALUES 
        (v_room_101_id, v_property_id, v_admin_id, '101', 'AC + Kamar Mandi Dalam', 1500000, 'occupied'),
        (v_room_102_id, v_property_id, v_admin_id, '102', 'AC + Kamar Mandi Dalam', 1500000, 'available'),
        (v_room_103_id, v_property_id, v_admin_id, '103', 'Non-AC + Kamar Mandi Luar', 850000, 'available'),
        (v_room_104_id, v_property_id, v_admin_id, '104', 'VIP Suite + Balkon', 2200000, 'maintenance')
    ON CONFLICT (property_id, room_number) DO NOTHING;

    -- 7. Penghuni Sampel
    INSERT INTO public.renters (
        id,
        tenant_id,
        full_name,
        whatsapp_number,
        id_card_number,
        emergency_contact
    )
    VALUES (
        v_renter_id,
        v_admin_id,
        'Rian Pratama',
        '081298765432',
        '3201123456780001',
        '081987654321 (Ibu Kandung)'
    )
    ON CONFLICT (id) DO NOTHING;

    -- 8. Kontrak Sewa Sampel
    INSERT INTO public.contracts (
        id,
        tenant_id,
        room_id,
        renter_id,
        start_date,
        end_date,
        deposit_amount,
        status
    )
    VALUES (
        v_contract_id,
        v_admin_id,
        v_room_101_id,
        v_renter_id,
        CURRENT_DATE - INTERVAL '2 months',
        NULL,
        500000,
        'active'
    )
    ON CONFLICT (id) DO NOTHING;

    -- 9. Tagihan Sampel
    INSERT INTO public.invoices (
        tenant_id,
        contract_id,
        billing_month,
        room_fee,
        additional_fee,
        penalty_fee,
        total_amount,
        due_date,
        status
    )
    VALUES (
        v_admin_id,
        v_contract_id,
        DATE_TRUNC('month', CURRENT_DATE)::DATE,
        1500000,
        50000,
        0,
        1550000,
        CURRENT_DATE + INTERVAL '5 days',
        'unpaid'
    );

END $$;
