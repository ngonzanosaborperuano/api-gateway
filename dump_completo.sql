CREATE SEQUENCE logs_id_seq;

CREATE SEQUENCE roles_id_seq;

CREATE SEQUENCE users_id_seq;

CREATE SEQUENCE usuarios_id_seq;

-- Estructura de tablas
CREATE TABLE allergens (
    id integer,
    recipe_id integer NOT NULL,
    name text NOT NULL
);

CREATE TABLE alternative_items (
    id integer,
    alternative_id integer NOT NULL,
    name text NOT NULL
);

CREATE TABLE alternatives (
    id integer,
    ingredient_id integer,
    original text NOT NULL
);

CREATE TABLE diets (
    id integer,
    recipe_id integer NOT NULL,
    name text NOT NULL
);

CREATE TABLE extra_info (
    id integer,
    recipe_id integer NOT NULL,
    cooking_method text NOT NULL,
    ideal_season text NOT NULL,
    origin_country text NOT NULL,
    spicy_level text NOT NULL
);

CREATE TABLE favoritos (
    usuario_id integer,
    recipe_id integer,
    fecha_guardado timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE health_warnings (
    id integer,
    recipe_id integer NOT NULL,
    text text NOT NULL
);

CREATE TABLE ingredients (
    id integer,
    recipe_id integer NOT NULL,
    name text,
    amount text NOT NULL
);

CREATE TABLE instructions (
    id integer,
    recipe_id integer NOT NULL,
    step integer NOT NULL,
    text text NOT NULL
);

CREATE TABLE logs (
    id integer DEFAULT nextval('logs_id_seq'::regclass),
    metodo character varying(10) NOT NULL,
    ruta text NOT NULL,
    cuerpo jsonb NOT NULL,
    respuesta_ms numeric(10,2) NOT NULL,
    estado_http integer NOT NULL,
    mensaje text NOT NULL,
    error jsonb NOT NULL,
    fecha_creacion timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE macros (
    id integer,
    nutrition_info_id integer NOT NULL,
    type text NOT NULL,
    value integer NOT NULL
);

CREATE TABLE medical_restrictions (
    id integer,
    recipe_id integer NOT NULL,
    name text NOT NULL
);

CREATE TABLE nutrition_info (
    id integer,
    recipe_id integer NOT NULL,
    calories integer NOT NULL,
    protein integer NOT NULL,
    carbs integer NOT NULL,
    fat integer NOT NULL
);

CREATE TABLE plating_instructions (
    id integer,
    recipe_id integer NOT NULL,
    step integer NOT NULL,
    text text NOT NULL
);

CREATE TABLE recipes (
    id integer,
    title text,
    summary text NOT NULL,
    is_vegetarian boolean NOT NULL,
    meal_type text NOT NULL,
    difficulty text NOT NULL,
    is_allergenic boolean NOT NULL,
    digestion_time_minutes integer NOT NULL,
    environmental_impact text NOT NULL,
    glycemic_index integer NOT NULL,
    satiety_level text NOT NULL,
    processing_level integer NOT NULL,
    is_valid_recipe boolean NOT NULL,
    error_message text NOT NULL,
    cache_time text NOT NULL,
    time text NOT NULL
);

CREATE TABLE recommended_pairings (
    id integer,
    recipe_id integer NOT NULL,
    drinks text NOT NULL,
    sides text NOT NULL,
    desserts text NOT NULL
);

CREATE TABLE recommended_servings (
    id integer,
    recipe_id integer NOT NULL,
    adult text NOT NULL,
    child text NOT NULL,
    athlete text NOT NULL,
    senior text NOT NULL
);

CREATE TABLE roles (
    id bigint DEFAULT nextval('roles_id_seq'::regclass),
    nombre character varying(50),
    descripcion text NOT NULL,
    fecha_creacion timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE similar_dishes (
    id integer,
    recipe_id integer NOT NULL,
    name text NOT NULL
);

CREATE TABLE users (
    id integer DEFAULT nextval('users_id_seq'::regclass),
    name character varying,
    email character varying,
    password character varying
);

CREATE TABLE usuario_roles (
    usuario_id bigint,
    rol_id bigint,
    fecha_asignacion timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios (
    id bigint DEFAULT nextval('usuarios_id_seq'::regclass),
    nombre_completo character varying(150),
    email character varying(100),
    contrasena text,
    session_token character varying NOT NULL,
    foto character varying NOT NULL,
    estado boolean NOT NULL DEFAULT true,
    actualizado_por integer,
    fecha_creacion timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Funciones
CREATE OR REPLACE FUNCTION public.actualizar_session_token(p_id bigint, p_token character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE usuarios
    SET session_token = p_token
    WHERE id = p_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.crear_usuario(p_nombre_completo character varying, p_email character varying, p_foto character varying, p_contrasena text, p_creado_por timestamp without time zone)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_usuario_id BIGINT;
BEGIN
    -- Crear usuario
    INSERT INTO usuarios(nombre_completo,email,contrasena,foto,fecha_creacion,fecha_actualizacion) 
    VALUES (p_nombre_completo, p_email, p_contrasena,p_foto, p_creado_por, p_creado_por)
    RETURNING id INTO v_usuario_id;

    -- Asignar un rol inicial (pueden añadirse más después)
    INSERT INTO usuario_roles(usuario_id, rol_id)
    VALUES (v_usuario_id, 2); -- 2: cliente
    
    RETURN v_usuario_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_recipe(p_title text, p_summary text, p_is_vegetarian boolean, p_meal_type text, p_difficulty text, p_is_allergenic boolean, p_digestion_time_minutes integer, p_environmental_impact text, p_glycemic_index integer, p_satiety_level text, p_processing_level integer, p_is_valid_recipe boolean, p_error_message text, p_cache_time text, p_time text)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_id INTEGER;
BEGIN
    INSERT INTO recipes (
        title, summary, is_vegetarian, meal_type, difficulty, is_allergenic,
        digestion_time_minutes, environmental_impact, glycemic_index, satiety_level,
        processing_level, is_valid_recipe, error_message, cache_time, time
    ) VALUES (
        p_title, p_summary, p_is_vegetarian, p_meal_type, p_difficulty, p_is_allergenic,
        p_digestion_time_minutes, p_environmental_impact, p_glycemic_index, p_satiety_level,
        p_processing_level, p_is_valid_recipe, p_error_message, p_cache_time, p_time
    ) RETURNING id INTO new_id;
    RETURN new_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.find_usuario_por_email(p_email character varying)
 RETURNS TABLE(id bigint, nombre_completo character varying, email character varying, contrasena text, foto character varying, fecha_creacion timestamp without time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.nombre_completo,
        u.email,
        u.contrasena,
        u.foto,
        u.fecha_creacion
    FROM usuarios u
    WHERE u.email = p_email
      AND u.estado = true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.find_usuario_por_id(p_id bigint)
 RETURNS TABLE(id bigint, nombre_completo character varying, email character varying, contrasena text, foto character varying, fecha_creacion timestamp without time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.nombre_completo,
        u.email,
        u.contrasena,
        u.foto,
        u.fecha_creacion
    FROM usuarios u
    WHERE u.id = p_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.insert_full_recipe(recipe_json jsonb)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_recipe_id INTEGER;
    nutrition_id INTEGER;
    macros_data jsonb;
    macro_key TEXT;
    macro_value TEXT;
    servings_data jsonb;
    pairings_data jsonb;
    i INT;
    ingr jsonb;
    alt jsonb;
    alt_item jsonb;
    instr jsonb;
    plate_instr jsonb;
    warn jsonb;
    med jsonb;
    sim jsonb;
    diet jsonb;
    allergen jsonb;
BEGIN
    -- Insertar en recipes
    INSERT INTO recipes (
        title, summary, is_vegetarian, meal_type, difficulty, is_allergenic,
        digestion_time_minutes, environmental_impact, glycemic_index, satiety_level,
        processing_level, is_valid_recipe, error_message, cache_time, time
    ) VALUES (
        recipe_json->'result'->>'title',
        recipe_json->'result'->>'summary',
        (recipe_json->'result'->>'isVegetarian')::boolean,
        recipe_json->'result'->>'mealType',
        recipe_json->'result'->>'difficulty',
        (recipe_json->'result'->>'isAllergenic')::boolean,
        (recipe_json->'result'->>'digestion_time_minutes')::integer,
        recipe_json->'result'->>'environmental_impact',
        (recipe_json->'result'->>'glycemic_index')::integer,
        recipe_json->'result'->>'satiety_level',
        (recipe_json->'result'->>'processing_level')::integer,
        (recipe_json->>'isValidRecipe')::boolean,
        recipe_json->>'errorMessage',
        (recipe_json->>'cacheTime')::text,
        (recipe_json->>'time')::text
    ) RETURNING id INTO new_recipe_id;

    -- Ingredientes
    FOR i IN 0 .. jsonb_array_length(recipe_json->'result'->'ingredients') - 1 LOOP
        ingr := recipe_json->'result'->'ingredients'->i;
        INSERT INTO ingredients (recipe_id, name, amount)
        VALUES (new_recipe_id, ingr->>'name', ingr->>'amount');
    END LOOP;

    -- Alternativas de ingredientes
    FOR i IN 0 .. COALESCE(jsonb_array_length(recipe_json->'result'->'AlternativasIngredientes'),0) - 1 LOOP
        alt := recipe_json->'result'->'AlternativasIngredientes'->i;
        INSERT INTO alternatives (ingredient_id, original)
        VALUES (
            (SELECT id FROM ingredients WHERE recipe_id = new_recipe_id AND name = alt->>'original' LIMIT 1),
            alt->>'original'
        ) RETURNING id INTO nutrition_id;
        -- Alternativas
        FOR alt_item IN SELECT * FROM jsonb_array_elements(alt->'alternativas') LOOP
            INSERT INTO alternative_items (alternative_id, name)
            VALUES (nutrition_id, alt_item->>'name');
        END LOOP;
    END LOOP;

    -- Instrucciones
    FOR i IN 0 .. COALESCE(jsonb_array_length(recipe_json->'result'->'instructions'),0) - 1 LOOP
        instr := recipe_json->'result'->'instructions'->i;
        INSERT INTO instructions (recipe_id, step, text)
        VALUES (new_recipe_id, (instr->>'step')::integer, instr->>'text');
    END LOOP;

    -- Plating instructions
    FOR i IN 0 .. COALESCE(jsonb_array_length(recipe_json->'result'->'plating_instructions'),0) - 1 LOOP
        plate_instr := recipe_json->'result'->'plating_instructions'->i;
        INSERT INTO plating_instructions (recipe_id, step, text)
        VALUES (new_recipe_id, (plate_instr->>'step')::integer, COALESCE(plate_instr->>'text', plate_instr->>'description'));
    END LOOP;

    -- Nutrition info
    IF recipe_json->'result' ? 'nutrition_info' THEN
        INSERT INTO nutrition_info (recipe_id, calories, protein, carbs, fat)
        VALUES (
            new_recipe_id,
            (recipe_json->'result'->'nutrition_info'->>'calories')::integer,
            (recipe_json->'result'->'nutrition_info'->>'protein')::integer,
            (recipe_json->'result'->'nutrition_info'->>'carbs')::integer,
            (recipe_json->'result'->'nutrition_info'->>'fats')::integer
        ) RETURNING id INTO nutrition_id;
        -- Macros
        IF recipe_json->'result' ? 'macros' THEN
            macros_data := recipe_json->'result'->'macros';
            FOR macro_key, macro_value IN SELECT * FROM jsonb_each_text(macros_data) LOOP
                INSERT INTO macros (nutrition_info_id, type, value)
                VALUES (nutrition_id, macro_key, macro_value::integer);
            END LOOP;
        END IF;
    END IF;

    -- Recommended servings
    IF recipe_json->'result' ? 'recommended_servings' THEN
        servings_data := recipe_json->'result'->'recommended_servings';
        INSERT INTO recommended_servings (recipe_id, adult, child, athlete, senior)
        VALUES (
            new_recipe_id,
            NULLIF(servings_data->>'adult','')::text,
            NULLIF(servings_data->>'child','')::text,
            NULLIF(servings_data->>'athlete','')::text,
            NULLIF(servings_data->>'senior','')::text
        );
    END IF;

    -- Medical restrictions
    FOR i IN 0 .. COALESCE(jsonb_array_length(recipe_json->'result'->'medical_restrictions'),0) - 1 LOOP
        med := recipe_json->'result'->'medical_restrictions'->i;
        INSERT INTO medical_restrictions (recipe_id, name)
        VALUES (new_recipe_id, med->>'name');
    END LOOP;

    -- Health warnings
    FOR i IN 0 .. COALESCE(jsonb_array_length(recipe_json->'result'->'health_warnings'),0) - 1 LOOP
        warn := recipe_json->'result'->'health_warnings'->i;
        INSERT INTO health_warnings (recipe_id, text)
        VALUES (new_recipe_id, warn->>'text');
    END LOOP;

    -- Extra info
    IF recipe_json->'result' ? 'extra_info' THEN
        INSERT INTO extra_info (recipe_id, cooking_method, ideal_season, origin_country, spicy_level)
        VALUES (
            new_recipe_id,
            recipe_json->'result'->'extra_info'->>'cooking_method',
            recipe_json->'result'->'extra_info'->>'ideal_season',
            recipe_json->'result'->'extra_info'->>'origin_country',
            recipe_json->'result'->'extra_info'->>'spicy_level'
        );
    END IF;

    -- Similar dishes
    FOR i IN 0 .. COALESCE(jsonb_array_length(recipe_json->'result'->'similar_dishes'),0) - 1 LOOP
        sim := recipe_json->'result'->'similar_dishes'->i;
        INSERT INTO similar_dishes (recipe_id, name)
        VALUES (new_recipe_id, sim->>'name');
    END LOOP;

    -- Recommended pairings
    IF recipe_json->'result' ? 'recommended_pairings' THEN
        pairings_data := recipe_json->'result'->'recommended_pairings';
        INSERT INTO recommended_pairings (recipe_id, drinks, sides, desserts)
        VALUES (
            new_recipe_id,
            (SELECT string_agg(x->>'name', ', ') FROM jsonb_array_elements(pairings_data->'drinks') x),
            (SELECT string_agg(x->>'name', ', ') FROM jsonb_array_elements(pairings_data->'sides') x),
            (SELECT string_agg(x->>'name', ', ') FROM jsonb_array_elements(pairings_data->'desserts') x)
        );
    END IF;

    -- Diets
    FOR i IN 0 .. COALESCE(jsonb_array_length(recipe_json->'result'->'diets'),0) - 1 LOOP
        diet := recipe_json->'result'->'diets'->i;
        INSERT INTO diets (recipe_id, name)
        VALUES (new_recipe_id, diet->>'name');
    END LOOP;

    -- Allergens
    FOR i IN 0 .. COALESCE(jsonb_array_length(recipe_json->'result'->'allergens'),0) - 1 LOOP
        allergen := recipe_json->'result'->'allergens'->i;
        INSERT INTO allergens (recipe_id, name)
        VALUES (new_recipe_id, allergen->>'name');
    END LOOP;

    RETURN new_recipe_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.insertar_log(p_metodo text, p_ruta text, p_cuerpo json, p_respuesta_ms numeric, p_estado_http integer, p_mensaje text, p_error json)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
BEGIN
    INSERT INTO logs (metodo, ruta, cuerpo, respuesta_ms, estado_http, mensaje, error)
    VALUES (p_metodo, p_ruta, p_cuerpo, p_respuesta_ms, p_estado_http, p_mensaje, p_error);

    RETURN 1; -- puedes retornar 0 o 1 según lo necesites como código de éxito
END;
$function$;

CREATE OR REPLACE FUNCTION public.obtener_logs(p_limit integer DEFAULT 25, p_metodo character varying DEFAULT NULL::character varying, p_estado_http integer DEFAULT NULL::integer, p_respuesta_ms_min numeric DEFAULT NULL::numeric)
 RETURNS TABLE(id integer, metodo character varying, ruta text, cuerpo jsonb, respuesta_ms numeric, estado_http integer, mensaje text, error jsonb, fecha_creacion timestamp without time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        logs.id,
        logs.metodo,
        logs.ruta,
        logs.cuerpo,
        logs.respuesta_ms,
        logs.estado_http,
        logs.mensaje,
        logs.error,
        logs.fecha_creacion
    FROM logs
    WHERE (p_metodo IS NULL OR logs.metodo = p_metodo)
        AND (p_estado_http IS NULL OR logs.estado_http = p_estado_http)
        AND (p_respuesta_ms_min IS NULL OR logs.respuesta_ms >= p_respuesta_ms_min)
    ORDER BY logs.id DESC
    LIMIT p_limit;
END;
$function$;

CREATE OR REPLACE FUNCTION public.obtener_usuarios_con_rol(nombre_rol text)
 RETURNS TABLE(id bigint, nombre_completo character varying, email character varying, rol character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.nombre_completo,
    u.email,
    r.nombre
  FROM usuarios u
  JOIN usuario_roles ur ON u.id = ur.usuario_id
  JOIN roles r ON ur.rol_id = r.id
  WHERE r.nombre = nombre_rol;
END;
$function$;

-- Estructura de inserts (debes reemplazar los valores por los datos reales)
-- Ejemplo para cada tabla:
-- INSERT INTO allergens (id, recipe_id, name) VALUES (1, 1, 'Gluten');
-- Repite para cada tabla y sus columnas según corresponda.

-- =============================
-- INSERTS DE DATOS REALES
-- =============================

-- Tabla: allergens
INSERT INTO
    allergens (id, recipe_id, name)
VALUES (
        1,
        1,
        'Gluten (por la salsa de soya)'
    );

INSERT INTO allergens (id, recipe_id, name) VALUES (2, 2, 'Maíz');

INSERT INTO allergens (id, recipe_id, name) VALUES (3, 3, 'Maíz');

-- Tabla: alternative_items
INSERT INTO
    alternative_items (id, alternative_id, name)
VALUES (1, 1, 'Solomillo de res');

INSERT INTO
    alternative_items (id, alternative_id, name)
VALUES (2, 2, 'Vinagre de vino tinto');

INSERT INTO
    alternative_items (id, alternative_id, name)
VALUES (3, 3, 'Hojas de plátano');

INSERT INTO
    alternative_items (id, alternative_id, name)
VALUES (
        4,
        4,
        'Carne de cerdo desmenuzada'
    );

INSERT INTO
    alternative_items (id, alternative_id, name)
VALUES (
        5,
        4,
        'Hongos portobello en trozos'
    );

INSERT INTO
    alternative_items (id, alternative_id, name)
VALUES (6, 5, 'Pasta de ají panca');

INSERT INTO
    alternative_items (id, alternative_id, name)
VALUES (
        7,
        5,
        'Pimiento rojo asado y molido'
    );

INSERT INTO
    alternative_items (id, alternative_id, name)
VALUES (8, 6, 'Hojas de plátano');

INSERT INTO
    alternative_items (id, alternative_id, name)
VALUES (
        9,
        7,
        'Carne de cerdo desmenuzada'
    );

INSERT INTO
    alternative_items (id, alternative_id, name)
VALUES (
        10,
        7,
        'Hongos portobello en trozos'
    );

INSERT INTO
    alternative_items (id, alternative_id, name)
VALUES (11, 8, 'Pasta de ají panca');

INSERT INTO
    alternative_items (id, alternative_id, name)
VALUES (
        12,
        8,
        'Pimiento rojo asado y molido'
    );

-- Tabla: alternatives
INSERT INTO
    alternatives (id, ingredient_id, original)
VALUES (1, NULL, 'Lomo de res');

INSERT INTO
    alternatives (id, ingredient_id, original)
VALUES (
        2,
        7,
        'Vinagre de vino blanco'
    );

INSERT INTO
    alternatives (id, ingredient_id, original)
VALUES (3, 21, 'Pancas de maíz');

INSERT INTO
    alternatives (id, ingredient_id, original)
VALUES (4, 18, 'Pollo desmenuzado');

INSERT INTO
    alternatives (id, ingredient_id, original)
VALUES (5, 17, 'Ají amarillo molido');

INSERT INTO
    alternatives (id, ingredient_id, original)
VALUES (6, 29, 'Pancas de maíz');

INSERT INTO
    alternatives (id, ingredient_id, original)
VALUES (7, 26, 'Pollo desmenuzado');

INSERT INTO
    alternatives (id, ingredient_id, original)
VALUES (8, 25, 'Ají amarillo molido');

-- Tabla: diets
INSERT INTO diets (id, recipe_id, name) VALUES (1, 1, 'Omnívora');

INSERT INTO diets (id, recipe_id, name) VALUES (2, 2, 'Sin gluten');

INSERT INTO diets (id, recipe_id, name) VALUES (3, 3, 'Sin gluten');

-- Tabla: extra_info
INSERT INTO
    extra_info (
        id,
        recipe_id,
        cooking_method,
        ideal_season,
        origin_country,
        spicy_level
    )
VALUES (
        1,
        1,
        'Salteado rápido',
        'Cualquier época del año',
        'Perú',
        'Opcional (moderado)'
    );

INSERT INTO
    extra_info (
        id,
        recipe_id,
        cooking_method,
        ideal_season,
        origin_country,
        spicy_level
    )
VALUES (
        2,
        2,
        'Vapor',
        'Todo el año',
        'Perú',
        'Leve'
    );

INSERT INTO
    extra_info (
        id,
        recipe_id,
        cooking_method,
        ideal_season,
        origin_country,
        spicy_level
    )
VALUES (
        3,
        3,
        'Vapor',
        'Todo el año',
        'Perú',
        'Leve'
    );

-- Tabla: roles
INSERT INTO
    roles (
        id,
        nombre,
        descripcion,
        fecha_creacion,
        fecha_actualizacion
    )
VALUES (
        1,
        'cocinero',
        'Encargado de preparar los alimentos',
        '2025-05-17T16:34:19.386Z',
        '2025-05-17T16:34:19.386Z'
    );

INSERT INTO
    roles (
        id,
        nombre,
        descripcion,
        fecha_creacion,
        fecha_actualizacion
    )
VALUES (
        2,
        'cliente',
        'Persona que realiza pedidos y consume los productos',
        '2025-05-17T16:34:19.386Z',
        '2025-05-17T16:34:19.386Z'
    );

INSERT INTO
    roles (
        id,
        nombre,
        descripcion,
        fecha_creacion,
        fecha_actualizacion
    )
VALUES (
        3,
        'administrador',
        'Encargado de gestionar el sistema y los usuarios',
        '2025-05-17T16:34:19.386Z',
        '2025-05-17T16:34:19.386Z'
    );

-- Tabla: usuarios
INSERT INTO
    usuarios (
        id,
        nombre_completo,
        email,
        contrasena,
        session_token,
        foto,
        estado,
        actualizado_por,
        fecha_creacion,
        fecha_actualizacion
    )
VALUES (
        55,
        'Nilton gonzano rojas',
        'nigorora@gmail.com',
        '$2b$10$W2IK/VihXQIrpdiRdipwLedCaIdS1yNFs6rieOFv0NdGV7ZqtpfS6',
        'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1IiwiaWF0IjoxNzUwNjQ0MzU4LCJleHAiOjE3NTMyMzYzNTh9.n8_eNgVNK8KAWRIKWf6s5zZCBnriXBJ1mhE-AgUSlGY',
        'https://lh3.googleusercontent.com/a/ACg8ocJoOb9Ktw1cFP50JGRievmcc0YlfsKhXt6scoUf20X8iznwH3Zf=s96-c',
        true,
        NULL,
        '2025-06-16T02:37:39.000Z',
        '2025-06-16T02:37:39.000Z'
    );

-- Tabla: usuario_roles
INSERT INTO
    usuario_roles (
        usuario_id,
        rol_id,
        fecha_asignacion
    )
VALUES (
        55,
        2,
        '2025-06-16T07:37:39.583Z'
    );