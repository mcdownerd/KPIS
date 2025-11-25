---
inclusion: always
---

# Project Structure

## Directory Organization

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui base components (buttons, cards, dialogs, etc.)
│   ├── delivery/       # Delivery-specific components
│   ├── products/       # Product management components
│   └── utilities/      # Utilities consumption components
├── pages/              # Route-level page components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries (e.g., utils.ts with cn helper)
├── types/              # TypeScript type definitions
├── utils/              # Business logic utilities
├── App.tsx             # Root app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles and CSS variables
```

## Architecture Patterns

### Component Organization

- **UI Components** (`src/components/ui/`): Reusable, unstyled base components from shadcn/ui
- **Feature Components** (`src/components/`): Business logic components at root level
- **Domain Components** (`src/components/{domain}/`): Domain-specific components grouped by feature area (delivery, products, utilities)
- **Pages** (`src/pages/`): Top-level route components that compose feature components

### Routing Structure

- `/` - Main dashboard (Index.tsx)
- `/products` - Product expiration management
- `/utilities` - Utilities consumption tracking
- `/delivery` - Delivery cash sheet
- `*` - 404 Not Found page

All routes defined in `App.tsx` with React Router DOM.

### Import Conventions

- Use `@/` path alias for all imports from `src/`
- Example: `import { Button } from "@/components/ui/button"`
- Example: `import { cn } from "@/lib/utils"`

### Component Patterns

- Functional components with TypeScript
- Props interfaces defined inline or exported
- shadcn/ui components for consistent UI
- Lucide React for icons
- Card-based layouts for metrics and data display
- Tabs for organizing related content sections

### State Management

- TanStack Query for server state (if needed)
- React Hook Form for form state
- Local component state with useState
- No global state management library (Redux, Zustand, etc.)

### Type Definitions

- Domain types in `src/types/` (delivery.ts, product.ts, utilities.ts)
- Component prop types defined inline or in component files
- Utility function types in respective util files
