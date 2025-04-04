import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/app/(auth)/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsageChart } from '@/components/admin/usage-chart';
import { UserStatsTable } from '@/components/admin/user-stats-table';
import { DashboardHeader } from '@/components/admin/dashboard-header';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Poiesis Pete Admin Dashboard',
};

export default async function AdminDashboardPage() {
  const session = await auth();

  // Redirect if user is not authenticated or not an admin
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex-1 space-y-4 p-8 pt-6">
        <DashboardHeader
          heading="Dashboard"
          text="Poiesis Pete admin control panel"
        />

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="prompts">Custom Prompts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+254</div>
                  <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tokens Used (30d)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3,421,872</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Conversations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,329</div>
                  <p className="text-xs text-muted-foreground">
                    +7% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Usage Overview</CardTitle>
                  <CardDescription>
                    Daily token usage over the past 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <UsageChart />
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Top Users</CardTitle>
                  <CardDescription>
                    Users with highest token usage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserStatsTable />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage users and their limits</CardDescription>
              </CardHeader>
              <CardContent>
                {/* User management UI will go here */}
                <p>This section will include user management functionality.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prompts" className="space-y-4">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Custom Prompts</CardTitle>
                <CardDescription>Manage user custom prompts</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Custom prompts UI will go here */}
                <p>This section will include custom prompts management.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
