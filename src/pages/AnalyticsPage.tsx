
import { BarChartComponent } from "@/components/dashboard/BarChartComponent";
import { PieChartComponent } from "@/components/dashboard/PieChartComponent";
import { StatsCard } from "@/components/dashboard/StatsCard";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">View user activity and complaint statistics.</p>
        </div>
        <Separator />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Total Users"
            value="1,234"
            description="Active users this month"
          />
          <StatsCard 
            title="New Complaints"
            value="123"
            description="Submitted this week"
          />
          <StatsCard 
            title="Resolution Rate"
            value="89%"
            description="Average resolution time: 2.4 days"
          />
          <StatsCard 
            title="Satisfaction"
            value="4.5/5"
            description="Based on user feedback"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Complaints by Category</h3>
            <PieChartComponent />
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
            <BarChartComponent />
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
