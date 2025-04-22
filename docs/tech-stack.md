
# Technology Stack

## Frontend

- **Framework**: React 18.3.1
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: Shadcn UI (custom components built on Radix UI)
- **Routing**: React Router DOM (v6.26.2)
- **State Management**: React Query (@tanstack/react-query v5.56.2) for server state
- **Animations**: Framer Motion (v12.7.4)
- **Icons**: Lucide React (v0.462.0)
- **Form Handling**: React Hook Form (v7.53.0) with Zod validation
- **Date Handling**: date-fns (v3.6.0)
- **Toast Notifications**: Sonner (v1.5.0)

## Backend (Serverless)

- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **API Layer**: Supabase client library (v2.49.4)
- **Serverless Functions**: Supabase Edge Functions (Deno runtime)

## Development Tools

- **Package Manager**: npm
- **Type Checking**: TypeScript
- **Formatting**: Prettier (inferred)
- **Deployment**: Lovable platform

## Key Libraries

| Library | Purpose |
|---------|---------|
| @radix-ui/* | UI component primitives |
| @tanstack/react-query | Data fetching and caching |
| class-variance-authority | Component styling variants |
| clsx | Class name utilities |
| framer-motion | Animations and transitions |
| lucide-react | Icon library |
| react-hook-form | Form handling |
| zod | Schema validation |
| tailwind-merge | Tailwind class merging utility |
| tailwindcss-animate | Animation utilities for Tailwind |

## Environment Setup

The project is built and deployed using the Lovable platform, which provides a development environment with hot reloading and preview capabilities.

Local development can be performed by:
1. Cloning the repository
2. Installing dependencies via `npm install`
3. Running the development server with `npm run dev`
