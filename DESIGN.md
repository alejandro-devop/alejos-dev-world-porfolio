# Design System — alejos-dev-world

## Glass Effect

**Regla fundamental:** cualquier superficie con efecto glass DEBE incluir `backdrop-filter`. Sin él solo hay un fondo semitransparente, no glass.

### Clase utilitaria: `.glass-card`

Definida en `src/app/globals.css` dentro de `@layer utilities`.

```css
/* Light mode — tinte azul leve para que el blur sea perceptible */
.glass-card {
  background-color: oklch(0.97 0.018 255 / 37%);
  backdrop-filter: blur(8px) saturate(170%);
  -webkit-backdrop-filter: blur(8px) saturate(170%);
  border: 1px solid oklch(0.55 0.08 255 / 14%);
  border-radius: var(--radius-2xl);
}

/* Dark mode */
.dark .glass-card {
  background-color: oklch(0.10 0.015 255 / 55%);
  border-color: oklch(0.75 0.12 255 / 14%);
}
```

> **Nota técnica:** Tailwind 4 compila `backdrop-filter` a `-webkit-backdrop-filter` únicamente.
> Esto es correcto — Chrome y Safari reconocen ambas propiedades. No agregar la versión
> sin prefijo manualmente: PostCSS la elimina en el build de todos modos.

### Cuándo usar `glass-card`

Aplica en cualquier superficie que flote sobre el fondo animado (orbs + waves). El `backdrop-filter` solo tiene efecto visual cuando hay capas con color debajo del elemento — el fondo animado (`BackgroundEffects`, `z-index: 0`) lo garantiza.

Componentes donde se aplica o se planea aplicar:
- `HeroSection` — contenedor principal del hero ✓
- Cards de proyectos
- Cards de servicios
- Cards de testimonios
- Sección About (meta-cards de contacto)
- Cualquier modal o tooltip flotante

### Variantes previstas

Si en el futuro se necesitan variantes de intensidad, extender con modificadores:

```css
/* Más sutil — para cards en secciones con poco contraste de fondo */
.glass-card-sm {
  background-color: oklch(0.99 0 0 / 40%);
  backdrop-filter: blur(10px) saturate(130%);
  -webkit-backdrop-filter: blur(10px) saturate(130%);
  border: 1px solid oklch(0 0 0 / 5%);
}

/* Más opaco — para modales o overlays con mucho texto */
.glass-card-lg {
  background-color: oklch(0.99 0 0 / 78%);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid oklch(0 0 0 / 10%);
}
```

---

## Background Effects (`BackgroundEffects` component)

Componente fijo (`position: fixed; z-index: 0`) que provee el contexto visual para el glass. Sin él, `backdrop-filter` no produce ningún efecto visible.

Capas:
1. **Orbs** — gradientes radiales difusos (ring gradient, no punto central) con animación CSS de flotación
2. **Waves** — 4 grupos de paths SVG orgánicos distribuidos al 12%, 34%, 57%, 78% del viewport
   - Morphing de shape con Framer Motion (`motion.path animate={{ d }}`)
   - Opacidad animada independientemente (simula distancia)
   - Rotación leve alterna por grupo (rompe el efecto "renglón")
   - Parallax en scroll (`useScroll + useTransform`)

Archivo: `src/components/BackgroundEffects.tsx`

---

## Tokens de color (oklch)

El sistema de colores actual en `globals.css` es **acromático** (chroma = 0). Los únicos colores con hue son los del `BackgroundEffects`:

| Elemento | Color | Uso |
|----------|-------|-----|
| Orb azul | `oklch(0.58 0.19 250)` | Fondo top-left |
| Orb violeta | `oklch(0.54 0.21 295)` | Fondo top-right |
| Orb teal | `oklch(0.62 0.15 195)` | Fondo bottom-center |
| Wave stroke (light) | `oklch(0.36 0.22 255)` | Líneas de onda en modo claro |
| Wave stroke (dark) | `oklch(0.74 0.22 255)` | Líneas de onda en modo oscuro |
