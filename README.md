# 🍷 Cartas — Bar La Ponderosa

Repositorio dedicado a la gestión y despliegue de las cartas digitales del **Bar La Ponderosa**.

Contiene la **carta completa de bebidas** (vinos, destilados y refrescos), la **carta de vinos con fotografías** de temporada y la página original de referencia.

---

## 📦 Estructura del Repositorio

```text
La ponde/
├── README.md                       # Documentación del proyecto (este archivo)
├── horarios_redes.md               # 📄 Fuente de datos: horario, redes y teléfono
│
├── Completo/                       # 🍸 Carta digital COMPLETA (versión principal)
│   ├── index.html                  # Estructura semántica de la página
│   ├── styles.css                  # Estilos responsive (Mobile-First)
│   ├── script.js                   # Filtros, búsqueda y navegación (JS vanilla)
│   ├── Combinados.md               # 📄 Fuente de datos: carta unificada (78 bebidas)
│   └── logo_ponderosa.jpeg         # Logo oficial del bar
│
├── Carta de Vinos/                 # 🍷 Carta de vinos con fotos (temporada de invierno)
│   ├── index.html                  # Página principal
│   ├── styles.css                  # Estilos y diseño visual
│   ├── script.js                   # Filtros, buscador, modal y scroll
│   ├── carta_vinos.md              # 📄 Fuente de datos: precios y catálogo
│   ├── logo_ponderosa.jpeg         # Logo oficial del bar
│   └── fotos/                      # 📸 11 fotografías de las botellas
│
└── Original/                       # 🌐 Página original guardada (referencia)
    ├── Carta digital - Bar La Ponderosa.html
    └── Carta digital - Bar La Ponderosa_files/   # Recursos guardados (logo, iconos…)
```

---

## 🍸 Carta Completa — `Completo/`

Versión principal y más completa: **78 referencias repartidas en 7 categorías**, con precios por unidad servida en barra.

### 📋 Características
- **Filtros por pestañas:** Vinos Tintos, Vinos Blancos, Ginebras, Rones, Vodkas, Whiskies y Refrescos/Zumos, con contador de referencias en cada pestaña.
- **Búsqueda en tiempo real:** insensible a tildes y mayúsculas, multi-palabra y que también consulta la categoría (buscar `whisky` o `vino tinto` funciona).
- **Estado vacío con reinicio:** mensaje de "sin resultados" con botón para volver a toda la carta.
- **Navegación inteligente:** los enlaces del navbar y del pie activan automáticamente su categoría y desplazan suavemente hasta la carta.
- **Barra superior dinámica:** horario, redes, teléfono e indicador de **Abierto / Cerrado** en función del horario (11:30–2:00).
- **Diseño Mobile-First responsive:** de 1 a 4 columnas según pantalla, con menú hamburguesa en móvil.
- **Estética elegante:** tonos granate, negro y dorado, tarjetas con efecto hover y accesibilidad (`aria`, teclado y `prefers-reduced-motion`).

### 📊 Catálogo por categoría

| Categoría | Referencias | Precio |
|---|---:|---|
| 🍷 Vinos Tintos | 4 | 1,20 – 2,00 € |
| 🥂 Vinos Blancos | 7 | 2,00 € |
| 🍸 Ginebras | 13 | 5,00 – 7,00 € |
| 🍹 Rones | 9 | 5,00 – 12,00 € |
| 🧊 Vodkas | 4 | 5,00 – 7,00 € |
| 🥃 Whiskies | 14 | 5,00 – 13,00 € |
| 🥤 Refrescos, Zumos y Otras Bebidas | 27 | 1,50 – 2,50 € |
| **Total** | **78** | |

> Listado completo con todos los nombres y precios en [`Completo/Combinados.md`](Completo/Combinados.md).

---

## 🍷 Carta de Vinos — `Carta de Vinos/`

Versión adaptada exclusivamente para la **temporada de invierno**, centrada en una experiencia completa de vinos sin servicio de cocina.

### 📋 Características
- **Menú exclusivo de vinos** con filtros por categoría (Tintos y Blancos) y contador de resultados.
- **Fotografías individuales** de cada botella con **modal de detalle** (foto, precio e información).
- **Búsqueda** por nombre de vino.
- **Diseño Responsive** Mobile-First con navegación y efectos de scroll.
- **Información del local:** horarios de invierno y enlaces a redes sociales.

### 🍷 Catálogo de Vinos

**Vinos Tintos:** Viña Puebla Tempranillo · Albai · 10.12 · Berberana

**Vinos Blancos:** 10.12 Semidulce · Dulce Eva · Viña Pelina Semidulce · Viña Pelina Verdejo · Amor del Bueno · Pozanco Verdejo · Barbadillo

---

## 🌐 Original — `Original/`

Copia de seguridad de la **página original** del bar guardada desde el navegador, junto con sus recursos (logo `logoponde.png`, iconos de alérgenos y tipografías). Sirve como referencia histórica y fuente de estilos o contenido.

---

## 📄 Fuentes de Datos

| Archivo | Contenido |
|---|---|
| `horarios_redes.md` | Horario 11:30–2:00, Instagram, Facebook y teléfono |
| `Completo/Combinados.md` | Carta unificada: las 78 bebidas con sus precios |
| `Carta de Vinos/carta_vinos.md` | Catálogo de vinos, precios y datos del local |

---

## 🕒 Horarios e Información

- **Horario de atención:** 11:30 – 2:00 (todos los días)
- **Instagram:** [@bar_laponderosa](https://instagram.com/bar_laponderosa)
- **Facebook:** [Bar La Ponderosa](https://facebook.com/BarLaPonderosa)
- **Teléfono:** 693 789 032

---

## 🚀 Cómo visualizarlo

1. Abre directamente el archivo `index.html` de la carpeta que quieras ver (`Completo/` o `Carta de Vinos/`) en el navegador, o
2. Sirve la carpeta con un servidor local:

```bash
cd "La ponde/Completo"
python -m http.server 8000
# → http://localhost:8000
```

---

## 🛠 Tecnologías

- **HTML5** semántico
- **CSS3** moderno (Custom Properties, Grid, Flexbox, `clamp()`, animaciones) — Mobile-First
- **JavaScript vanilla** sin dependencias ni pasos de compilación
