import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { getTotalUsage } from '@/lib/usage';

export async function GET(req: Request) {
  const session = await auth();

  // Check if user is authenticated and is an admin
  if (!session?.user || session.user.role !== 'admin') {
    return new NextResponse('Unauthorized', { status: 403 });
  }

  // Get date range from query parameters
  const { searchParams } = new URL(req.url);
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');

  // Default to last 30 days if not specified
  const endDate = endDateParam ? new Date(endDateParam) : new Date();
  const startDate = startDateParam
    ? new Date(startDateParam)
    : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  try {
    const usageData = await getTotalUsage(startDate, endDate);

    // Calculate totals
    const totals = usageData.reduce(
      (acc, day) => {
        acc.totalTokens += day.tokensUsed || 0;
        acc.totalMessages += day.messagesSent || 0;
        acc.maxUsers = Math.max(acc.maxUsers, day.uniqueUsers || 0);
        return acc;
      },
      { totalTokens: 0, totalMessages: 0, maxUsers: 0 },
    );

    return NextResponse.json({
      success: true,
      data: {
        dailyUsage: usageData,
        totals,
      },
    });
  } catch (error) {
    console.error('Error fetching usage statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch usage statistics' },
      { status: 500 },
    );
  }
}
