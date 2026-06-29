-- ============================================
-- SCHEMA: Fun Facts Database
-- ============================================

CREATE EXTENSION IF NOT EXISTS unaccent;

-- 1. TABLA: topicos
CREATE TABLE IF NOT EXISTS topicos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombre TEXT NOT NULL UNIQUE
);

-- 2. TABLA: facts
CREATE TABLE IF NOT EXISTS facts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  titulo TEXT NOT NULL,
  descripcion_breve TEXT NOT NULL,
  explicacion_extensa TEXT NOT NULL,
  palabras INTEGER NOT NULL DEFAULT 0,
  tiene_fuentes BOOLEAN NOT NULL DEFAULT false,
  fuentes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. TABLA INTERMEDIA: fact_topicos (M2M)
CREATE TABLE IF NOT EXISTS fact_topicos (
  fact_id BIGINT NOT NULL REFERENCES facts(id) ON DELETE CASCADE,
  topico_id BIGINT NOT NULL REFERENCES topicos(id) ON DELETE CASCADE,
  PRIMARY KEY (fact_id, topico_id)
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_fact_topicos_fact_id ON fact_topicos(fact_id);
CREATE INDEX IF NOT EXISTS idx_fact_topicos_topico_id ON fact_topicos(topico_id);
CREATE INDEX IF NOT EXISTS idx_facts_created_at ON facts(created_at);
CREATE INDEX IF NOT EXISTS idx_facts_updated_at ON facts(updated_at);

-- 4. FUNCIÓN: normalizar texto (minúsculas, sin tildes, sin espacios extra, guiones bajos)
CREATE OR REPLACE FUNCTION normalizar_texto(input_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  result TEXT;
BEGIN
  result := lower(input_text);
  result := unaccent(result);
  result := regexp_replace(result, '[^a-z0-9_]+', '_', 'g');
  result := regexp_replace(result, '^_+|_+$', '', 'g');
  result := regexp_replace(result, '_+', '_', 'g');
  RETURN result;
END;
$$;

-- 5. FUNCIÓN: trigger para calcular metadatos antes de INSERT/UPDATE en facts
CREATE OR REPLACE FUNCTION calcular_metadatos_fact()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.palabras := array_length(regexp_split_to_array(trim(NEW.explicacion_extensa), '\s+'), 1);
  IF NEW.palabras IS NULL THEN
    NEW.palabras := 0;
  END IF;
  NEW.tiene_fuentes := (NEW.fuentes IS NOT NULL AND jsonb_array_length(NEW.fuentes) > 0);
  IF TG_OP = 'UPDATE' THEN
    NEW.updated_at := now();
  END IF;
  RETURN NEW;
END;
$$;

-- 6. TRIGGER: ejecutar metadatos antes de INSERT o UPDATE
DROP TRIGGER IF EXISTS trg_calcular_metadatos ON facts;
CREATE TRIGGER trg_calcular_metadatos
  BEFORE INSERT OR UPDATE ON facts
  FOR EACH ROW
  EXECUTE FUNCTION calcular_metadatos_fact();

-- 7. FUNCIÓN: insertar tópico con normalización automática
CREATE OR REPLACE FUNCTION insertar_topico(nombre_input TEXT)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
  nombre_normalizado TEXT;
  topico_id BIGINT;
BEGIN
  nombre_normalizado := normalizar_texto(nombre_input);
  INSERT INTO topicos (nombre) VALUES (nombre_normalizado)
  ON CONFLICT (nombre) DO UPDATE SET nombre = EXCLUDED.nombre
  RETURNING id INTO topico_id;
  RETURN topico_id;
END;
$$;

-- 8. ROW LEVEL SECURITY
ALTER TABLE facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE topicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_topicos ENABLE ROW LEVEL SECURITY;

-- Políticas: SELECT público (rol anónimo)
CREATE POLICY "select_public_facts" ON facts FOR SELECT USING (true);
CREATE POLICY "select_public_topicos" ON topicos FOR SELECT USING (true);
CREATE POLICY "select_public_fact_topicos" ON fact_topicos FOR SELECT USING (true);

-- Políticas: INSERT público (rol anónimo)
CREATE POLICY "insert_public_facts" ON facts FOR INSERT WITH CHECK (true);
CREATE POLICY "insert_public_topicos" ON topicos FOR INSERT WITH CHECK (true);
CREATE POLICY "insert_public_fact_topicos" ON fact_topicos FOR INSERT WITH CHECK (true);

-- Políticas: UPDATE/DELETE BLOQUEADOS para rol anónimo
CREATE POLICY "no_update_anon_facts" ON facts FOR UPDATE USING (false);
CREATE POLICY "no_delete_anon_facts" ON facts FOR DELETE USING (false);
CREATE POLICY "no_update_anon_topicos" ON topicos FOR UPDATE USING (false);
CREATE POLICY "no_delete_anon_topicos" ON topicos FOR DELETE USING (false);
CREATE POLICY "no_update_anon_fact_topicos" ON fact_topicos FOR UPDATE USING (false);
CREATE POLICY "no_delete_anon_fact_topicos" ON fact_topicos FOR DELETE USING (false);

-- 9. TÓPICOS PREDEFINIDOS
INSERT INTO topicos (nombre) VALUES
  ('bioinformatica'),
  ('literatura_fantastica'),
  ('entrenamiento_de_fuerza'),
  ('tecnologia'),
  ('historia'),
  ('biologia'),
  ('animales')
ON CONFLICT (nombre) DO NOTHING;
