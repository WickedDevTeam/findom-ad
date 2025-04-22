
# Key Components

This document outlines the major components in the application, their purpose, and how they work together.

## Layout Components

### RootLayout
`src/components/layout/RootLayout.tsx`

The root container for all pages, providing:
- Responsive layout structure
- Sidebar (collapsible on mobile)
- Top navigation bar
- Content area with animation transitions
- Footer

### Navbar
`src/components/layout/Navbar.tsx`

The top navigation bar that includes:
- Logo
- Search functionality (on certain pages)
- User profile dropdown or authentication buttons
- Mobile menu toggle

### Sidebar
`src/components/layout/Sidebar.tsx`

The main navigation sidebar that includes:
- Logo
- Category navigation links
- User profile section
- Collapsible functionality for mobile

### Footer
`src/components/ui/footer.tsx`

Site footer with:
- Copyright information
- Key links
- Social media
- Legal information

## Creator Components

### CreatorGrid
`src/components/creators/CreatorGrid.tsx`

A responsive grid display for creator cards that:
- Takes an array of creators
- Renders them in a responsive grid layout
- Handles responsive sizing across device widths

### CreatorCard
`src/components/creators/CreatorCard.tsx`

Card component for displaying creator previews:
- Creator image
- Name and username
- Verification badge
- Category tags
- Favorite button

### CreatorDetailHero
`src/components/creators/CreatorDetailHero.tsx`

Hero section for the creator detail page:
- Cover image
- Profile image
- Creator details
- Social links
- Favorite button
- Quick action buttons

### CreatorGallery
`src/components/creators/CreatorGallery.tsx`

Gallery component for displaying creator images:
- Grid layout for images
- Lightbox functionality for image viewing
- Responsive design for different screen sizes

### FavoriteButton
`src/components/creators/FavoriteButton.tsx`

Interactive button for favoriting creators:
- Heart icon with animation
- Toggles between favorite/unfavorite state
- Animated interactions and feedback
- Syncs with Supabase database

## Form Components

### ListingSubmissionForm
`src/components/forms/ListingSubmissionForm.tsx`

Form for users to submit new creator listings:
- Multi-step form process
- Form validation
- Image uploads
- Category selection
- Social media links
- Preview functionality

### ProfileDetailsForm
`src/components/profile/ProfileDetailsForm.tsx`

Form for users to update their profile details:
- Personal information
- Profile image upload
- Bio and interests
- Form validation
- Save confirmation

## Authentication Components

### AuthProvider
`src/components/auth/AuthProvider.tsx`

Context provider for authentication state:
- Manages auth state across the application
- Handles session persistence
- Provides authentication methods

### SignupPage
`src/pages/SignupPage.tsx`

User registration page:
- Email/password registration form
- Form validation
- Success/error handling
- Redirects to appropriate pages

### SigninPage
`src/pages/SigninPage.tsx`

User login page:
- Email/password login form
- Form validation
- Error handling
- Redirects after successful login

## Admin Components

### AdminPage
`src/pages/AdminPage.tsx`

Admin dashboard page with tabs for different admin functions:
- Dashboard overview with stats
- Listing submissions management
- Data synchronization tools
- User management

### Submissions
`src/components/admin/Submissions.tsx`

Interface for managing listing submissions:
- Table of pending submissions
- Approval/rejection actions
- Detail view for each submission
- Filter and sorting options

## UI Component Library

The application uses a custom UI component library built on Shadcn UI, which is based on Radix UI primitives. Key components include:

### Basic UI Elements
- `Button` - Versatile button component with variants
- `Card` - Card container with header, content, and footer sections
- `Dialog` - Modal dialog component
- `Form` - Form components with validation integration
- `Sidebar` - Collapsible sidebar with interactive components
- `Toast` - Toast notification system

### Interactive Components
- `Dropdown` - Dropdown menus and selects
- `Tabs` - Tabbed interface components
- `Toggle` - Toggle switches and buttons
- `Tooltip` - Information tooltips

### Layout Components
- `Accordion` - Collapsible content sections
- `AspectRatio` - Maintains aspect ratios for media
- `ScrollArea` - Customized scrollable containers
- `Separator` - Visual separators for content sections

### Data Display
- `Avatar` - User avatar component with fallbacks
- `Badge` - Status and category badges
- `Progress` - Progress indicators
- `Table` - Data table components

## Integration Pattern

Components are composed together following these patterns:

1. **Page Components** - Container components that:
   - Fetch data (using React Query)
   - Handle page-level state
   - Compose UI from smaller components

2. **Feature Components** - Focused on specific features:
   - Creator cards and lists
   - Form submissions
   - Profile management

3. **UI Components** - Low-level UI elements:
   - Buttons, inputs, cards
   - Layout primitives
   - Utility components

This structure creates a flexible, maintainable component hierarchy that separates concerns and promotes reusability.
