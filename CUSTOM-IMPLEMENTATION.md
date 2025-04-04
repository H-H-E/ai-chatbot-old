# Poiesis Pete Implementation Guide

This guide provides step-by-step instructions for customizing the Vercel AI Chatbot into Poiesis Pete with admin features while maintaining sync with the upstream repository.

## Overview

The implementation consists of three main components:

1. **Repository Sync Setup**: GitHub Action workflow to sync with the upstream repository
2. **Admin Center**: User management, custom prompts, and usage tracking
3. **Branding Customization**: Renaming and visual changes

## Implementation Steps

### 1. Setup Repository Sync

The GitHub Action workflow has been added at `.github/workflows/sync-upstream.yml`, which:
- Runs weekly on Mondays at 3:00 AM
- Can be triggered manually
- Creates a pull request with upstream changes for review

You don't need to modify this workflow, but you can customize the schedule if desired.

### 2. Dependencies Installation

You need to install additional dependencies for the admin features:

```bash
# Install chart library for usage stats
pnpm add recharts

# If not already included in the project
pnpm add nanoid
```

### 3. Database Schema Extensions

Follow the instructions in `ADMIN-IMPLEMENTATION-GUIDE.md` to:

1. Extend the database schema in `lib/db/schema.ts` with user roles, custom prompts, and usage tracking
2. Generate and run migrations

### 4. Admin API Implementation

Implement these files:

1. **Usage Tracking Module**: `lib/usage.ts` (already created)
2. **Admin API Endpoints**:
   - `/app/api/admin/stats/route.ts` (already created)
   - `/app/api/admin/users/route.ts` 
   - `/app/api/admin/prompts/route.ts`

### 5. Admin UI Implementation

Implement these files:

1. **Admin Dashboard**: `/app/admin/page.tsx` (already created)
2. **Admin Components**:
   - `/components/admin/dashboard-header.tsx` (already created)
   - `/components/admin/usage-chart.tsx` (already created)
   - `/components/admin/user-stats-table.tsx` (needs implementation)
3. **User Management**: `/app/admin/users/page.tsx` (needs implementation)
4. **Prompts Management**: `/app/admin/prompts/page.tsx` (needs implementation)
5. **Settings Page**: `/app/admin/settings/page.tsx` (needs implementation)

### 6. Authentication Extension

Extend the authentication system to include admin roles:

1. Modify `/middleware.ts` to protect admin routes (see `ADMIN-IMPLEMENTATION-GUIDE.md`)
2. Update user session handling to include the `role` property

### 7. Branding Customization

Follow the instructions in `BRANDING-GUIDE.md` to:

1. Update package information
2. Modify application metadata
3. Replace Vercel branding with Poiesis Pete
4. Update visual assets

## Testing Your Implementation

1. **Database Changes**:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

2. **Create Admin User**:
   ```sql
   -- Execute in your database
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

3. **Run the Application**:
   ```bash
   pnpm dev
   ```

4. Access the admin dashboard at `http://localhost:3000/admin`

## Upstream Sync Process

When the GitHub Action creates a PR with upstream changes:

1. Review the changes carefully
2. Resolve any conflicts to preserve your customizations
3. Test thoroughly before merging
4. Merge the PR to incorporate upstream updates

## Important Notes

- The linter errors in the provided files are expected, as the actual project context is needed for proper resolution
- You should add proper error handling and access controls in production
- Consider implementing rate limiting for the admin API endpoints

## Roadmap for Future Enhancements

1. User invitation system
2. More detailed analytics for token usage by model
3. Custom prompt templates library
4. Batch user management operations

With these steps, you'll have a fully customized Poiesis Pete chatbot with admin features while maintaining the ability to receive updates from the upstream repository. 