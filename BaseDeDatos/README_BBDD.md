# 🗄️ README — Base de Datos · Bar La Ponderosa

Documentación de la estructura de datos del catálogo de bebidas y los datos
del local. **Todos los archivos están dentro de `BaseDeDatos/`** y los ficheros
web existentes no se han modificado.

**Fuentes de los datos:** `README.md`, `horarios_redes.md`, `Completo/Combinados.md`

---

## 📁 Contenido de la carpeta

| Archivo | Descripción |
|---|---|
| `schema.sql` | DDL: 3 tablas + claves primarias/foráneas + 5 índices |
| `datos_iniciales.sql` | 7 categorías + **78 productos** + 1 fila de información del local |
| `bebidas.json` | Exportación completa en JSON (para Fetch API sin servidor SQL) |
| `setup_db.py` | Script Python que crea y verifica `ponderosa.sqlite` |
| `ponderosa.sqlite` | **Base de datos SQLite ya generada y verificada** |
| `README_BBDD.md` | Este documento |

---

## 🧱 Estructura de las tablas

### `categorias`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `nombre` | TEXT | NOT NULL, UNIQUE |
| `icono` | TEXT | NOT NULL (emoji UTF-8: 🍷🥂🍸🍹🧊🥃🥤) |
| `orden` | INTEGER | NOT NULL, DEFAULT 0 (orden en la web) |

### `productos`

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `categoria_id` | INTEGER | FK → `categorias(id)` · ON DELETE RESTRICT, ON UPDATE CASCADE |
| `nombre` | TEXT | NOT NULL |
| `precio` | DECIMAL(6,2) | NOT NULL, `CHECK (precio >= 0)` |
| `disponible` | INTEGER | 0/1, DEFAULT 1, `CHECK IN (0,1)` |
| `es_vino` | INTEGER | 0/1, DEFAULT 0, `CHECK IN (0,1)` |
| `foto_url` | TEXT | NULL si no hay foto (los 11 vinos sí tienen) |

- **UNIQUE (categoria_id, nombre)** → impide duplicados dentro de una categoría.
- **FK con RESTRICT** → no se puede borrar una categoría que tenga productos.

### `informacion_bar` *(fila única: `CHECK (id = 1)`)*

| Columna | Ejemplo |
|---|---|
| `horario_apertura` | `11:30` |
| `horario_cierre` | `02:00` (las 2:00 AM del horario "11:30-2:00") |
| `instagram` | `@bar_laponderosa` |
| `facebook` | `Bar La Ponderosa` |
| `telefono` | `693789032` |

### Índices

```
idx_categorias_orden      → categorias(orden)
idx_productos_categoria   → productos(categoria_id)   (JOINs por categoría)
idx_productos_nombre      → productos(nombre)         (búsqueda)
idx_productos_disponible  → productos(disponible)     (filtros)
idx_productos_es_vino     → productos(es_vino)        (filtros)
```

### Distribución de los 78 productos

| # | Categoría | Productos |
|---|---|---|
| 1 | Vinos Tintos | 4 |
| 2 | Vinos Blancos | 7 |
| 3 | Ginebras | 13 |
| 4 | Rones | 9 |
| 5 | Vodkas | 4 |
| 6 | Whiskies | 14 |
| 7 | Refrescos, Zumos y Otras Bebidas | 27 |
| | **Total** | **78** |

---

## ▶️ Cómo ejecutar la inicialización

### Opción A — Script Python (recomendada)

```bash
cd BaseDeDatos
python setup_db.py            # crea ponderosa.sqlite
python setup_db.py --force    # borra y regenera
python setup_db.py --check    # solo verifica la BD existente
```

- Requisitos: **Python 3.6+** (usa solo la librería estándar `sqlite3`).
- El script valida al final: `integrity_check`, `foreign_key_check`,
  conteos (7/78/1) y la suma de precios.

### Opción B — sqlite3 CLI (sin Python)

```bash
cd BaseDeDatos
sqlite3 ponderosa.sqlite < schema.sql
sqlite3 ponderosa.sqlite < datos_iniciales.sql
```

### Opción C — DB Browser for SQLite / DBeaver

Abrir `ponderosa.sqlite` → *Execute SQL* → pegar el contenido de
`schema.sql` y después el de `datos_iniciales.sql`.

> ✅ La base `ponderosa.sqlite` incluida en esta carpeta ya está generada
> con todos los datos y supera la verificación (integrity_check: *ok*).

---

## 🔌 Cómo conectar la base de datos con la web

### Opción 1 — `bebidas.json` + Fetch API (sin backend) ✅ la más simple

El sitio `Completo/` es HTML/CSS/JS puro: si no hay servidor SQL, se consume
directamente el JSON. **Copiar `bebidas.json` dentro de `Completo/`** (o servir
la raíz del proyecto) y:

```js
// Cargar la carta completa desde la BD en JSON
async function cargarCarta() {
  const res  = await fetch('./bebidas.json');   // o '/BaseDeDatos/bebidas.json'
  const data = await res.json();

  for (const cat of data.categorias) {
    console.log(cat.icono, cat.nombre, cat.productos.length);
    cat.productos.forEach(p => {
      // p.nombre · p.precio (€) · p.disponible · p.es_vino · p.foto_url
    });
  }

  // Datos del local (footer/horarios)
  console.log(data.bar.horario.texto);   // "11:30 - 2:00"
  console.log(data.bar.instagram);       // @bar_laponderosa
  console.log(data.bar.telefono);        // 693789032
}

cargarCarta();
```

Formato de precio: número (`5.00`), mostrar en español:

```js
new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(p.precio);
// → "5,00 €"
```

### Opción 2 — Backend ligero que sirve la SQLite

Ejemplo mínimo con Python + Flask (o FastAPI, Express…):

```python
from flask import Flask, g, jsonify
import sqlite3, pathlib

DB = pathlib.Path(__file__).parent / "ponderosa.sqlite"
app = Flask(__name__)

def db():
    if "db" not in g:
        g.db = sqlite3.connect(DB)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.route("/api/carta")
def carta():
    categorias = db().execute(
        "SELECT id, nombre, icono, orden FROM categorias ORDER BY orden"
    ).fetchall()
    out = []
    for c in categorias:
        productos = db().execute(
            "SELECT id, nombre, precio, disponible, es_vino, foto_url "
            "FROM productos WHERE categoria_id = ? AND disponible = 1",
            (c["id"],),
        ).fetchall()
        out.append({**dict(c), "productos": [dict(p) for p in productos]})
    return jsonify(out)

@app.route("/api/info")
def info():
    return jsonify(dict(db().execute("SELECT * FROM informacion_bar WHERE id = 1").fetchone()))

if __name__ == "__main__":
    app.run(port=5000)
```

La web solo necesita cambiar la URL del `fetch` a `/api/carta`, que devuelve
**exactamente la misma estructura** que `bebidas.json`.

### Opción 3 — Node.js

```js
// npm i better-sqlite3
const Database = require('better-sqlite3');
const db = new Database('./BaseDeDatos/ponderosa.sqlite', { readonly: true });

app.get('/api/carta', (req, res) => {
  res.json(db.prepare('SELECT * FROM categorias ORDER BY orden').all());
});
```

---

## 📌 Notas de diseño

- **`disponible` y `es_vino` son INTEGER 0/1** con `CHECK`: es la forma
  canónica de booleanos en SQLite (no existe tipo BOOLEAN nativo).
- **`precio` es DECIMAL(6,2)** → en SQLite se almacena con afinidad NUMERIC
  (1.80 se guarda como 1.8); el formato "1,80 €" se aplica al mostrarlo.
- **`horario_cierre = '02:00'`** normaliza el "2:00" del archivo
  `horarios_redes.md` para poder comparar horas fácilmente en JS/SQL.
- **`foto_url`** apunta a `Carta de Vinos/fotos/…` (11 vinos con foto);
  el resto es `NULL`.
- Regenerar la BD es **idempotente** con `setup_db.py --force`.
- Si cambia la carta, editar `datos_iniciales.sql` **y** `bebidas.json`
  (mantener ambos sincronizados con `Completo/Combinados.md`).

## ✅ Verificación ejecutada

```
PRAGMA encoding      → UTF-8
PRAGMA integrity_check → ok
PRAGMA foreign_key_check → (sin filas = sin errores)
categorias=7  productos=78  informacion_bar=1
es_vino=1  (11 vinos con foto)
Conteos por categoría: 4 / 7 / 13 / 9 / 4 / 14 / 27 = 78 ✔
```
