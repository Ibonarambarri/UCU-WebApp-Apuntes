# P2 — Preparación Parcial 2 (DWYM, FIT-UCU)

Segundo parcial: **React** (UT4) + **React Router y Context** (UT5).
Todo el código está escrito "estilo principiante": sin abreviaciones, sin
trucos, y con TODO comentado en español.

## Qué hay en cada carpeta

| Carpeta | Qué es |
|---|---|
| `Ejers/` | Los ejercicios de clase resueltos, uno por carpeta, separados por tema (`UT4/` y `UT5/`). Los enunciados originales (`TA_UT4.docx`, `Ejer_UT5_*.png`) siguen ahí. |
| `parciales/` | Parciales y simulacros de **segundo parcial** de años anteriores (org `ucu-fit-dwym/historial-pruebas`), cada uno en su carpeta, resueltos, con un `APUNTES-PARCIAL.md` que explica lo importante y dónde estaba lo difícil. |
| `apuntes/` | Súper apuntes por temática (React básico, hooks, router, context, fetch/json-server, CSS, JS usado, setup, patrones de parcial). Empezar por `apuntes/00-INDICE.md`. |

## Cómo correr cualquier cosa

```bash
# Ejercicios: las dependencias se instalan UNA vez por UT
cd Ejers/UT4 && npm install        # (ya está hecho; solo si borraste node_modules)
cd TA04-contador && npm run dev    # abre http://localhost:5173

# Parciales: cada uno es un proyecto completo; leer su APUNTES-PARCIAL.md
cd parciales/2026sem1-prueba2-vespertino && npm install && npm start
```

Node usado: v26 (funciona igual con v24, que es la que pide el curso).
