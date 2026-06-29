# 🏗️ TAREAS - Fun Facts ✅ COMPLETADO

> Proyecto: App web de curiosidades con Next.js + Supabase

---

## FASE 0 — Scaffolding del proyecto ✅

| # | Tarea | Estado |
|---|-------|--------|
| 0.1 | Inicializar proyecto Next.js (TypeScript + Tailwind + App Router) | ✅ |
| 0.2 | Instalar dependencias | ✅ |
| 0.3 | Configurar shadcn/ui (tema pergamino/crema) | ✅ |
| 0.4 | Crear cliente Supabase + .env.local | ✅ |
| 0.5 | Estructura de directorios | ✅ |
| 0.6 | Layout global + Providers + Minimalist toggle | ✅ |
| 0.7 | Fuentes (Playfair Display serif + Geist sans) | ✅ |

## FASE 1 — Supabase (Base de Datos) ✅

| # | Tarea | Estado |
|---|-------|--------|
| 1.1 | Schema SQL (facts, topicos, fact_topicos + RLS + funciones + trigger) | ✅ |
| 1.2 | Ejecutado en Supabase SQL Editor | ✅ |

## FASE 2 — Frontend Core ✅

| # | Tarea | Estado |
|---|-------|--------|
| 2.1 | ThemeProvider + modo minimalista | ✅ |
| 2.2 | FactCard (título + tópicos, expandible) | ✅ |
| 2.3 | Página principal `/` con grid responsive | ✅ |
| 2.4 | Vista detalle `/fact/[id]` con fuentes | ✅ |
| 2.5 | BackButton que preserva filtros en URL | ✅ |
| 2.6 | Tarjetas sugeridas (mismos tópicos) | ✅ |
| 2.7 | Estados vacíos ("No se ha encontrado nada así") | ✅ |
| 2.8 | Toggle Modo Minimalista | ✅ |

## FASE 3 — Filtros + Formulario ✅

| # | Tarea | Estado |
|---|-------|--------|
| 3.1 | Filtro por tópico (combobox) | ✅ |
| 3.2 | Filtro con/sin fuentes (toggle) | ✅ |
| 3.3 | Filtro por longitud (Corto/Medio/Extenso) | ✅ |
| 3.4 | Filtro orden temporal (creación/modificación) | ✅ |
| 3.5 | TopicCombobox creatable ("Añadir nuevo") | ✅ |
| 3.6 | Formulario de creación con fuentes dinámicas | ✅ |
| 3.7 | Normalización visual (capitalizar 1ª letra tópicos) | ✅ |

## FASE 4 — UX + Responsive ✅

| # | Tarea | Estado |
|---|-------|--------|
| 4.1 | Responsive (grid 1/2/3 cols, áreas táctiles) | ✅ |
| 4.2 | Build + Lint pasan | ✅ |

---

## 📁 Estructura final del proyecto

```
funfacter/
├── .env.local
├── components.json
├── next.config.ts
├── sql/schema.sql
├── SETUP.md
├── TAREAS.md
├── src/
│   ├── app/
│   │   ├── globals.css          # Tema pergamino + minimalista
│   │   ├── layout.tsx           # Root layout con fonts + providers
│   │   ├── page.tsx             # Home con filtros + grid + form
│   │   ├── providers.tsx        # Client-side providers
│   │   └── fact/[id]/page.tsx   # Vista detalle
│   ├── components/
│   │   ├── FactGrid.tsx         # Grid con filtros (Server)
│   │   ├── FactCard.tsx         # Tarjeta expandible (Client)
│   │   ├── Filters.tsx          # Barra de filtros (Client)
│   │   ├── TopicCombobox.tsx    # Combobox creatable (Client)
│   │   ├── CreateFactForm.tsx   # Formulario creación (Client)
│   │   ├── SuggestedCards.tsx   # Tarjetas relacionadas (Server)
│   │   ├── BackButton.tsx       # Botón volver (Client)
│   │   ├── EmptyState.tsx       # Estado vacío
│   │   ├── MinimalistToggle.tsx # Toggle minimalista
│   │   └── ui/                  # shadcn/ui components
│   ├── contexts/
│   │   └── ThemeContext.tsx
│   └── lib/
│       ├── supabase.ts
│       ├── types.ts
│       └── utils.ts
```

## 🚀 Para ejecutar

```bash
npm run dev
```
