
# Project Architecture

## Directory Structure

The project follows a feature-based organization with shared components:

```
src/
├── components/      # UI components
│   ├── admin/       # Admin-specific components
│   ├── auth/        # Authentication components
│   ├── creators/    # Creator listing components
│   ├── forms/       # Form components
│   ├── home/        # Homepage components
│   ├── layout/      # Layout components (sidebar, navbar)
│   ├── profile/     # User profile components
│   ├── promotion/   # Promotion-related components
│   ├── shared/      # Shared utility components
│   └── ui/          # UI primitives (shadcn components)
├── data/            # Static data and mock data
├── hooks/           # Custom React hooks
├── integrations/    # External service integrations
│   └── supabase/    # Supabase client and types
├── lib/             # Utility functions
├── pages/           # Page components (route endpoints)
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Application Flow

1. **Entry Point**: `main.tsx` bootstraps the application
2. **Routing**: `App.tsx` defines all routes using React Router
3. **Layout**: `RootLayout.tsx` provides the base layout with sidebar and navigation
4. **Pages**: Each route renders a page component from the `pages/` directory
5. **Components**: Pages compose components from the `components/` directory
6. **Data Fetching**: Components use custom hooks or React Query to fetch data
7. **State Management**: Combination of React Query for server state and React context for UI state

## Key Architecture Patterns

### Component Composition

The application uses a component composition pattern, where complex UI elements are built from smaller, reusable components. This approach enhances maintainability and reusability.

### Container/Presenter Pattern

Many features follow a container/presenter pattern:
- Container components handle data fetching and business logic
- Presenter components focus on rendering and user interaction

### Hooks for Reusable Logic

Custom hooks encapsulate reusable logic, such as:
- `useAuth` - Authentication state and methods
- `useIsMobile` - Responsive design detection
- `useToast` - Toast notification display

### Context for Global State

React Context is used for global state management:
- `AuthContext` - User authentication state
- `SidebarContext` - Sidebar visibility state

## Data Flow

1. **Data Source**: Supabase database tables
2. **API Client**: Supabase JavaScript client
3. **Data Fetching**: React Query or direct Supabase client calls
4. **Component State**: Data passed down through props or context
5. **UI Rendering**: Components render based on data state
6. **User Interactions**: Event handlers update data through Supabase client
7. **Optimistic Updates**: React Query manages optimistic updates and refetching

## Error Handling

- React Query's error handling for data fetching
- Form validation with Zod and React Hook Form
- Toast notifications for user feedback
- Error boundaries for UI recovery (inferred)

## Responsive Design Strategy

The application uses a mobile-first approach with:
- Tailwind's responsive breakpoints
- Custom `useIsMobile` hook
- Responsive layout components (Sidebar, Navbar)
- Adaptive rendering based on screen size
