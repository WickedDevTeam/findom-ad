
# Database Schema

The project uses Supabase PostgreSQL as its database. This document outlines the database schema, table relationships, and key operations.

## Database Tables

### Core Tables

#### `creators`
Stores information about creator profiles that are displayed in the directory.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Creator's display name |
| username | text | Unique username for URL paths |
| profile_image | text | URL to profile image |
| cover_image | text | URL to cover image (optional) |
| bio | text | Creator biography/description |
| social_links | jsonb | Social media and payment links |
| is_verified | boolean | Verification status |
| is_featured | boolean | Featured profile status |
| is_new | boolean | New profile flag |
| type | text | Creator type/category |
| user_id | uuid | Related user account (optional) |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

#### `categories`
Stores category information for filtering creators.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Category name |
| slug | text | URL-friendly identifier |
| emoji | text | Category emoji icon (optional) |
| created_at | timestamptz | Creation timestamp |

#### `creator_categories`
Junction table for many-to-many relationship between creators and categories.

| Column | Type | Description |
|--------|------|-------------|
| creator_id | uuid | Foreign key to creators |
| category_id | uuid | Foreign key to categories |

#### `creator_galleries`
Stores gallery images for creator profiles.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| creator_id | uuid | Foreign key to creators |
| image_url | text | URL to gallery image |
| created_at | timestamptz | Creation timestamp |

#### `profiles`
Stores extended user profile information.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (matches auth.users) |
| email | text | User email (optional) |
| full_name | text | User's full name (optional) |
| display_name | text | User's display name (optional) |
| username | text | Unique username (optional) |
| avatar_url | text | URL to profile avatar (optional) |
| bio | text | User biography (optional) |
| interests | jsonb | User interests array (optional) |
| is_admin | boolean | Admin status flag |
| subscription_tier | text | Subscription level (optional) |
| subscription_status | text | Subscription status (optional) |
| subscription_expires_at | timestamptz | Subscription expiry (optional) |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

#### `favorites`
Tracks user-favorited creators.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to users |
| creator_id | uuid | Foreign key to creators |
| created_at | timestamptz | Creation timestamp |

#### `listings`
Stores user submissions for new creator listings.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Submitted name |
| username | text | Submitted username |
| email | text | Contact email |
| category | text | Primary category |
| type | text | Creator type |
| bio | text | Submitted biography (optional) |
| twitter | text | Twitter username (optional) |
| cashapp | text | CashApp username (optional) |
| onlyfans | text | OnlyFans username (optional) |
| throne | text | Throne wishlist (optional) |
| status | text | 'pending', 'approved', 'rejected' |
| user_id | uuid | Submitting user (optional) |
| submitted_at | timestamptz | Submission timestamp |
| updated_at | timestamptz | Last update timestamp |

#### `notifications`
Stores user notifications.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Target user (optional) |
| title | text | Notification title |
| message | text | Notification message |
| type | text | Notification type |
| link | text | Related URL (optional) |
| is_read | boolean | Read status |
| created_at | timestamptz | Creation timestamp |

#### `site_config`
Stores site-wide configuration settings.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| key | text | Configuration key |
| value | jsonb | Configuration value |
| updated_at | timestamptz | Last update timestamp |
| updated_by | uuid | User who last updated |

#### `sync_history`
Tracks data synchronization events (from external sources like Notion).

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| started_at | timestamptz | Sync start timestamp |
| completed_at | timestamptz | Sync completion timestamp |
| success | boolean | Success status |
| stats | jsonb | Sync statistics |
| message | text | Status message (optional) |
| status | text | 'pending', 'complete', 'failed' |
| sync_type | text | Type of synchronization |

## Database Functions

### `is_admin()`
Checks if the current user has admin privileges.

```sql
CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$function$
```

### `handle_new_user()`
Trigger function to create a profile record when a new user signs up.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$function$
```

## Row Level Security (RLS) Policies

The database uses Row Level Security to control access to data. Key RLS policies include:

- Profiles can only be viewed/edited by the user who owns them or admins
- Favorites can only be viewed/created/deleted by the user who owns them
- Listings can be created by any authenticated user but only viewed/edited by admins
- Notifications can only be viewed by the target user

## Database Relationships

- Each creator can belong to multiple categories (many-to-many through creator_categories)
- Each creator can have multiple gallery images (one-to-many to creator_galleries)
- Each user can have one profile record (one-to-one with auth.users)
- Each user can favorite multiple creators (many-to-many through favorites)
- Each user can submit multiple listings (one-to-many to listings)

## Authentication Schema

Authentication is managed by Supabase Auth, which provides:
- Email/password authentication
- Social provider authentication (configurable)
- Session management
- User metadata
