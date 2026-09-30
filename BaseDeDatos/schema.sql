-- ============================================================================
--  Bar La Ponderosa — Esquema de base de datos (SQLite)
--  Archivo: schema.sql
--  Fuente : README.md · horarios_redes.md · Completo/Combinados.md
--
--  Uso:
--    · Automático:  python setup_db.py   (ejecuta schema.sql + datos_iniciales.sql)
--    · Manual:      sqlite3 ponderosa.sqlite < schema.sql
--                   sqlite3 ponderosa.sqlite < datos_iniciales.sql
--
--  Notas de diseño (DBA):
--    · Claves primarias INTEGER AUTOINCREMENT y claves foráneas con
--      ON DELETE RESTRICT (no se puede borrar una categoría con productos).
--    · precios en DECIMAL(6,2) (dinero: nunca REAL suelto).
--    · booleanos como INTEGER con CHECK IN (0,1) — nativo de SQLite.
--    · UNIQUE (categoria_id, nombre) evita duplicados dentro de una categoría.
--    · tabla informacion_bar restringida a una única fila (CHECK id = 1).
--    · índices cubren: joins por categoría, búsqueda por nombre y filtros
--      de disponibilidad / tipo vino.
-- ============================================================================

PRAGMA foreign_keys = ON;

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. CATEGORÍAS DE LA CARTA
--    orden = orden de visualización en la web (pestaññas de la carta)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT    NOT NULL UNIQUE,
    icono  TEXT    NOT NULL,                       -- emoji representativo (UTF-8)
    orden  INTEGER NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- 2. PRODUCTOS (bebidas de la carta)
--    78 referencias: vinos, ginebras, rones, vodkas, whiskies y refrescos
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
    id           INTEGER      PRIMARY KEY AUTOINCREMENT,
    categoria_id INTEGER      NOT NULL,
    nombre       TEXT         NOT NULL,
    precio       DECIMAL(6,2) NOT NULL CHECK (precio >= 0),
    disponible   INTEGER      NOT NULL DEFAULT 1 CHECK (disponible IN (0, 1)),
    es_vino      INTEGER      NOT NULL DEFAULT 0 CHECK (es_vino IN (0, 1)),
    foto_url     TEXT,                            -- NULL si la bebida no tiene foto

    CONSTRAINT fk_productos_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT uq_producto_categoria_nombre
        UNIQUE (categoria_id, nombre)
);

-- ---------------------------------------------------------------------------
-- 3. INFORMACIÓN DEL LOCAL (fila única: horario y redes sociales)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS informacion_bar (
    id               INTEGER PRIMARY KEY CHECK (id = 1),
    horario_apertura TEXT    NOT NULL,             -- 'HH:MM' → '11:30'
    horario_cierre   TEXT    NOT NULL,             -- 'HH:MM' → '02:00' (= 2:00)
    instagram        TEXT    NOT NULL,             -- '@bar_laponderosa'
    facebook         TEXT    NOT NULL,             -- 'Bar La Ponderosa'
    telefono         TEXT    NOT NULL              -- '693789032'
);

-- ---------------------------------------------------------------------------
-- ÍNDICES OPTIMIZADOS
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_productos_categoria  ON productos (categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_nombre     ON productos (nombre);
CREATE INDEX IF NOT EXISTS idx_productos_disponible ON productos (disponible);
CREATE INDEX IF NOT EXISTS idx_productos_es_vino    ON productos (es_vino);
CREATE INDEX IF NOT EXISTS idx_categorias_orden     ON categorias (orden);

COMMIT;
