# Portafolio — Nicolas A. Urbaez A.

Sitio personal estático construido con **Next.js 16**, **React 19**, **Tailwind CSS 4** y **shadcn/ui**, desplegado en **Vercel**.

> URL: <https://nikoidev.com>

---

## Stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack, prerender estático)
- [React 19](https://react.dev/)
- [TypeScript 5.7](https://www.typescriptlang.org/) en modo `strict`
- [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/), [next-themes](https://github.com/pacocoursey/next-themes)
- [Vercel Analytics](https://vercel.com/analytics)
- [pnpm](https://pnpm.io/) como gestor de paquetes

---

## Requisitos

- Node.js **22** o superior
- pnpm **10** (`npm install -g pnpm`)

---

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Abre <http://localhost:3000>.

### Scripts disponibles

| Comando             | Descripción                                |
| ------------------- | ------------------------------------------ |
| `pnpm dev`          | Servidor de desarrollo con Turbopack.      |
| `pnpm build`        | Build de producción.                       |
| `pnpm start`        | Sirve el build de producción.              |
| `pnpm lint`         | ESLint (flat config, `next/core-web-vitals` + `next/typescript`). |
| `pnpm typecheck`    | `tsc --noEmit`.                            |

---

## Editar el contenido

Todo el contenido del portfolio (perfil, habilidades, experiencia, formación, proyectos) está centralizado en [lib/data.ts](lib/data.ts). Edita ese archivo y haz commit — Vercel re-despliega automáticamente.

- **Imágenes de proyectos**: súbelas a `public/` (por ejemplo `public/projects/erp-dashboard.png`) y referencia la ruta en `projectsData.images[].url`.
- **CV (PDF)**: colócalo en `public/cv/cv.pdf`. Será accesible en `/cv/cv.pdf`.

---

## Estructura

```
.
├── app/                  # App Router (layout, page, globals.css)
├── components/
│   ├── sections/         # Secciones de la landing (hero, about, skills, ...)
│   ├── ui/               # Primitivas shadcn/ui
│   └── *.tsx             # navbar, footer, theme-toggle, ...
├── hooks/                # Hooks reutilizables
├── lib/
│   ├── data.ts           # ⭐ Contenido del portfolio
│   └── utils.ts
├── public/               # Assets estáticos (favicons, imágenes, cv/)
├── styles/               # Estilos globales adicionales
├── eslint.config.mjs     # ESLint flat config
├── next.config.mjs       # Config de Next.js (strict mode, image patterns)
├── vercel.json           # Headers de seguridad
└── tsconfig.json         # TS estricto, alias @/*
```

---

## Despliegue

Conectado a Vercel. Cada push a `main` despliega producción; cada PR genera un preview.

`vercel.json` añade headers de seguridad (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).

---

## CI

GitHub Actions ([.github/workflows/ci.yml](.github/workflows/ci.yml)) corre `lint`, `typecheck` y `build` en cada push y PR.

---

## Licencia

Código bajo licencia [MIT](LICENSE).
