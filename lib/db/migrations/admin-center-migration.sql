-- Add pgvector extension if not already added
CREATE EXTENSION IF NOT EXISTS pgvector;

-- Create user_role enum type
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add role column to User table if it doesn't exist
DO $$ 
BEGIN
    ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" user_role NOT NULL DEFAULT 'user';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Create UserLimits table
CREATE TABLE IF NOT EXISTS "UserLimits" (
    "userId" UUID PRIMARY KEY REFERENCES "User"("id") ON DELETE CASCADE,
    "maxTokensPerDay" INTEGER NOT NULL DEFAULT 10000,
    "maxConversations" INTEGER NOT NULL DEFAULT 10,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create CustomPrompts table
CREATE TABLE IF NOT EXISTS "CustomPrompts" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "name" VARCHAR(256) NOT NULL,
    "prompt" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create UsageStats table
CREATE TABLE IF NOT EXISTS "UsageStats" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "date" DATE NOT NULL,
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,
    "messagesSent" INTEGER NOT NULL DEFAULT 0,
    "conversationId" UUID REFERENCES "Chat"("id") ON DELETE SET NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index for faster queries on usage stats
CREATE INDEX IF NOT EXISTS "idx_usage_stats_user_date" ON "UsageStats"("userId", "date");

-- Add default admin user (password will need to be set via application)
DO $$ 
BEGIN
    INSERT INTO "User" ("id", "email", "role") 
    VALUES (gen_random_uuid(), 'admin@poiesispete.com', 'admin') 
    ON CONFLICT ("email") DO NOTHING;
END $$; 