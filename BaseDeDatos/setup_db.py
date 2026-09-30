#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bar La Ponderosa — Inicializador de base de datos SQLite
=========================================================

Crea (o recrea) el archivo `BaseDeDatos/ponderosa.sqlite` ejecutando:

    1. schema.sql              → CREATE TABLE + índices
    2. datos_iniciales.sql     → INSERT de 7 categorías, 78 productos
                                 y 1 fila de información del local

Requisitos:
    · Python 3.6+ (solo librería estándar: `sqlite3` incluido)
    · No necesita paquetes externos ni servidor SQL

Uso:
    python setup_db.py              # crea la BD (falla si ya existe)
    python setup_db.py --force      # borra y regenera la BD
    python setup_db.py --check      # solo valida la BD existente

Al terminar verifica:
    · PRAGMA integrity_check
    · PRAGMA foreign_key_check
    · Conteos esperados: 7 categorías / 78 productos / 1 info bar
    · Precio total y número de vinos (11)
"""

import argparse
import sqlite3
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
SCHEMA_FILE = BASE_DIR / "schema.sql"
DATA_FILE = BASE_DIR / "datos_iniciales.sql"
DB_FILE = BASE_DIR / "ponderosa.sqlite"

# Conteos mínimos que deben cumplirse (carta real del bar)
ESPERADO_CATEGORIAS = 7
ESPERADO_PRODUCTOS = 78
ESPERADO_INFO = 1


def fallo(msg: str) -> None:
    print(f"[ERROR] {msg}", file=sys.stderr)
    sys.exit(1)


def verificar(conn: sqlite3.Connection) -> None:
    """Comprueba integridad, claves foráneas y conteos."""
    integridad = conn.execute("PRAGMA integrity_check;").fetchone()[0]
    if integridad != "ok":
        fallo(f"integrity_check falló: {integridad}")

    fk = conn.execute("PRAGMA foreign_key_check;").fetchall()
    if fk:
        fallo(f"foreign_key_check encontró {len(fk)} problemas: {fk[:5]}")

    cats = conn.execute("SELECT COUNT(*) FROM categorias;").fetchone()[0]
    prods = conn.execute("SELECT COUNT(*) FROM productos;").fetchone()[0]
    info = conn.execute("SELECT COUNT(*) FROM informacion_bar;").fetchone()[0]

    if cats != ESPERADO_CATEGORIAS:
        fallo(f"categorias = {cats}, se esperaban {ESPERADO_CATEGORIAS}")
    if prods != ESPERADO_PRODUCTOS:
        fallo(f"productos = {prods}, se esperaban {ESPERADO_PRODUCTOS}")
    if info != ESPERADO_INFO:
        fallo(f"informacion_bar = {info}, se esperaba {ESPERADO_INFO}")

    # Categoría sin productos = error de coherencia
    vacias = conn.execute(
        "SELECT COUNT(*) FROM categorias c "
        "WHERE NOT EXISTS (SELECT 1 FROM productos p WHERE p.categoria_id = c.id);"
    ).fetchone()[0]
    if vacias:
        fallo(f"{vacias} categoría(s) sin productos")

    vinos = conn.execute("SELECT COUNT(*) FROM productos WHERE es_vino = 1;").fetchone()[0]
    total = conn.execute("SELECT ROUND(SUM(precio), 2) FROM productos;").fetchone()[0]

    print("  integridad ......... OK")
    print("  claves foráneas .... OK")
    print(f"  categorias ......... {cats}")
    print(f"  productos .......... {prods}  ({vinos} vinos)")
    print(f"  informacion_bar .... {info}")
    print(f"  suma precios ....... {total:.2f} €")


def crear_bd() -> None:
    for f in (SCHEMA_FILE, DATA_FILE):
        if not f.is_file():
            fallo(f"No se encuentra {f.name} (junto a setup_db.py)")

    if DB_FILE.exists():
        DB_FILE.unlink()
        print(f"[i] Base de datos anterior eliminada: {DB_FILE.name}")

    conn = sqlite3.connect(DB_FILE)
    try:
        conn.execute("PRAGMA foreign_keys = ON;")
        # executescript hace COMMIT implícito al final de cada script
        conn.executescript(SCHEMA_FILE.read_text(encoding="utf-8"))
        print("[1/3] Esquema creado (3 tablas + 5 índices).")
        conn.executescript(DATA_FILE.read_text(encoding="utf-8"))
        print("[2/3] Datos iniciales insertados (7 categorías, 78 productos).")
        conn.commit()
        print("[3/3] Verificación:")
        verificar(conn)
    finally:
        conn.close()

    print(f"\n[OK] Base de datos lista: {DB_FILE}")


def solo_verificar() -> None:
    if not DB_FILE.exists():
        fallo(f"No existe {DB_FILE.name}. Ejecuta: python setup_db.py")
    conn = sqlite3.connect(DB_FILE)
    try:
        print("Verificación de la BD existente:")
        verificar(conn)
    finally:
        conn.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Genera ponderosa.sqlite")
    parser.add_argument("--force", "-f", action="store_true",
                        help="Borra y regenera la base de datos")
    parser.add_argument("--check", "-c", action="store_true",
                        help="Solo verifica la BD existente (no la crea)")
    args = parser.parse_args()

    if args.check:
        solo_verificar()
    else:
        if DB_FILE.exists() and not args.force:
            fallo(f"Ya existe {DB_FILE.name}. Usa --force para regenerarla.")
        crear_bd()


if __name__ == "__main__":
    main()
