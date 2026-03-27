# Copilot Instructions for Digital Launchpad

## Project Overview

**Digital Launchpad** is an Indonesian digital agency landing page and admin dashboard built with React + TypeScript + Vite. It showcases web/app development services with pricing tiers, portfolio display, and a client order management system.

**Key characteristics:**
- Modern SPA with hero, pricing, portfolio, and contact sections
- Admin dashboard at `/admin` for managing orders and portfolio projects
- Client-side data persistence using localStorage (no backend)
- Heavy use of animations (Framer Motion) and UI polish (shadcn/ui)
- Target audience: Indonesian small businesses and agencies

## Architecture Patterns

### Component Organization
- **Page components** (`src/pages/`): Top-level routed components (Index, Admin, NotFound)
- **Feature components** (`src/components/`): Reusable section/page parts (Navbar, HeroSection, PricingCard, OrderForm)
- **UI components** (`src/components/ui/`): shadcn/ui primitives imported via CLI (button, card, form, dialog, etc.)

**Pattern:** Each feature component is ~50-150 lines, handles its own state/forms, and uses Framer Motion for entrance animations with `initial={{ opacity: 0, y: 40 }}` + `whileInView={{ opacity: 1, y: 0 }}`

### Data Flow
- **State management:** React hooks + localStorage (zero backend/database)
- **Forms:** react-hook-form + Zod validation (see `src/lib/validation.ts` for schemas)
- **Data storage:** `src/lib/store.ts` exports functions (getOrders, addOrder, updateOrderStatus, getPortfolio, addPortfolioProject, deletePortfolioProject)
- **No API calls:** All data operations are synchronous, read/write from localStorage

### Type System
All types in `src/types/index.ts`. Key entities:
- `Order` (id, name, email, whatsapp, packageType, details, status, createdAt)
- `PortfolioProject` (id, title, description, imageUrl, projectUrl, tags, createdAt)
- `PricingPackage` (id, name, features[], price, target audience)
- `OrderStatus` enum: "new" | "contacted" | "dealing" | "closed"

### Styling
- **Tailwind CSS** with custom config (postcss-config.js, tailwind.config.ts)
- **shadcn/ui** components pre-configured with Radix UI primitives
- **Custom CSS** classes in `src/App.css` and `src/index.css` (gradients, animations)
- **Convention:** Use `className="text-gradient"` for gradient text, `bg-gradient-secondary` for gradient fills

## Development Workflows

### Commands
```bash
bun dev              # Start dev server (port 8080, HMR without overlay)
bun build            # Production build to dist/
bun build:dev        # Development build (for debugging)
bun lint             # ESLint check (most rules disabled for flexibility)
bun test             # Run vitest once (finds .test.ts/.spec.tsx in src/)
bun test:watch       # Watch mode for tests
```

### Build Configuration
- **Vite** with React SWC plugin for fast compilation
- **Path alias:** `@/` → `src/` (configured in vite.config.ts, tsconfig.json)
- **Entry:** `index.html` + `src/main.tsx` → renders App.tsx with React Router + QueryClient setup
- **TypeScript:** Loose config (allowJs: true, noImplicitAny: false, noUnusedLocals: false)

### Testing
- **Vitest** with jsdom environment (see vitest.config.ts)
- Setup file: `src/test/setup.ts`
- Example test: `src/test/example.test.ts`
- **Actual tests:** Minimal; focus on integration with components

## Project-Specific Patterns & Conventions

### Form Handling
1. Define Zod schema in `src/lib/validation.ts` (export both schema AND type)
2. Use react-hook-form with zodResolver: `useForm<FormData>({ resolver: zodResolver(schema) })`
3. Register inputs and render error messages from `formState.errors`
4. Example: OrderForm.tsx shows pattern with submit loading state and Zod validation

### Admin Dashboard State Management
- Admin page manages two tabs ("orders" | "portfolio") with local state
- Orders: Display table with status badges (color-coded: new/contacted/dealing/closed), inline status dropdown
- Portfolio: Add/delete projects via modal form, displays project grid
- See Admin.tsx (`src/pages/Admin.tsx`) for full implementation

### Animation Patterns
- All animated sections use Framer Motion's `motion.div` with:
  - `initial={{ opacity: 0, y: 40 }}` (offscreen, transparent)
  - `whileInView={{ opacity: 1, y: 0 }}` (on scroll into view, once: true)
  - `transition={{ delay: index * 0.15, duration: 0.6, type: "spring" }}`
  - Hover effects: `whileHover={{ y: -8 }}`
- Example: PricingCard.tsx demonstrates this pattern with staggered card animations

### Configuration Data
- Pricing packages, labels, and constants defined in `src/config/pricing.ts`
- Pricing must include PRICE_PACKAGES array with Package IDs matching enums in types (basic_web, web_app_cms, mobile_app)
- Seed portfolio data in `src/lib/store.ts` SEED_PORTFOLIO (lazy-loaded on first access)

### localStorage Keys
- `agency_orders` → Order[]
- `agency_portfolio` → PortfolioProject[]
- Always check existence with `getItems(key, seed)` for graceful fallback

## External Dependencies & Critical Integrations

### UI Framework
- **shadcn/ui**: Pre-built Radix UI components; add new ones via `npx shadcn-ui@latest add <component>`
- **Radix UI**: Primitives underlying all shadcn components (accessible, keyboard support)
- **Tailwind CSS v3**: All styling; DO NOT use inline `style` prop unless necessary

### Form & Validation
- **react-hook-form**: Lightweight form state management
- **@hookform/resolvers**: Zod integration for schema validation
- **Zod**: Runtime type-safe validation schemas (use for all forms)

### Animation & Interaction
- **Framer Motion**: All page transitions and micro-interactions
- **Lucide React**: Icon library (used in buttons, admin UI, etc.)

### Data & Utilities
- **@tanstack/react-query**: Wrapped in App but not actively used (ready for API integration)
- **date-fns**: Available but not heavily used (consider if adding timestamps)
- **clsx / class-variance-authority**: Conditional className utilities (already in shadcn template)

### Layout & Display
- **embla-carousel-react**: Not actively used; available for future carousel features
- **cmdk**: Command palette component (unused; available if needed)

## File Naming & Structure Rules

- **Components:** PascalCase, one per file (e.g., OrderForm.tsx, PricingCard.tsx)
- **Utilities/stores:** camelCase (e.g., store.ts, validation.ts, utils.ts)
- **Pages:** PascalCase with src/pages/ prefix (e.g., Index.tsx, Admin.tsx)
- **UI components:** Match shadcn convention (lowercase-with-dashes.tsx inside src/components/ui/)
- **Exports:** Default export for page/component files; named exports for utils/hooks

## Code Quality & Linting

- **ESLint:** Loose config (most rules disabled) to prioritize developer flexibility
- **No formatter:** Project uses direct file edits; no Prettier enforced
- **TypeScript:** Permissive (strictNullChecks: false, noImplicitAny: false) for faster iteration
- **Unused code allowed:** noUnusedLocals/noUnusedParameters both false (intentional)

## Common Tasks for AI Agents

### Adding a New Feature Section
1. Create component in `src/components/YourFeature.tsx`
2. Use Framer Motion entrance animation (copy pattern from PricingCard)
3. Add to Index.tsx page layout
4. Style with Tailwind + existing CSS variables (text-gradient, bg-gradient-secondary, etc.)

### Modifying Pricing/Package Data
1. Edit `src/config/pricing.ts` PRICING_PACKAGES array
2. Ensure PackageType enum in `src/types/index.ts` includes new package IDs
3. Update Admin dashboard if adding new package-related fields

### Adding Form Validation
1. Define Zod schema in `src/lib/validation.ts`
2. Export both schema and inferred type
3. Integrate in component using react-hook-form + zodResolver pattern

### Updating Admin Dashboard
1. Modify state shape in Admin.tsx if adding columns/fields
2. Update store functions in `src/lib/store.ts` to handle new Order/PortfolioProject fields
3. Update Admin render logic (table rows, form inputs, etc.)
4. Test localStorage persistence by checking browser DevTools Application tab

### Deploying Build
1. Run `bun build` (outputs to dist/)
2. Push to repository or deploy dist/ folder to hosting (Vercel, Netlify, etc.)
3. Ensure `/admin` route accessible post-deploy (check router configuration)

---

**Last Updated:** March 2026
**Framework Stack:** React 18 + TypeScript + Vite + Tailwind + shadcn/ui
**Package Manager:** Bun
