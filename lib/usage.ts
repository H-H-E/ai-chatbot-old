import { eq, sql, and, gte, lte } from 'drizzle-orm';
import { db } from '@/lib/db';
import { usageStats } from '@/lib/db/schema';
import { nanoid } from 'nanoid';

export interface UsageData {
  userId: string;
  tokensUsed: number;
  messagesSent: number;
  conversationId?: string;
}

/**
 * Increments usage statistics for a user
 */
export async function incrementUsage(data: UsageData) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if there's an entry for today
  const existingStats = await db
    .select()
    .from(usageStats)
    .where(and(eq(usageStats.userId, data.userId), eq(usageStats.date, today)))
    .limit(1);

  if (existingStats.length > 0) {
    // Update existing entry
    await db
      .update(usageStats)
      .set({
        tokensUsed: sql`${usageStats.tokensUsed} + ${data.tokensUsed}`,
        messagesSent: sql`${usageStats.messagesSent} + ${data.messagesSent}`,
      })
      .where(eq(usageStats.id, existingStats[0].id));
  } else {
    // Create new entry for today
    await db.insert(usageStats).values({
      id: nanoid(),
      userId: data.userId,
      date: today,
      tokensUsed: data.tokensUsed,
      messagesSent: data.messagesSent,
      conversationId: data.conversationId,
    });
  }
}

/**
 * Checks if a user has exceeded their daily token limit
 */
export async function hasExceededDailyLimit(userId: string): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get user's limit
  const userLimits = await db.query.userLimits.findFirst({
    where: eq(db.query.userLimits.userId, userId),
  });

  // Default limit if not set
  const maxTokensPerDay = userLimits?.maxTokensPerDay || 10000;

  // Get today's usage
  const todayUsage = await db
    .select({
      totalTokens: sql<number>`sum(${usageStats.tokensUsed})`,
    })
    .from(usageStats)
    .where(and(eq(usageStats.userId, userId), eq(usageStats.date, today)))
    .then((rows) => rows[0]?.totalTokens || 0);

  return todayUsage >= maxTokensPerDay;
}

/**
 * Gets usage statistics for a specific date range
 */
export async function getUserUsage(
  userId: string,
  startDate: Date,
  endDate: Date,
) {
  return db
    .select({
      date: usageStats.date,
      tokensUsed: sql<number>`sum(${usageStats.tokensUsed})`,
      messagesSent: sql<number>`sum(${usageStats.messagesSent})`,
    })
    .from(usageStats)
    .where(
      and(
        eq(usageStats.userId, userId),
        gte(usageStats.date, startDate),
        lte(usageStats.date, endDate),
      ),
    )
    .groupBy(usageStats.date)
    .orderBy(usageStats.date);
}

/**
 * Gets total usage statistics across all users
 */
export async function getTotalUsage(startDate: Date, endDate: Date) {
  return db
    .select({
      date: usageStats.date,
      tokensUsed: sql<number>`sum(${usageStats.tokensUsed})`,
      messagesSent: sql<number>`sum(${usageStats.messagesSent})`,
      uniqueUsers: sql<number>`count(distinct ${usageStats.userId})`,
    })
    .from(usageStats)
    .where(and(gte(usageStats.date, startDate), lte(usageStats.date, endDate)))
    .groupBy(usageStats.date)
    .orderBy(usageStats.date);
}
