import { TokenUsage } from '@langchain/core/language_models/base';
import { db } from '@/lib/db';
import { usageStats, userLimits } from '@/lib/db/schema';
import { eq, sql, and, gte, lte } from 'drizzle-orm';
import { nanoid } from 'nanoid';

/**
 * Records token usage from Langchain response to the database
 */
export async function recordTokenUsage({
  userId,
  conversationId,
  promptTokens = 0,
  completionTokens = 0,
  totalTokens = 0,
  messages = 1,
}: {
  userId: string;
  conversationId?: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  messages?: number;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if there's an entry for today
  const existingStats = await db
    .select()
    .from(usageStats)
    .where(and(eq(usageStats.userId, userId), eq(usageStats.date, today)))
    .limit(1);

  const tokensToRecord = totalTokens || promptTokens + completionTokens;

  if (existingStats.length > 0) {
    // Update existing entry
    await db
      .update(usageStats)
      .set({
        tokensUsed: sql`${usageStats.tokensUsed} + ${tokensToRecord}`,
        messagesSent: sql`${usageStats.messagesSent} + ${messages}`,
      })
      .where(eq(usageStats.id, existingStats[0].id));
  } else {
    // Create new entry for today
    await db.insert(usageStats).values({
      id: nanoid(),
      userId,
      date: today,
      tokensUsed: tokensToRecord,
      messagesSent: messages,
      conversationId,
    });
  }
}

/**
 * Tracks token usage from Langchain's response
 */
export function createLangchainUsageTracker(
  userId: string,
  conversationId?: string,
) {
  return {
    handleLLMEnd: async (output: { usage?: TokenUsage }) => {
      if (output.usage) {
        const { promptTokens, completionTokens, totalTokens } = output.usage;
        await recordTokenUsage({
          userId,
          conversationId,
          promptTokens,
          completionTokens,
          totalTokens,
        });
      }
    },
  };
}

/**
 * Checks if a user has exceeded their daily token limit
 */
export async function hasExceededDailyLimit(userId: string): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get user's limit
  const userLimit = await db.query.userLimits.findFirst({
    where: eq(userLimits.userId, userId),
  });

  // Default limit if not set
  const maxTokensPerDay = userLimit?.maxTokensPerDay || 10000;

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
