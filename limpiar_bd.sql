-- 1. Eliminar funciones (DROP FUNCTION necesita nombre + parámetros)
DO $$
DECLARE 
    r RECORD;
BEGIN
    FOR r IN 
        SELECT 
            p.proname,
            oidvectortypes(p.proargtypes) as args
        FROM pg_proc p
        JOIN pg_namespace ns ON ns.oid = p.pronamespace
        WHERE ns.nspname = 'public'
    LOOP
        EXECUTE format('DROP FUNCTION IF EXISTS public.%I(%s) CASCADE;', r.proname, r.args);
    END LOOP;
END $$;

-- 2. Eliminar tablas
DO $$
DECLARE 
    r RECORD;
BEGIN
    FOR r IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE;', r.tablename);
    END LOOP;
END $$;

-- 3. Eliminar secuencias
DO $$
DECLARE 
    r RECORD;
BEGIN
    FOR r IN 
        SELECT sequence_name 
        FROM information_schema.sequences 
        WHERE sequence_schema = 'public'
    LOOP
        EXECUTE format('DROP SEQUENCE IF EXISTS public.%I CASCADE;', r.sequence_name);
    END LOOP;
END $$;