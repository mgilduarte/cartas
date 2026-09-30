-- ============================================================================
--  Bar La Ponderosa — Datos iniciales (SQLite)
--  Archivo: datos_iniciales.sql   ·   Ejecutar DESPUÉS de schema.sql
--
--  Fuente de verdad: Completo/Combinados.md (78 referencias y precios)
--                    horarios_redes.md     (horario y redes sociales)
--
--  Contenido:
--    · 7 categorías (orden de las pestañas de la carta web)
--    · 78 productos con precio exacto en euros
--    · 1 fila de información del local
--
--  Nota: los apóstrofos de los nombres se escapan duplicándolos ('' ) y
--        los precios usan punto decimal (1.80) para respetar el formato
--        numérico de SQL estándar.
-- ============================================================================

BEGIN;

-- --------------------------------------------------------------------------
-- CATEGORÍAS
-- --------------------------------------------------------------------------
INSERT INTO categorias (id, nombre, icono, orden) VALUES
    (1, 'Vinos Tintos',                   '🍷', 1),
    (2, 'Vinos Blancos',                  '🥂', 2),
    (3, 'Ginebras',                       '🍸', 3),
    (4, 'Rones',                          '🍹', 4),
    (5, 'Vodkas',                         '🧊', 5),
    (6, 'Whiskies',                       '🥃', 6),
    (7, 'Refrescos, Zumos y Otras Bebidas', '🥤', 7);

-- --------------------------------------------------------------------------
-- PRODUCTOS — VINOS TINTOS (4)
-- --------------------------------------------------------------------------
INSERT INTO productos (id, categoria_id, nombre, precio, disponible, es_vino, foto_url) VALUES
    (1,  1, 'Vino Tinto Viña Puebla Tempranillo', 1.80, 1, 1, 'Carta de Vinos/fotos/vinapuebla.jpg'),
    (2,  1, 'Vino Tinto Albai',                   1.50, 1, 1, 'Carta de Vinos/fotos/albai.jpg'),
    (3,  1, 'Vino Tinto 10.12',                   2.00, 1, 1, 'Carta de Vinos/fotos/1012tinto.png'),
    (4,  1, 'Vino Tinto Berberana',               1.20, 1, 1, 'Carta de Vinos/fotos/berberana.jpg');

-- --------------------------------------------------------------------------
-- PRODUCTOS — VINOS BLANCOS (7)
-- --------------------------------------------------------------------------
INSERT INTO productos (id, categoria_id, nombre, precio, disponible, es_vino, foto_url) VALUES
    (5,  2, 'Vino Blanco 10.12 Semidulce',          2.00, 1, 1, 'Carta de Vinos/fotos/1012blanco.png'),
    (6,  2, 'Vino Blanco Dulce Eva',                2.00, 1, 1, 'Carta de Vinos/fotos/dulceeva.jpg'),
    (7,  2, 'Vino Blanco Viña Pelina Semidulce',    2.00, 1, 1, 'Carta de Vinos/fotos/semidulcevinapelina.jpg'),
    (8,  2, 'Vino Blanco Viña Pelina Verdejo',      2.00, 1, 1, 'Carta de Vinos/fotos/verdejovinapelina.jpg'),
    (9,  2, 'Vino Blanco Amor del Bueno',           2.00, 1, 1, 'Carta de Vinos/fotos/amor_del_bueno.jpg'),
    (10, 2, 'Vino Blanco Pozanco Verdejo',          2.00, 1, 1, 'Carta de Vinos/fotos/pozanco_Verdejo.png'),
    (11, 2, 'Vino Blanco Barbadillo',               2.00, 1, 1, 'Carta de Vinos/fotos/barbadillo.jpg');

-- --------------------------------------------------------------------------
-- PRODUCTOS — GINEBRAS (13)
-- --------------------------------------------------------------------------
INSERT INTO productos (id, categoria_id, nombre, precio, disponible, es_vino, foto_url) VALUES
    (12, 3, 'Larios',                5.00, 1, 0, NULL),
    (13, 3, 'Beefeater',             5.00, 1, 0, NULL),
    (14, 3, 'Beefeater Pink',        5.00, 1, 0, NULL),
    (15, 3, 'Beefeater Black',       5.00, 1, 0, NULL),
    (16, 3, 'Gordon''s',             5.00, 1, 0, NULL),
    (17, 3, 'Tanqueray',             5.00, 1, 0, NULL),
    (18, 3, 'Seagram''s',            6.00, 1, 0, NULL),
    (19, 3, 'Seagram''s 0.0',        5.50, 1, 0, NULL),
    (20, 3, 'Martin Miller''s',      7.00, 1, 0, NULL),
    (21, 3, 'Puerto de Indias Melon',     5.00, 1, 0, NULL),
    (22, 3, 'Puerto de Indias Strawberry',5.00, 1, 0, NULL),
    (23, 3, 'Puerto de Indias Classic',   5.00, 1, 0, NULL),
    (24, 3, 'Puerto de Indias Black Berry',5.00, 1, 0, NULL);

-- --------------------------------------------------------------------------
-- PRODUCTOS — RONES (9)
-- --------------------------------------------------------------------------
INSERT INTO productos (id, categoria_id, nombre, precio, disponible, es_vino, foto_url) VALUES
    (25, 4, 'Barceló',        5.00,  1, 0, NULL),
    (26, 4, 'Brugal',         5.00,  1, 0, NULL),
    (27, 4, 'Cacique',        5.00,  1, 0, NULL),
    (28, 4, 'Cacique 500',    8.00,  1, 0, NULL),
    (29, 4, 'Santa Teresa',   5.00,  1, 0, NULL),
    (30, 4, 'Legendario',     5.00,  1, 0, NULL),
    (31, 4, 'Capitán Morgan', 5.00,  1, 0, NULL),
    (32, 4, 'Bacardí',        5.00,  1, 0, NULL),
    (33, 4, 'Zacapa',        12.00,  1, 0, NULL);

-- --------------------------------------------------------------------------
-- PRODUCTOS — VODKAS (4)
-- --------------------------------------------------------------------------
INSERT INTO productos (id, categoria_id, nombre, precio, disponible, es_vino, foto_url) VALUES
    (34, 5, 'Absolut',   6.00, 1, 0, NULL),
    (35, 5, 'Smirnoff',  5.00, 1, 0, NULL),
    (36, 5, 'Eristoff',  5.00, 1, 0, NULL),
    (37, 5, 'Cîroc',     7.00, 1, 0, NULL);

-- --------------------------------------------------------------------------
-- PRODUCTOS — WHISKIES (14)
-- --------------------------------------------------------------------------
INSERT INTO productos (id, categoria_id, nombre, precio, disponible, es_vino, foto_url) VALUES
    (38, 6, 'J&B',                     5.00, 1, 0, NULL),
    (39, 6, 'Ballantine''s',           5.00, 1, 0, NULL),
    (40, 6, 'Ballantine''s 10',        5.00, 1, 0, NULL),
    (41, 6, 'Johnnie Walker Red Label',5.00, 1, 0, NULL),
    (42, 6, 'Johnnie Walker Black Label',7.00, 1, 0, NULL),
    (43, 6, 'White Label',             5.00, 1, 0, NULL),
    (44, 6, 'Cutty Sark',              5.00, 1, 0, NULL),
    (45, 6, '100 Pipers',              5.00, 1, 0, NULL),
    (46, 6, 'Jameson',                 5.00, 1, 0, NULL),
    (47, 6, 'Four Roses',              5.00, 1, 0, NULL),
    (48, 6, 'Jack Daniel''s',          7.00, 1, 0, NULL),
    (49, 6, 'Jim Beam',                5.00, 1, 0, NULL),
    (50, 6, 'Glenfiddich',             7.50, 1, 0, NULL),
    (51, 6, 'Macallan',               13.00, 1, 0, NULL);

-- --------------------------------------------------------------------------
-- PRODUCTOS — REFRESCOS, ZUMOS Y OTRAS BEBIDAS (27)
-- --------------------------------------------------------------------------
INSERT INTO productos (id, categoria_id, nombre, precio, disponible, es_vino, foto_url) VALUES
    (52, 7, 'Coca-Cola Normal',             2.00, 1, 0, NULL),
    (53, 7, 'Coca-Cola Zero (CCZ)',         2.00, 1, 0, NULL),
    (54, 7, 'Coca-Cola Zero Zero (CCZZ)',   2.00, 1, 0, NULL),
    (55, 7, 'Fanta Naranja',                2.00, 1, 0, NULL),
    (56, 7, 'Fanta Limón',                  2.00, 1, 0, NULL),
    (57, 7, 'Seven Up',                     2.00, 1, 0, NULL),
    (58, 7, 'Sprite',                       2.00, 1, 0, NULL),
    (59, 7, 'Red Bull',                     2.50, 1, 0, NULL),
    (60, 7, 'Aquarius de Limón',            2.50, 1, 0, NULL),
    (61, 7, 'Aquarius de Naranja',          2.50, 1, 0, NULL),
    (62, 7, 'Zumo de Piña',                 2.00, 1, 0, NULL),
    (63, 7, 'Zumo de Melocotón',            2.00, 1, 0, NULL),
    (64, 7, 'Zumo de Tomate',               2.00, 1, 0, NULL),
    (65, 7, 'Batido de Chocolate',          2.00, 1, 0, NULL),
    (66, 7, 'Batido de Vainilla',           2.00, 1, 0, NULL),
    (67, 7, 'Nestea Maracuyá',              2.50, 1, 0, NULL),
    (68, 7, 'Nestea de Limón',              2.50, 1, 0, NULL),
    (69, 7, 'Nestea de Frutos Rojos',       2.50, 1, 0, NULL),
    (70, 7, 'Tónica Schweppes',             2.00, 1, 0, NULL),
    (71, 7, 'Schweppes de Limón',           2.00, 1, 0, NULL),
    (72, 7, 'Tónica Royal Bliss',           2.00, 1, 0, NULL),
    (73, 7, 'Royal Bliss Berry',            2.00, 1, 0, NULL),
    (74, 7, 'Royal Bliss de Limón',         2.00, 1, 0, NULL),
    (75, 7, 'Mosto',                        1.50, 1, 0, NULL),
    (76, 7, 'Tinto de Verano',              2.00, 1, 0, NULL),
    (77, 7, 'Tinto de Verano La Casera',    2.50, 1, 0, NULL),
    (78, 7, 'Tinto de Verano La Casera 0.0',2.50, 1, 0, NULL);

-- --------------------------------------------------------------------------
-- INFORMACIÓN DEL LOCAL (fila única — horarios_redes.md)
--   Horario 11:30 – 2:00 → cierre normalizado a '02:00'
-- --------------------------------------------------------------------------
INSERT INTO informacion_bar (id, horario_apertura, horario_cierre, instagram, facebook, telefono)
VALUES (1, '11:30', '02:00', '@bar_laponderosa', 'Bar La Ponderosa', '693789032');

COMMIT;
