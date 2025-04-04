# Poiesis Pete Setup Guide

This guide will walk you through setting up Poiesis Pete, a customized AI chatbot with admin features for managing user token limits and custom prompts.

## Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- OpenAI API key

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/poiesis-pete.git
cd poiesis-pete
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Edit the `.env` file and add your configuration:

```
# Database
DATABASE_URL=postgres://username:password@localhost:5432/poiesis_pete

# Authentication (generate a random string with `openssl rand -base64 32`)
AUTH_SECRET=your-secret-key

# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key

# Optional: Vercel Blob for file uploads
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

## Database Setup

1. Run the initial database migration:

```bash
pnpm db:migrate
```

2. Run the admin center migration:

```bash
pnpm db:migrate:admin
```

This will:
- Add the user role enum
- Add admin capabilities to the user table
- Create tables for user limits, custom prompts, and usage tracking
- Create a default admin user (email: admin@poiesispete.com)

3. Set a password for the admin user using the SQL command in your database:

```sql
UPDATE "User" SET "password" = 'bcrypt-hashed-password' WHERE "email" = 'admin@poiesispete.com';
```

You'll need to generate a bcrypt hash for your password. You can use online tools or the bcrypt-ts library.

## Running the Application

1. Start the development server:

```bash
pnpm dev
```

2. Access the application at http://localhost:3000

3. Access the admin dashboard at http://localhost:3000/admin

## Syncing with Upstream Repository

The application includes a GitHub Action workflow to synchronize with the upstream repository for security updates while preserving your customizations:

1. Add the upstream repository as a remote:

```bash
git remote add upstream https://github.com/vercel/ai-chatbot.git
```

2. The GitHub Action will automatically create a pull request weekly with upstream changes.

3. Review the changes, resolve any conflicts, and merge the PR to incorporate updates.

## Admin Center Features

### User Management

The admin center allows you to:
- View all users
- Set token limits for each user
- Manage custom prompts
- View usage statistics

### Token Tracking

Token usage is automatically tracked using Langchain-JS integration, providing accurate metrics on:
- Daily token usage per user
- Total token consumption
- Message counts

## Customization

You can further customize Poiesis Pete:

1. Update UI elements in the components directory
2. Modify the admin dashboard in app/admin
3. Add new features to the token tracking system

## Troubleshooting

### Database Connection Issues

If you encounter database connection problems:

1. Verify your DATABASE_URL in the .env file
2. Ensure PostgreSQL is running
3. Check that the database exists and is accessible

### Authentication Problems

If you can't log in:

1. Make sure you've set up the admin user password
2. Verify the AUTH_SECRET in your .env file
3. Check for any auth-related errors in the server logs

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
- [Langchain-JS Documentation](https://js.langchain.com/docs/)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs) 