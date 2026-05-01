# Contribuir

Este repo es un portafolio personal, pero las contribuciones (typos, mejoras, sugerencias) son bienvenidas.

## Flujo

1. Haz fork del repo y crea una rama desde `main`:
   ```bash
   git checkout -b feat/mi-cambio
   ```
2. Instala dependencias y arranca el dev server:
   ```bash
   pnpm install
   pnpm dev
   ```
3. Antes de abrir el PR, valida en local:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm build
   ```
4. Abre un Pull Request describiendo el cambio. Vercel generará un preview automático.

## Convenciones

- **Commits**: estilo [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`, ...).
- **Contenido**: edita [lib/data.ts](lib/data.ts) para texto y datos. Imágenes en `public/`.
- **Estilos**: Tailwind CSS 4 + tokens definidos en `app/globals.css`. Reutiliza componentes de `components/ui/` (shadcn).
- **Accesibilidad**: respeta los lints de `eslint-plugin-jsx-a11y`.

## Reportar bugs

Abre un issue describiendo el problema, navegador/SO y pasos para reproducirlo.
