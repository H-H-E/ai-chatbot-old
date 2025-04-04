# Rebranding Guide: Vercel AI Chatbot to Poiesis Pete

This guide outlines the steps to rebrand the Vercel AI Chatbot to Poiesis Pete while preserving the functionality.

## 1. Package and Repository Information

Update the project name and description:

```bash
# package.json
{
  "name": "poiesis-pete",
  "description": "Poiesis Pete - An AI assistant powered by OpenAI",
  # ... other fields
}
```

## 2. Application Metadata

Update the application metadata in `app/layout.tsx`:

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    template: '%s | Poiesis Pete',
    default: 'Poiesis Pete - Your AI Assistant'
  },
  description: 'AI assistant powered by OpenAI',
  // ... other metadata
}
```

## 3. UI Components with Branding

### Header Component

Update the header in `components/chat-header.tsx`:

```typescript
// components/chat-header.tsx
// Replace Vercel logo with your own
export function ChatHeader() {
  return (
    <div className="flex items-center justify-between sm:px-4">
      <Link href="/" className="flex items-center">
        {/* Replace Vercel logo with Poiesis Pete logo */}
        <span className="ml-2 text-xl font-semibold">Poiesis Pete</span>
      </Link>
      {/* ... other header content */}
    </div>
  )
}
```

### Sidebar Branding

Update the sidebar in `components/app-sidebar.tsx`:

```typescript
// components/app-sidebar.tsx
export function AppSidebar() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3">
        <h1 className="text-xl font-bold">Poiesis Pete</h1>
        <div className="text-sm text-gray-500">Your AI Assistant</div>
      </div>
      {/* ... rest of sidebar */}
    </div>
  )
}
```

## 4. Replace Visual Assets

Replace the following assets with your own:

1. Favicon: `/app/favicon.ico`
2. Open Graph image: `/app/(chat)/opengraph-image.png`
3. Twitter image: `/app/(chat)/twitter-image.png`
4. Any Vercel logos used in the UI components

## 5. Update Documentation

1. Update `README.md` with your project information
2. Update `LICENSE` file if necessary (consult legal advice)

## 6. Footer Attribution

If there's a footer component with Vercel attribution, update it:

```typescript
// components/footer.tsx or similar
export function Footer() {
  return (
    <footer className="...">
      <p>© {new Date().getFullYear()} Poiesis Pete</p>
      {/* ... other footer content */}
    </footer>
  )
}
```

## 7. Environment Variables

Check `.env.example` and update any Vercel-specific variables if needed.

## 8. Deployment Configuration

If there are Vercel-specific deployment configurations, update those as appropriate for your hosting environment.

Remember to regularly sync with the upstream repository using the GitHub Action workflow, which will help you receive security updates while maintaining your branding changes. 