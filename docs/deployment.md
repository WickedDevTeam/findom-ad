
# Deployment Guide

This document outlines the deployment process for the Findom Directory application.

## Deployment Platform

The application is deployed using the Lovable platform, which provides:

- Build pipeline
- Hosting infrastructure
- Domain management
- Environment variable management

## Deployment Process

### Standard Deployment

1. From the Lovable interface, click "Share" -> "Publish" to deploy the latest version.
2. The application will be built and deployed to a Lovable subdomain (`*.lovable.app`).
3. Once deployed, the application will be accessible at the provided URL.

### Custom Domain Deployment

To deploy to a custom domain:

1. Navigate to Project > Settings > Domains in the Lovable interface.
2. Click "Connect Domain" and follow the instructions to connect your domain.
3. Configure DNS settings with your domain provider by adding the CNAME record provided by Lovable.
4. Wait for DNS propagation (usually 24-48 hours).
5. Once connected, the application will be accessible at your custom domain.

Note: A paid Lovable plan is required to connect a custom domain.

## Environment Configuration

The application relies on environment variables for configuration. Key variables include:

- Supabase URL and API keys
- Other service API keys (if applicable)

### Supabase Configuration

The Supabase project URL and keys are configured in `src/integrations/supabase/client.ts`:

```typescript
const SUPABASE_URL = "https://qeuvbyajwdqcwwrpuigz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

For security, the service role key should only be used in secure server environments, not in the client-side application.

## Build Configuration

The build process is configured in `vite.config.ts`:

```typescript
export default defineConfig(({ mode }) => ({
  // Server configuration
  server: {
    host: "::",
    port: 8080,
  },
  
  // Plugins
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  
  // Path aliases
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  // Build optimizations
  build: {
    minify: true,
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Chunk configuration...
        }
      }
    },
  },
}));
```

Key build optimizations include:

- Code minification
- CSS minification
- Manual chunking for better loading performance
- Development-only plugins

## Deployment Checklist

Before deploying, ensure:

1. All features are working as expected in the development environment
2. Authentication flows are properly configured in Supabase
3. Database access and RLS policies are correctly set up
4. All API keys and environment variables are configured
5. Build process completes successfully

## Post-Deployment Verification

After deploying, verify:

1. The application loads correctly
2. Authentication flows (signup, login, logout) work
3. Data is being fetched and displayed correctly
4. Forms and interactive elements function as expected
5. Responsive design works across device sizes

## Rollback Procedure

To roll back to a previous version:

1. From the Lovable interface, navigate to the "Versions" tab.
2. Find the desired version and click the revert button.
3. Confirm the rollback when prompted.

## Monitoring and Maintenance

After deployment, monitor:

1. Application performance
2. Error rates
3. User feedback
4. Database performance

Regular maintenance tasks:

1. Keep dependencies updated
2. Review and optimize database queries
3. Monitor Supabase usage and quotas
4. Apply security patches as needed

## CI/CD Pipeline

For continuous integration and deployment:

1. Connect the project to a GitHub repository
2. Configure automatic builds on push to main branch
3. Set up staging environments for testing before production deployment
4. Implement automated testing where possible

## Troubleshooting

Common deployment issues and solutions:

1. **Blank Screen After Deployment**
   - Check for JavaScript errors in the console
   - Verify build configuration and paths

2. **Authentication Issues**
   - Confirm Supabase project settings
   - Check CORS configuration in Supabase

3. **Missing Assets**
   - Verify file paths and import statements
   - Check build output for correct asset references

4. **Database Connection Errors**
   - Confirm Supabase API keys are correct
   - Verify RLS policies

5. **Slow Performance**
   - Review network waterfall for bottlenecks
   - Check for excessive API calls or large bundle sizes
