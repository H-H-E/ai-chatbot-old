'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface UsageDataPoint {
  date: string;
  tokensUsed: number;
  messagesSent: number;
  uniqueUsers: number;
}

export function UsageChart() {
  const [data, setData] = useState<UsageDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch usage data
    async function fetchUsageData() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/stats');

        if (!response.ok) {
          throw new Error('Failed to fetch usage data');
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Unknown error');
        }

        // Format the data for the chart
        const formattedData = result.data.dailyUsage.map((item: any) => ({
          date: new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          tokensUsed: item.tokensUsed || 0,
          messagesSent: item.messagesSent || 0,
          uniqueUsers: item.uniqueUsers || 0,
        }));

        setData(formattedData);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
        console.error('Error fetching usage data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsageData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center">
        <div className="text-muted-foreground">Loading usage data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center">
        <div className="text-destructive">Error: {error}</div>
      </div>
    );
  }

  // If we have no data
  if (data.length === 0) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center">
        <div className="text-muted-foreground">No usage data available</div>
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="tokensUsed" name="Tokens Used" fill="#8884d8" />
          <Bar dataKey="messagesSent" name="Messages Sent" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
