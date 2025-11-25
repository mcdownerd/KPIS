---
inclusion: always
---

# Tech Stack

## Core Technologies

- **Build Tool**: Vite 5.4
- **Framework**: React 18.3 with TypeScript 5.8
- **Routing**: React Router DOM 6.30
- **Styling**: Tailwind CSS 3.4 with tailwindcss-animate
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: TanStack Query (React Query) 5.83
- **Forms**: React Hook Form 7.61 with Zod validation
- **Charts**: Recharts 2.15
- **Icons**: Lucide React
- **Date Handling**: date-fns 3.6

## Development Tools

- **Linting**: ESLint 9 with TypeScript ESLint
- **Compiler**: SWC (via @vitejs/plugin-react-swc)
- **Package Manager**: npm (package-lock.json present, bun.lockb also present)

## Common Commands

```bash
# Development server (runs on port 8080)
npm run dev

# Production build
npm run build

# Development build
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

## TypeScript Configuration

- Path alias: `@/` maps to `./src/`
- Relaxed type checking: `noImplicitAny: false`, `strictNullChecks: false`
- Allows JavaScript files: `allowJs: true`

## Styling Conventions

- Uses HSL CSS variables for theming (defined in index.css)
- Dark mode support via class strategy
- Custom color palette: primary, secondary, destructive, muted, accent, success, warning, chart colors
- Utility-first approach with Tailwind
- Component variants via class-variance-authority
