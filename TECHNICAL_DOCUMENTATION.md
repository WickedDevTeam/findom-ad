# Technical Documentation: findom-ad

This document provides a technical overview of the `findom-ad` frontend application.

## 1. Overview

This project is a web application built with React (using Vite and TypeScript). It utilizes Supabase for backend services (database, authentication) and features a UI built with shadcn/ui and Tailwind CSS. State management for server data is handled by TanStack Query, while client-side authentication state is managed via React Context.

## 2. Tech Stack

*   **Framework:** React 18
*   **Build Tool:** Vite
*   **Language:** TypeScript
*   **Routing:** React Router v6 (`react-router-dom`)
*   **UI Components:** shadcn/ui (built on Radix UI primitives)
*   **Styling:** Tailwind CSS
*   **State Management (Server):** TanStack Query (`@tanstack/react-query`)
*   **State Management (Client):** React Context (specifically for Auth)
*   **Forms:** React Hook Form (`react-hook-form`)
*   **Schema Validation:** Zod (`zod`)
*   **Backend Service:** Supabase (`@supabase/supabase-js`)
    *   Authentication
    *   Database
*   **Linting/Formatting:** ESLint
*   **Animation:** Framer Motion (`framer-motion`)
*   **Utility Libraries:** `clsx`, `tailwind-merge`, `lucide-react`, `date-fns`, `sonner` (toasts), `recharts` (charts), etc.

## 3. Project Structure

```
.
├── dist/                  # Build output
├── node_modules/          # Dependencies
├── public/                # Static assets
├── src/                   # Source code
│   ├── components/        # Reusable UI components (incl. shadcn/ui, layout, auth)
│   ├── data/              # Data fetching logic or static data
│   ├── hooks/             # Custom React hooks (e.g., useAuth)
│   ├── integrations/      # Integration code (e.g., Supabase client, types)
│   │   └── supabase/
│   │       ├── client.ts  # Supabase client initialization
│   │       └── types.ts   # Auto-generated Supabase DB types
│   ├── lib/               # Utility functions (e.g., cn from shadcn)
│   ├── pages/             # Page-level components used by the router
│   ├── types/             # Global TypeScript types
│   ├── App.css            # Additional global styles
│   ├── App.tsx            # Root component, routing setup, global providers
│   ├── index.css          # Tailwind base styles, global CSS
│   └── main.tsx           # Application entry point
├── supabase/              # Supabase migration/config files (outside src)
├── .env.example           # Example environment variables (assumed, should be created)
├── .gitignore             # Git ignore rules
├── components.json        # shadcn/ui configuration
├── eslint.config.js       # ESLint configuration
├── index.html             # Main HTML entry point for Vite
├── package.json           # Project manifest, dependencies, scripts
├── postcss.config.js      # PostCSS configuration (for Tailwind)
├── README.md              # Project README
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.app.json      # TypeScript config for the app
├── tsconfig.json          # Base TypeScript configuration
├── tsconfig.node.json     # TypeScript config for Node environment (e.g., Vite config)
└── vite.config.ts         # Vite build tool configuration
```

## 4. Getting Started

**Prerequisites:**

*   Node.js and npm/yarn/pnpm/bun
*   A Supabase project (URL and Anon Key required)

**Installation:**

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    # or yarn install / pnpm install / bun install
    ```
3.  Create a `.env` file in the root directory by copying `.env.example` (if it exists) or creating it manually. Add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```
    *(Note: The current `src/integrations/supabase/client.ts` has hardcoded keys. These **should** be replaced with environment variables like the above for security and flexibility.)*

**Running the Development Server:**

```bash
npm run dev
# or yarn dev / pnpm dev / bun dev
```

This will start the Vite development server, typically available at `http://localhost:8080`.

**Building for Production:**

```bash
npm run build
# or yarn build / pnpm build / bun build
```

The production-ready files will be generated in the `dist/` directory.

**Linting:**

```bash
npm run lint
# or yarn lint / pnpm lint / bun lint
```

## 5. Core Concepts

### 5.1. Routing

*   Handled by `react-router-dom` v6.
*   Configuration is in `src/App.tsx`.
*   Uses `<BrowserRouter>`, `<Routes>`, and `<Route>`.
*   Pages are lazy-loaded using `React.lazy` and `Suspense` for improved performance.
*   A common `RootLayout` component wraps most page routes.
*   Includes a `NotFound` page for unmatched routes.

### 5.2. UI and Styling

*   **Component Library:** shadcn/ui provides unstyled, accessible components built using Radix UI. Components are typically added via the shadcn CLI and reside within `src/components/ui`.
*   **Styling:** Tailwind CSS is used for utility-first styling. Configuration is in `tailwind.config.ts`.
*   **Utility Functions:**
    *   `cn` (from `src/lib/utils.ts`): Merges Tailwind classes, handling conflicts (uses `tailwind-merge` and `clsx`).

### 5.3. State Management

*   **Server State:** TanStack Query (`@tanstack/react-query`) manages asynchronous operations like data fetching from Supabase.
    *   Configured in `src/App.tsx` via `QueryClientProvider`.
    *   Provides caching, background updates, stale-while-revalidate, etc.
    *   Likely used within custom hooks (`src/hooks/`) or directly in components/pages to fetch and mutate data.
*   **Client State (Authentication):** React Context API is used in `src/components/auth/AuthProvider.tsx`.
    *   Provides `session`, `user`, and `loading` state related to Supabase Auth.
    *   Uses Supabase's `onAuthStateChange` listener for real-time updates.
    *   Consumed via `useAuth` hook (`src/hooks/use-auth.tsx`).

### 5.4. Backend Integration (Supabase)

*   The Supabase JavaScript client (`@supabase/supabase-js`) is used for all backend interactions.
*   Client initialized in `src/integrations/supabase/client.ts`.
    *   **IMPORTANT:** Credentials should be loaded from environment variables (`.env`) rather than being hardcoded.
*   Type safety is provided by `src/integrations/supabase/types.ts`, generated from the database schema.
*   Interactions include:
    *   Authentication (`supabase.auth.signInWithPassword`, `supabase.auth.signUp`, `supabase.auth.signOut`, `supabase.auth.onAuthStateChange`, `supabase.auth.getSession`).
    *   Database operations (`supabase.from('table').select()`, `.insert()`, `.update()`, `.delete()`).
    *   Potentially Storage and Realtime features if used.

### 5.5. Forms

*   React Hook Form (`react-hook-form`) is used for managing form state and validation.
*   Zod (`zod`) is integrated (via `@hookform/resolvers`) for schema definition and validation. Schemas likely defined alongside form components or in `src/types/`.

## 6. API Routes / Endpoints

This project primarily interacts with the **Supabase backend** via its client library, not traditional REST or GraphQL API routes defined within this codebase. The "API" consists of:

*   **Supabase Database Tables:** Accessed via `supabase.from('table_name').<operation>`. The available tables and columns are defined in your Supabase project schema (and reflected in `src/integrations/supabase/types.ts`).
*   **Supabase Auth Endpoints:** Handled implicitly by `supabase.auth` methods.
*   **Supabase Storage Endpoints:** Accessed via `supabase.storage` methods (if used).
*   **Supabase Edge Functions:** If Edge Functions are deployed in the associated Supabase project, they can be invoked via `supabase.functions.invoke('function_name')`.

Refer to your Supabase project dashboard and the `src/integrations/supabase/types.ts` file for details on available tables, columns, and potentially functions.

## 7. Environment Variables

The application expects the following environment variables (defined in a `.env` file at the root):

*   `VITE_SUPABASE_URL`: Your Supabase project URL.
*   `VITE_SUPABASE_ANON_KEY`: Your Supabase project's anonymous (public) key.

*(Prefix `VITE_` is necessary for Vite to expose these variables to the client-side code.)*

## 8. Deployment

Deployment instructions are not explicitly defined in the explored files. However, a typical deployment process for a Vite/React app like this would involve:

1.  Running `npm run build`.
2.  Deploying the contents of the generated `dist/` directory to a static web hosting provider (e.g., Vercel, Netlify, AWS S3/CloudFront, GitHub Pages).
3.  Ensuring the hosting provider is configured for single-page applications (SPA) to handle client-side routing correctly (usually by redirecting all requests to `index.html`).
4.  Configuring the necessary environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the hosting provider's settings.

---

*This document was auto-generated based on codebase analysis. It should be reviewed and updated as the project evolves.* 