<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# alejos-dev-world — contexto para agentes

Portfolio público **Next.js (App Router)**, bilingüe (`en` / `es`).

## Fuente de contenido

En **producción y desarrollo normal** el contenido no se edita en JSON: el sitio lo obtiene del **admin API** (`alejos-dev-world-admin`).

| Pieza | Ubicación |
|-------|-----------|
| Loaders (`getHero`, `getAbout`, …) | `src/lib/content.ts` (re-export en `src/data/index.ts`) |
| Config API, cache, secciones | `src/config/backend.ts` |
| Tipos de payload | `src/types/content.ts` |
| Variables de entorno | `.env.local` — ver `.env.local.example` |
| Revalidación on-demand | `POST /api/revalidate` (`src/app/api/revalidate/route.ts`) |

### Cómo carga el contenido

1. Si `BACKEND_URL` está definido y la sección está en `BACKEND_SECTIONS` → `GET {BACKEND_URL}/api/{locale}/content?sections=…` con header `X-API-Key` (`BACKEND_API_KEY`).
2. Si la API falla o devuelve datos vacíos/incompletos → **fallback** a `src/data/{locale}/{section}.json` (salvo `testimonials`: sin fallback, la sección se oculta).
3. Sin `BACKEND_URL` → solo JSON estático (útil para UI sin backend).

**Secciones conectadas por defecto** (`BACKEND_SECTIONS` sin definir): `hero`, `about`, `skills`, `experience`, `projects`, `services`, `testimonials`.

**Aún en JSON** (hasta conectar al API): `seo`, `blog`. El contacto usa `about.email` desde el API.

### Cache

- Dev: sin cache (`cache: 'no-store'`) salvo `BACKEND_REVALIDATE_SECONDS`.
- Prod: ISR 60s por defecto; tags `portfolio-content-{locale}-{section}` para `POST /api/revalidate`.

## Estructura del sitio

- **Home:** `src/app/[locale]/page.tsx` — Hero, About, Skills, Experience, Projects, Services, Testimonials, Contact.
- **Blog:** `src/app/[locale]/blog/` (oculto en nav/home por ahora).
- **Componentes:** `src/components/` (secciones en `sections/`).
- **i18n:** rutas `/{locale}/…`, config en `src/config/i18n.ts`.

## Dev local

Desde la raíz del workspace:

```bash
pnpm dev          # API :8080, admin :5173, portfolio :3000 (API local)
pnpm preview      # build + start del portfolio contra API local
```

Solo portfolio contra API de producción: `pnpm dev` dentro de `alejos-dev-world` (usa `BACKEND_URL` de `.env.local`).

## Estilos y diseño

Ver [`DESIGN.md`](DESIGN.md) (glass effects, tokens, `BackgroundEffects`).

## Rollout / pendientes

Estado detallado: [`.cursor/rules/portfolio-backend-rollout.mdc`](../.cursor/rules/portfolio-backend-rollout.mdc). Siguiente sección a conectar: **`seo`**.

## Backend (schemas, endpoints, admin)

Ver [`../alejos-dev-world-admin/BACKEND_CONTEXT.md`](../alejos-dev-world-admin/BACKEND_CONTEXT.md).
